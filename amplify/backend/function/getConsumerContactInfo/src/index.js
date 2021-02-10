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
    const { email } = event.arguments.input;
    let rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
      params: {
        service: "phone",
        k2: datafinderKey.Parameter.Value,
        d_email: email,
      },
    });
    console.log(rt);
    let dt = null;
    if (rt.data && rt.data.datafinder["num-results"] > 0) {
      dt = {
        firstName: rt.data.datafinder.results[0].FirstName,
        lastName: rt.data.datafinder.results[0].LastName,
        address: rt.data.datafinder.results[0].Address,
        city: rt.data.datafinder.results[0].City,
        state: rt.data.datafinder.results[0].State,
        zip: rt.data.datafinder.results[0].Zip,
        phone: rt.data.datafinder.results[0].Phone,
        email: rt.data.datafinder.results[0].Email,
      };
    }

    return { data: dt, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: { message: new Error(err).message } };
  }
};
