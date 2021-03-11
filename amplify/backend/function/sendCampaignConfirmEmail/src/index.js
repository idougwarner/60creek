const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const AWS = require("aws-sdk");
const jsoncsv = require("react-papaparse");
const ssm = new AWS.SSM();

const sibApiV3KeyPath = `/sixtycreek-${process.env.ENV}/sib-api-v3-key`;
const adminEmailPath = `/sixtycreek-${process.env.ENV}/admin-email`;
const campaignConfirmTemplateIdPath = `/sixtycreek-${process.env.ENV}/sib-template-campaign-confirmation`;
const adminConfirmTemplateIdPath = `/sixtycreek-${process.env.ENV}/sib-template-campaign-confirmation-admin`;

const envPromise = ssm
  .getParameters({
    Names: [sibApiV3KeyPath, adminEmailPath],
    WithDecryption: true,
  })
  .promise();

const sibTemplateIdsPromise = ssm
  .getParameters({
    Names: [campaignConfirmTemplateIdPath, adminConfirmTemplateIdPath],
    WithDecryption: false,
  })
  .promise();

const getEnvValue = (values, key) => {
  const r = values.filter((item) => item.Name === key);
  if (r.length > 0) {
    return r[0].Value;
  }
  return "";
};
exports.handler = async (event) => {
  const apiKey = defaultClient.authentications["api-key"];
  const envVariables = await envPromise;
  apiKey.apiKey = getEnvValue(envVariables.Parameters, sibApiV3KeyPath);
  const templateIds = await sibTemplateIdsPromise;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  sendSmtpEmail = {
    to: [
      {
        email: event.arguments.input.email,
        name: event.arguments.input.name,
      },
    ],
    templateId: parseInt(
      getEnvValue(templateIds.Parameters, campaignConfirmTemplateIdPath)
    ),
    params: event.arguments.input.emailData,
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
  };
  let sendSmtpAdminEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  let emailAttachement = new SibApiV3Sdk.SendSmtpEmailAttachment();

  const data = jsoncsv.jsonToCSV(event.arguments.input.prospects);
  const buff = new Buffer.from(data);
  emailAttachement.content = buff.toString("base64");
  emailAttachement.name = event.arguments.input.emailData.prospectList + ".csv";
  sendSmtpAdminEmail = {
    to: [
      {
        email: getEnvValue(envVariables.Parameters, adminEmailPath),
        name: "60 Creek",
      },
    ],
    templateId: parseInt(
      getEnvValue(templateIds.Parameters, campaignConfirmTemplateIdPath)
    ),
    params: event.arguments.input.emailData,
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
    attachment: [emailAttachement],
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    await apiInstance.sendTransacEmail(sendSmtpAdminEmail);
    return {
      data: "A campaign confirmation email has been sent successfully!",
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
