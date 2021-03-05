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
        service: email ? "phone" : phone ? "email" : "phone",
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
        firstName:
          fetchedData.FirstName +
          (fetchedData.MiddleName ? " " + fetchedData.MiddleName : ""),
        lastName: fetchedData.LastName,
        address1: fetchedData.Address,
        city: fetchedData.City,
        state: fetchedData.State,
        zip: fetchedData.Zip,
        phone: fetchedData.Phone,
        email: fetchedData.Email,
      };
    }
    let rtSocial = await axios.get("https://api.datafinder.com/v2/qdf.php", {
      params: {
        service: "social",
        k2: datafinderKey.Parameter.Value,
        d_email: email ? email : null,
        d_first: firstName ? firstName : null,
        d_last: lastName ? lastName : null,
      },
    });
    if (rtSocial.data && rtSocial.data.datafinder["num-results"] > 0) {
      const fetchedData = rtSocial.data.datafinder.results[0];
      dt = {
        ...dt,
        facebook: fetchedData.FBURL,
      };
    }
    return { data: dt, error: null };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
