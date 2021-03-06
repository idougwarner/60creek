const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const axios = require("axios");

const sibApiV3KeyPath = `/sixtycreek-${process.env.ENV}/sib-api-v3-key`;
const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;

const envPromise = ssm
  .getParameters({
    Names: [sibApiV3KeyPath, graphqlEndpointPath, appsyncApiKeyPath],
    WithDecryption: true,
  })
  .promise();

const sibResetPasswordTemplatePromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/sib-template-reset-password`,
    WithDecryption: false,
  })
  .promise();

const usersByUserEmail = gql`
  query UsersByUserEmail(
    $email: String
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUserEmail(
      email: $email
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
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
const createResetToken = (email, provider = "email") =>
  jwt.sign(
    { email: email.toLowerCase(), provider },
    "resetpasswordpassportsecret",
    {
      expiresIn: 24 * 60 * 60, // 1 week
    }
  );
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
  const sibResetPasswordTemplate = await sibResetPasswordTemplatePromise;

  const { email, link } = event.arguments.input;
  const token = createResetToken(email.toLowerCase());

  try {
    const graphqlData = await axios({
      url: graphqlEndpoint,
      method: "post",
      headers: {
        "x-api-key": appsyncApiKey,
      },
      data: {
        query: print(usersByUserEmail),
        variables: {
          limit: 2,
          email: email,
        },
      },
    });
    const users = graphqlData.data.data.usersByUserEmail.items;
    if (users.length > 0) {
      const rt = await axios({
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
              code: token,
            },
          },
        },
      });

      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = getEnvValue(params, sibApiV3KeyPath);
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

      sendSmtpEmail = {
        to: [
          {
            email: email,
          },
        ],
        templateId: parseInt(sibResetPasswordTemplate.Parameter.Value),
        params: {
          resetLink: `${link}/${token}`,
        },
        headers: {
          "X-Mailin-custom":
            "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        },
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      return { data: "Email has sent successfully!", error: null };
    } else {
      return { data: null, error: { message: "User does not exist." } };
    }
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
