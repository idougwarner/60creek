const axios = require("axios");
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const datafinderKeyPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/datafinder-key`,
    WithDecryption: true,
  })
  .promise();

exports.handler = async (event) => {
  try {
    const datafinderKey = await datafinderKeyPromise;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
    } = event.arguments.input;
    let rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
      params: {
        service: "demograph",
        k2: datafinderKey.Parameter.Value,
        d_email: email ? email : null,
        d_phone: phone ? phone : null,
        d_fulladdr: address ? address : null,
        d_first: firstName ? firstName : null,
        d_last: lastName ? lastName : null,
      },
    });
    let dt = null;
    if (rt.data && rt.data.datafinder["num-results"] > 0) {
      const fetchedData = rt.data.datafinder.results[0];
      dt = {
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

    return { data: dt, error: null };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
