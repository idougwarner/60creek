const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;
const axios = require('axios');

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
        userId
        prospectListId
        status
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zip
        phone
        email
        facebook
        notes
        interested
        enhance
        enhanced
        fetched
      }
      nextToken
      scannedCount
      count
    }
  }
`;

const enhanceData = async (prospectListId) => {
  try {
    const graphqlEndpoint =
      'https://huu3urupanctzci4aabme6alu4.appsync-api.us-west-2.amazonaws.com/graphql';
    const appsyncApiKey = 'da2-ggzuh5rqorgkdbzjt5qlstuz3y';

    // set the datafinder api key to this variable.
    const datafinderKey = '';

    const p = await axios({
      url: graphqlEndpoint,
      method: 'post',
      headers: {
        'x-api-key': appsyncApiKey,
      },
      data: {
        query: print(prospectsByProspectListId),
        variables: {
          prospectListId: prospectListId,
          limit: 2000,
        },
      },
    });

    const prospects = p.data.data.prospectsByProspectListId.items;
    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];
      if (prospect.enhance === true) {
        console.log(prospect);
        const id = prospect.id;
        const firstName = prospect.firstName;
        const lastName = prospect.lastName;
        const email = prospect.email;
        const phone = prospect.phone;
        const city = prospect.city;
        const state = prospect.state;
        const zip = prospect.zip;
        const address1 = prospect.address1;

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
            rt = await axios.get('https://api.datafinder.com/v2/qdf.php', {
              params: {
                service: 'phone',
                k2: datafinderKey,
                ...queryParams,
              },
            });
          } else if (email || phone) {
            rt = await axios.get('https://api.datafinder.com/v2/qdf.php', {
              params: {
                service: 'email',
                k2: datafinderKey,
                ...queryParams,
              },
            });
          }

          if (rt && rt.data && rt.data.datafinder['num-results'] > 0) {
            const fetchedData = rt.data.datafinder.results[0];
            dt = {
              firstName:
                fetchedData.FirstName +
                  (fetchedData.MiddleName
                    ? ' ' + fetchedData.MiddleName
                    : '') || firstName,
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
            'https://api.datafinder.com/v2/qdf.php',
            {
              params: {
                service: 'social',
                k2: datafinderKey,
                ...queryParams,
              },
            }
          );
          if (rtSocial.data && rtSocial.data.datafinder['num-results'] > 0) {
            const fetchedData = rtSocial.data.datafinder.results[0];
            dt.facebook = fetchedData.FBURL;
          }
        }
        {
          let rt = await axios.get('https://api.datafinder.com/v2/qdf.php', {
            params: {
              service: 'demograph',
              k2: datafinderKey,
              ...queryParams,
            },
          });
          if (rt.data && rt.data.datafinder['num-results'] > 0) {
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
          let rt = await axios.get('https://api.datafinder.com/v2/qdf.php', {
            params: {
              service: 'lifeint',
              k2: datafinderKey,
              ...queryParams,
            },
          });
          if (rt.data && rt.data.datafinder['num-results'] > 0) {
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

        const updatedInfo = await axios({
          url: graphqlEndpoint,
          method: 'post',
          headers: {
            'x-api-key': appsyncApiKey,
          },
          data: {
            query: print(updateProspect),
            variables: {
              input: {
                id: id,
                fetched: true,
                enhanced: Object.keys(dt).length > 0 ? true : false,
                ...dt,
              },
            },
          },
        });
        console.log(updatedInfo.data.data.updateProspect);
      }
    }
    return 'Successfully processed DynamoDB record';
  } catch (err) {
    console.log('errors =============');
    console.log(err);
    return new Error(err).message;
  }
};

// set id of the prospect list that needs to enhance manually to this variable.
const prospectListId = '';

enhanceData(prospectListId);
