const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;
const axios = require('axios');

// get reference to S3 client
const s3 = new AWS.S3();

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;

const envPromise = ssm
  .getParameters({
    Names: [graphqlEndpointPath, appsyncApiKeyPath],
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
  return '';
};

const MAX_ITEMS = 25; // don't change this value

// eslint-disable-next-line
exports.handler = async function (event, context) {
  try {
    const envVariables = await envPromise;
    const params = envVariables.Parameters;
    const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
    const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);

    console.log(event.Records[0].s3);
    if (event.Records[0].eventName !== 'ObjectCreated:Put') return;

    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    if (!key.includes('public/prospects/')) return;

    const s3Param = {
      Bucket: bucket,
      Key: key,
    };
    const file = await s3.getObject(s3Param).promise();
    const fileData = JSON.parse(file.Body.toString());
    const prospects = fileData.prospects;
    const prospectList = fileData.prospectList;

    for (let i = 0; i < prospects.length; i += MAX_ITEMS) {
      const data = prospects.slice(i, i + MAX_ITEMS);
      await axios({
        url: graphqlEndpoint,
        method: 'post',
        headers: {
          'x-api-key': appsyncApiKey,
        },
        data: {
          query: print(batchCreateProspects),
          variables: {
            prospects: data,
          },
        },
      });
    }
    await s3.deleteObject(s3Param).promise();
    const r = await axios({
      url: graphqlEndpoint,
      method: 'post',
      headers: {
        'x-api-key': appsyncApiKey,
      },
      data: {
        query: print(updateProspectList),
        variables: {
          input: {
            ...prospectList,
            amount: prospectList.enhance ? prospects.length : 0,
          },
        },
      },
    });
    console.log(r.data);
  } catch (err) {
    console.log(err);
  }
  context.done(null, 'Successfully processed S3 event'); // SUCCESS with message
};
