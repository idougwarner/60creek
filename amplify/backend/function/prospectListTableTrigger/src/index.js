const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;
const axios = require('axios');

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;
const stripeSecretKeyPath = `/sixtycreek-${process.env.ENV}/stripe-secret-key`;

const envPromise = ssm
  .getParameters({
    Names: [graphqlEndpointPath, appsyncApiKeyPath, stripeSecretKeyPath],
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

const getEnvValue = (values, key) => {
  const r = values.filter((item) => item.Name === key);
  if (r.length > 0) {
    return r[0].Value;
  }
  return '';
};
exports.handler = async (event) => {
  try {
    const envVariables = await envPromise;
    const params = envVariables.Parameters;
    const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
    const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);
    const stripeSecretKey = getEnvValue(params, stripeSecretKeyPath);

    const stripe = require('stripe')(stripeSecretKey);

    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i];
      if (
        record.eventName === 'MODIFY' &&
        record.dynamodb.NewImage.uploadStatus.S === 'need-enhance'
      ) {
        const prospectListId = record.dynamodb.NewImage.id.S;
        const customerId = record.dynamodb.NewImage.customerId.S;
        const customerEmail = record.dynamodb.NewImage.customerEmail.S;
        const paymentMethodId = record.dynamodb.NewImage.paymentMethodId.S;
        const amount = record.dynamodb.NewImage.amount.N;

        if (amount > 1) {
          await stripe.paymentIntents.create({
            amount: Number.round(amount * 100),
            currency: 'usd',
            customer: customerId,
            payment_method: paymentMethodId,
            receipt_email: customerEmail,
            off_session: true,
            confirm: true,
            description: 'Enhanced prospects uploaded',
          });
        }
        await axios({
          url: graphqlEndpoint,
          method: 'post',
          headers: {
            'x-api-key': appsyncApiKey,
          },
          data: {
            query: print(updateProspectList),
            variables: {
              input: {
                id: prospectListId,
                uploadStatus: 'completed',
                customerId: '-',
                amount: 0,
              },
            },
          },
        });
      }
    }
    return 'Successfully processed DynamoDB record';
  } catch (err) {
    console.log(err);
    return new Error(err).message;
  }
};
