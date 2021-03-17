const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const axios = require("axios");

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;
const stripeSecretKeyPath = `/sixtycreek-${process.env.ENV}/stripe-secret-key`;
const datafinderKeyPath = `/sixtycreek-${process.env.ENV}/datafinder-key`;

const envPromise = ssm
  .getParameters({
    Names: [
      graphqlEndpointPath,
      appsyncApiKeyPath,
      stripeSecretKeyPath,
      datafinderKeyPath,
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

const updateProspect = gql`
  mutation UpdateProspect(
    $input: UpdateProspectInput!
    $condition: ModelProspectConditionInput
  ) {
    updateProspect(input: $input, condition: $condition) {
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

exports.handler = async (event) => {
  try {
    const envVariables = await envPromise;
    const params = envVariables.Parameters;
    const graphqlEndpoint = getEnvValue(params, graphqlEndpointPath);
    const appsyncApiKey = getEnvValue(params, appsyncApiKeyPath);
    const stripeSecretKey = getEnvValue(params, stripeSecretKeyPath);
    const datafinderKey = getEnvValue(params, datafinderKeyPath);

    const stripe = require("stripe")(stripeSecretKey);
    //eslint-disable-line
    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i];
      if (
        record.eventName === "MODIFY" &&
        record.dynamodb.NewImage.uploadCompleted.BOOL
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
        for (let j = 0; j < prospects.length; j++) {
          const prospectId = prospects[j].id;
          const firstName = prospects[j].firstName;
          const lastName = prospects[j].lastName;
          const email = prospects[j].email;
          const phone = prospects[j].phone;

          let dt = {};

          {
            let rt;

            if (email && !phone) {
              rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
                params: {
                  service: "phone",
                  k2: datafinderKey,
                  d_email: email,
                  d_first: firstName ? firstName : null,
                  d_last: lastName ? lastName : null,
                },
              });
            } else if (email || phone) {
              rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
                params: {
                  service: "email",
                  k2: datafinderKey,
                  d_phone: phone,
                  d_first: firstName ? firstName : null,
                  d_last: lastName ? lastName : null,
                },
              });
            }

            if (rt && rt.data && rt.data.datafinder["num-results"] > 0) {
              const fetchedData = rt.data.datafinder.results[0];
              dt = {
                firstName:
                  fetchedData.FirstName +
                    (fetchedData.MiddleName
                      ? " " + fetchedData.MiddleName
                      : "") || firstName,
                lastName: fetchedData.LastName || lastName,
                address1: fetchedData.Address,
                city: fetchedData.City,
                state: fetchedData.State,
                zip: fetchedData.Zip,
                phone: fetchedData.Phone || phone,
                email: fetchedData.Email || email,
              };
            }

            let rtSocial = await axios.get(
              "https://api.datafinder.com/v2/qdf.php",
              {
                params: {
                  service: "social",
                  k2: datafinderKey,
                  d_email: email ? email : null,
                  d_first: firstName ? firstName : null,
                  d_last: lastName ? lastName : null,
                },
              }
            );
            if (rtSocial.data && rtSocial.data.datafinder["num-results"] > 0) {
              const fetchedData = rtSocial.data.datafinder.results[0];
              dt.facebook = fetchedData.FBURL;
            }
          }
          {
            let rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
              params: {
                service: "demograph",
                k2: datafinderKey,
                d_email: email ? email : null,
                d_phone: phone ? phone : null,
                d_first: firstName ? firstName : null,
                d_last: lastName ? lastName : null,
              },
            });
            if (rt.data && rt.data.datafinder["num-results"] > 0) {
              const fetchedData = rt.data.datafinder.results[0];
              dt.demographic = {
                DOB: fetchedData.DOB,
                ageRange: fetchedData.AgeRange,
                ethnicCode: fetchedData.EthnicCode,
                singleParent: fetchedData.SingleParent,
                seniorAdultInHousehold: fetchedData.SeniorAdultInHousehold,
                youngAdultInHousehold: fetchedData.YoungAdultInHousehold,
                workingWoman: fetchedData.WorkingWoman,
                SOHOIndicator: fetchedData.SOHOIndicator,
                businessOwner: fetchedData.BusinessOwner,
                language: fetchedData.Language,
                religion: fetchedData.Religion,
                numberOfChildren: fetchedData.NumberOfChildren,
                maritalStatusInHousehold: fetchedData.MaritalStatusInHousehold,
                homeOwnerRenter: fetchedData.HomeOwnerRenter,
                education: fetchedData.Education,
                occupation: fetchedData.Occupation,
                occupationDetail: fetchedData.OccupationDetail,
                gender: fetchedData.Gender,
                socialPresence: fetchedData.SocialPresence,
                presenceOfChildren: fetchedData.PresenceOfChildren,
              };
            }
          }
          {
            let rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
              params: {
                service: "lifeint",
                k2: datafinderKey,
                d_email: email ? email : null,
                d_phone: phone ? phone : null,
                d_first: firstName ? firstName : null,
                d_last: lastName ? lastName : null,
              },
            });
            if (rt.data && rt.data.datafinder["num-results"] > 0) {
              const fetchedData = rt.data.datafinder.results[0];
              dt.lifestyle = {
                magazines: fetchedData.Magazines,
                computerAndTechnology: fetchedData.ComputerAndTechnology,
                dietingWeightLoss: fetchedData.DietingWeightLoss,
                exerciseHealthGrouping: fetchedData.ExerciseHealthGrouping,
                doItYourselferHomeImprovement:
                  fetchedData.DoItYourselferHomeImprovement,
                jewelry: fetchedData.Jewelry,
                mailOrderBuyer: fetchedData.MailOrderBuyer,
                membershipClubs: fetchedData.MembershipClubs,
                travelGrouping: fetchedData.TravelGrouping,
                onlineEducation: fetchedData.OnlineEducation,
                sportsGrouping: fetchedData.SportsGrouping,
                sportsOutdoorsGrouping: fetchedData.SportsOutdoorsGrouping,
                investing: fetchedData.Investing,
                booksAndReading: fetchedData.BooksAndReading,
                politicalDonor: fetchedData.PoliticalDonor,
                hobbiesAndCrafts: fetchedData.HobbiesAndCrafts,
                cosmetics: fetchedData.Cosmetics,
                charitableDonations: fetchedData.CharitableDonations,
                artsAntiquesCollectibles: fetchedData.ArtsAntiquesCollectibles,
                petOwner: fetchedData.PetOwner,
                cooking: fetchedData.Cooking,
                autoPartsAccessories: fetchedData.AutoPartsAccessories,
                healthBeautyWellness: fetchedData.HealthBeautyWellness,
                parentingAndChildrensProducts:
                  fetchedData.ParentingAndChildrensProducts,
                music: fetchedData.Music,
                movie: fetchedData.Movie,
                selfImprovement: fetchedData.SelfImprovement,
                womensApparel: fetchedData.WomensApparel,
              };
            }
          }

          await axios({
            url: graphqlEndpoint,
            method: "post",
            headers: {
              "x-api-key": appsyncApiKey,
            },
            data: {
              query: print(updateProspect),
              variables: {
                input: {
                  id: prospectId,
                  fetched: true,
                  enhanced: Object.keys(dt).length > 0 ? true : false,
                  ...dt,
                },
              },
            },
          });
        }

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
                uploadCompleted: false,
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
    return new Error(err).message;
  }
};
