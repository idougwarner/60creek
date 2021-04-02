const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;
const axios = require('axios');

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;

const envPromise = ssm
  .getParameters({
    Names: [graphqlEndpointPath, appsyncApiKeyPath],
    WithDecryption: true,
  })
  .promise();

const fetchEnhanceData = gql`
  mutation FetchEnhanceData($input: FetchEnhanceDataInput) {
    fetchEnhanceData(input: $input)
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

    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i];
      if (
        record.eventName === 'INSERT' &&
        record.dynamodb.NewImage.enhance.BOOL === true
      ) {
        console.log(record);
        const id = record.dynamodb.NewImage.id.S;
        const firstName = record.dynamodb.NewImage.firstName.S;
        const lastName = record.dynamodb.NewImage.lastName.S;
        const email = record.dynamodb.NewImage.email.S;
        const phone = record.dynamodb.NewImage.phone.S;
        const city = record.dynamodb.NewImage.city.S;
        const state = record.dynamodb.NewImage.state.S;
        const zip = record.dynamodb.NewImage.zip.S;
        const address1 = record.dynamodb.NewImage.address1.S;

        await axios({
          url: graphqlEndpoint,
          method: 'post',
          headers: {
            'x-api-key': appsyncApiKey,
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
    }
    return 'Successfully processed DynamoDB record';
  } catch (err) {
    console.log(err);
    return new Error(err).message;
  }
};
