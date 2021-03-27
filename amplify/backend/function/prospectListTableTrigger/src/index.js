const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const axios = require("axios");

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

const prospectsByProspectListId = gql`
  query ProspectsByProspectListId(
    $prospectListId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelProspectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    prospectsByProspectListId(
      prospectListId: $prospectListId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        firstName
        lastName
        phone
        email
      }
      nextToken
      scannedCount
      count
    }
  }
`;

const fetchEnhanceData = gql`
  mutation FetchEnhanceData($input: FetchEnhanceDataInput) {
    fetchEnhanceData(input: $input)
  }
`;

// const delay_ms = (ms) => {
//   return new Promise((resolver) => {
//     setTimeout(() => {
//       return resolver(true);
//     }, ms);
//   });
// };
const getEnvValue = (values, key) => {
  const r = values.filter((item) => item.Name === key);
  if (r.length > 0) {
    return r[0].Value;
  }
  return "";
};
exports.handler = async (event) => {
  try {
    const envVariables = await envPromise;
    const params = envVariables.Parameters;
    const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
    const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);
    const stripeSecretKey = getEnvValue(params, stripeSecretKeyPath);

    const stripe = require("stripe")(stripeSecretKey);

    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i];
      if (
        record.eventName === "MODIFY" &&
        record.dynamodb.NewImage.uploadStatus.S === "need-enhance"
      ) {
        const prospectListId = record.dynamodb.NewImage.id.S;
        const customerId = record.dynamodb.NewImage.customerId.S;
        const customerEmail = record.dynamodb.NewImage.customerEmail.S;
        const paymentMethodId = record.dynamodb.NewImage.paymentMethodId.S;

        const graphqlData = await axios({
          url: graphqlEndpoint,
          method: "post",
          headers: {
            "x-api-key": appsyncApiKey,
          },
          data: {
            query: print(prospectsByProspectListId),
            variables: {
              prospectListId: prospectListId,
              limit: 200000,
              filter: {
                enhance: { eq: true },
                fetched: { eq: false },
              },
            },
          },
        });

        const prospects = graphqlData.data.data.prospectsByProspectListId.items;

        if (prospects.length > 0) {
          await stripe.paymentIntents.create({
            amount: parseInt(prospects.length * 100),
            currency: "usd",
            customer: customerId,
            payment_method: paymentMethodId,
            receipt_email: customerEmail,
            off_session: true,
            confirm: true,
            description: "Enhanced prospects uploaded",
          });
        }
        console.log("enhanced prospects:", prospects.length);
        for (let j = 0; j < prospects.length; j++) {
          const {
            id,
            firstName,
            lastName,
            email,
            phone,
            city,
            state,
            zip,
            address1,
          } = prospects[j];

          axios({
            url: graphqlEndpoint,
            method: "post",
            headers: {
              "x-api-key": appsyncApiKey,
            },
            data: {
              query: print(fetchEnhanceData),
              variables: {
                input: {
                  prospectId: id,
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  phone: phone,
                  city: city,
                  state: state,
                  zip: zip,
                  address1: address1,
                },
              },
            },
          });
        }
        // await delay_ms(10000);
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
                uploadStatus: "completed",
                customerId: "-",
                amount: 0,
              },
            },
          },
        });
      }
    }
    return "Successfully processed DynamoDB record";
  } catch (err) {
    console.log(err);
    return new Error(err).message;
  }
};
