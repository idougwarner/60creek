const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const axios = require("axios");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const cognitoPoolIdPath = `/sixtycreek-${process.env.ENV}/cognito-pool-id`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;

const envPromise = ssm
  .getParameters({
    Names: [graphqlEndpointPath, appsyncApiKeyPath, cognitoPoolIdPath],
    WithDecryption: true,
  })
  .promise();
const usersByUserResetToken = gql`
  query UsersByUserResetToken(
    $code: String
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUserResetToken(
      code: $code
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cognitoUserName
        email
      }
      nextToken
    }
  }
`;

const updateUser = gql`
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      code
    }
  }
`;

const getEnvValue = (values, key) => {
  const r = values.filter((item) => item.Name === key);
  if (r.length > 0) {
    return r[0].Value;
  }
  return "";
};
exports.handler = async (event) => {
  const envVariables = await envPromise;
  const params = envVariables.Parameters;
  const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
  const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);
  const cognitoPoolId = getEnvValue(params, cognitoPoolIdPath);

  const { token, password } = event.arguments.input;
  const decodedData = jwt.decode(token);
  if (new Date().getTime() > decodedData.exp * 1000) {
    return { data: null, error: { message: "Your reset link expired" } };
  } else {
    try {
      const graphqlData = await axios({
        url: graphqlEndpoint,
        method: "post",
        headers: {
          "x-api-key": appsyncApiKey,
        },
        data: {
          query: print(usersByUserResetToken),
          variables: {
            limit: 2,
            code: token,
          },
        },
      });
      const users = graphqlData.data.data.usersByUserResetToken.items;
      if (users.length > 0) {
        const params = {
          Password: password,
          Permanent: true,
          Username: users[0].cognitoUserName,
          UserPoolId: cognitoPoolId,
        };
        const user = await cognitoIdentityServiceProvider
          .adminSetUserPassword(params)
          .promise();
        await axios({
          url: graphqlEndpoint,
          method: "post",
          headers: {
            "x-api-key": appsyncApiKey,
          },
          data: {
            query: print(updateUser),
            variables: {
              input: {
                id: users[0].id,
                code: "-",
              },
            },
          },
        });
        return { data: "Your password has been changed successfully!", error: null };
      } else {
        return { data: null, error: { message: "Your reset link is not valid." } };
      }
    } catch (err) {
      return { data: null, error: { message: new Error(err).message } };
    }
  }
};
