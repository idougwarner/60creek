const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const sibApiKeyPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/sib-api-v3-key`,
    WithDecryption: true,
  })
  .promise();

const sibCampaignConfirmationTemplatePromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/sib-template-campaign-confirmation`,
    WithDecryption: false,
  })
  .promise();

exports.handler = async (event) => {
  const apiKey = defaultClient.authentications["api-key"];
  const sibApiV3Key = await sibApiKeyPromise;
  apiKey.apiKey = sibApiV3Key.Parameter.Value;
  const sibCampaignConfirmationTemplate = await sibCampaignConfirmationTemplatePromise;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  sendSmtpEmail = {
    to: [
      {
        email: event.arguments.input.email,
        name: event.arguments.input.name,
      },
    ],
    templateId: parseInt(sibCampaignConfirmationTemplate.Parameter.Value),
    params: event.arguments.input.emailData,
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
  };
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return {
      data: "A campaign confirmation email has been sent successfully!",
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
