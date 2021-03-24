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
    }
  }
`;

const createProspect = gql`
  mutation CreateProspect(
    $input: CreateProspectInput!
    $condition: ModelProspectConditionInput
  ) {
    createProspect(input: $input, condition: $condition) {
      id
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

const delay = (ms) => {
  return new Promise((resolver) => {
    setTimeout(() => {
      return resolver(true);
    }, ms);
  });
};

exports.handler = async (event) => {
  try {
    const envVariables = await envPromise;
    const params = envVariables.Parameters;
    const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
    const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);
    // const srcBucketName = getEnvValue(params, srcBucketNamePath);
    console.log(
      "=============  event start =============== >  ",
      event.arguments.input
    );
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
    const prospects = await csv().fromStream(stream);
    console.log("prospects count: ", prospects.length);
    await s3.deleteObject(s3Param).promise();
    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];

      axios({
        url: graphqlEndpoint,
        method: "post",
        headers: {
          "x-api-key": appsyncApiKey,
        },
        data: {
          query: print(createProspect),
          variables: {
            input: {
              userId: userId,
              prospectListId: prospectListId,
              ...prospect,
              enhance: enhance ? true : false,
              enhanced: false,
              fetched: false,
              demographic: null,
              lifestyle: null,
            },
          },
        },
      });
    }
    await delay(10000);
    if (enhance) {
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
              customerId: customerId,
              customerEmail: customerEmail,
              paymentMethodId: paymentMethodId,
              enhance: enhance,
              uploadCompleted: true,
            },
          },
        },
      });
    }
    console.log("=============  upload completed ============");

    return "Successfully uploaded prospects";
  } catch (err) {
    console.log(err);
    return new Error(err).message;
  }
};
