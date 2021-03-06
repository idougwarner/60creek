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
    const { firstName, lastName, email, phone } = event.arguments.input;
    let rt;
    if (phone) {
      rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
        params: {
          service: "email",
          k2: datafinderKey.Parameter.Value,
          d_phone: phone,
          d_first: firstName ? firstName : null,
          d_last: lastName ? lastName : null,
        },
      });
      console.log(rt);
    } else if (email) {
      rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
        params: {
          service: "phone",
          k2: datafinderKey.Parameter.Value,
          d_email: email,
          d_first: firstName ? firstName : null,
          d_last: lastName ? lastName : null,
        },
      });
      console.log(rt);
    }
    let dt = null;
    if (rt && rt.data && rt.data.datafinder["num-results"] > 0) {
      const fetchedData = rt.data.datafinder.results[0];
      console.log(fetchedData);
      dt = {
        firstName:
          fetchedData.FirstName +
          (fetchedData.MiddleName ? " " + fetchedData.MiddleName : ""),
        lastName: fetchedData.LastName,
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
