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

  const { userId, email, cognitoUserName } = event.arguments.input;
  try {
    const params = {
      UserAttributes: [{ Name: "email", Value: email }],
      Username: cognitoUserName,
      UserPoolId: cognitoPoolId,
    };
    const rt = await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
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
            id: userId,
            email: email,
          },
        },
      },
    });
    return {
      data: "Your email has been changed successfully!",
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
