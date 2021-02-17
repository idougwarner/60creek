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
    let dt = null;
    if (rt.data && rt.data.datafinder["num-results"] > 0) {
      const fetchedData = rt.data.datafinder.results[0];
      dt = {
        firstName: fetchedData.FirstName + " " + fetchedData.MiddleName,
        lastName: fetchedData.LastName,
        address1: fetchedData.Address,
        city: fetchedData.City,
        state: fetchedData.State,
        zip: fetchedData.Zip,
        phone: fetchedData.Phone,
        email: fetchedData.Email,
      };
    }

    return { data: dt, error: null };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
