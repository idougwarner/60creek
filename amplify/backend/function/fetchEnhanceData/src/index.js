const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const axios = require("axios");

const graphqlEndpointPath = `/sixtycreek-${process.env.ENV}/graphql-endpoint`;
const appsyncApiKeyPath = `/sixtycreek-${process.env.ENV}/appsync-api-key`;
const datafinderKeyPath = `/sixtycreek-${process.env.ENV}/datafinder-key`;

const envPromise = ssm
  .getParameters({
    Names: [graphqlEndpointPath, appsyncApiKeyPath, datafinderKeyPath],
    WithDecryption: true,
  })
  .promise();

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
    const datafinderKey = getEnvValue(params, datafinderKeyPath);

    //eslint-disable-line
    const {
      prospectId,
      firstName,
      lastName,
      email,
      phone,
      address1,
      city,
      zip,
      state,
    } = event.arguments.input;

    let dt = {};
    const queryParams = {
      d_phone: phone ? phone : null,
      d_email: email ? email : null,
      d_first: firstName ? firstName : null,
      d_last: lastName ? lastName : null,
      d_zip: zip ? zip : null,
      d_state: state ? state : null,
      d_city: city ? city : null,
      d_fulladdr: address1 ? address1 : null,
    };

    {
      let rt;

      if (email && !phone) {
        rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
          params: {
            service: "phone",
            k2: datafinderKey,
            ...queryParams,
          },
        });
      } else if (email || phone) {
        rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
          params: {
            service: "email",
            k2: datafinderKey,
            ...queryParams,
          },
        });
      }

      if (rt && rt.data && rt.data.datafinder["num-results"] > 0) {
        const fetchedData = rt.data.datafinder.results[0];
        dt = {
          firstName:
            fetchedData.FirstName +
              (fetchedData.MiddleName ? " " + fetchedData.MiddleName : "") ||
            firstName,
          lastName: fetchedData.LastName || lastName,
          address1: fetchedData.Address,
          city: fetchedData.City,
          state: fetchedData.State,
          zip: fetchedData.Zip,
          phone: fetchedData.Phone || phone,
          email: fetchedData.Email || email,
        };
      }

      let rtSocial = await axios.get("https://api.datafinder.com/v2/qdf.php", {
        params: {
          service: "social",
          k2: datafinderKey,
          ...queryParams,
        },
      });
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
          ...queryParams,
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
          ...queryParams,
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
    return "Successfully updated data";
  } catch (err) {
    return new Error(err).message;
  }
};
