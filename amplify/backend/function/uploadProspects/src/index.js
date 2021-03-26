const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const axios = require("axios");
const csv = require("csvtojson");

// get reference to S3 client
const s3 = new AWS.S3();

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;
const stripeSecretKeyPath = `/sixtycreek-${process.env.ENV}/stripe-secret-key`;
const srcBucketNamePath = `/sixtycreek-${process.env.ENV}/src-bucket-name`;

const envPromise = ssm
  .getParameters({
    Names: [
      graphqlEndpointPath,
      appsyncApiKeyPath,
      stripeSecretKeyPath,
      srcBucketNamePath,
    ],
    WithDecryption: true,
  })
  .promise();

const updateProspectList = gql`
  mutation UpdateProspectList(
    $input: UpdateProspectListInput!
    $condition: ModelProspectListConditionInput
  ) {
    updateProspectList(input: $input, condition: $condition) {
      id
      userId
      name
      file
      enhance
      customerEmail
      customerId
      paymentMethodId
      amount
      uploadStatus
      createdAt
      updatedAt
    }
  }
`;

const batchCreateProspects = gql`
  mutation BatchCreateProspects($prospects: [BatchCreateProspectInput]) {
    batchCreateProspects(prospects: $prospects) {
      items {
        id
        userId
        prospectListId
      }
      nextToken
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

const MAX_ITEMS = 25; // don't change this value

exports.handler = async (event) => {
  try {
    const envVariables = await envPromise;
    const params = envVariables.Parameters;
    const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
    const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);
    const {
      file,
      prospectListId,
      userId,
      customerId,
      customerEmail,
      paymentMethodId,
      enhance,
      srcBucketName,
    } = event.arguments.input;

    const s3Param = {
      Bucket: srcBucketName,
      Key: "public/" + encodeURIComponent(file),
    };

    const stream = s3.getObject(s3Param).createReadStream();
    const data = await csv().fromStream(stream);
    for (let i = 0; i < data.length; i += MAX_ITEMS) {
      const prospects = data.slice(i, i + MAX_ITEMS);
      await axios({
        url: graphqlEndpoint,
        method: "post",
        headers: {
          "x-api-key": appsyncApiKey,
        },
        data: {
          query: print(batchCreateProspects),
          variables: {
            prospects: prospects.map((item) => ({
              userId: userId,
              prospectListId: prospectListId,
              firstName: item.firstName,
              lastName: item.lastName,
              address1: item.address1,
              city: item.city,
              state: item.state,
              zip: item.zip,
              company: item.company,
              phone: item.phone,
              email: item.email,
              facebook: item.facebook,
              status: item.status,
              enhance: item.enhance,
              enhanced: false,
              fetched: false,
              demographic: null,
              lifestyle: null,
            })),
          },
        },
      });
    }
    await s3.deleteObject(s3Param).promise();
    await axios({
      url: graphqlEndpoint,
      method: "post",
      headers: {
        "x-api-key": appsyncApiKey,
      },
      data: {
        query: print(updateProspectList),
        variables: {
          input: {
            id: prospectListId,
            file: file,
            customerId: customerId,
            customerEmail: customerEmail,
            paymentMethodId: paymentMethodId,
            enhance: enhance,
            uploadStatus: enhance ? "need-enhance" : "completed",
          },
        },
      },
    });

    return "Successfully uploaded prospects";
  } catch (err) {
    return new Error(err).message;
  }
};
