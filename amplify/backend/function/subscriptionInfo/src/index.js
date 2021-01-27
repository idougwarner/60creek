const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const stripeSecretKeyPromise = ssm
  .getParameter({
    Name: '/sixtycreek-dev/stripe-secret-key',
    WithDecryption: true
  })
  .promise();
const priceItemPromise = ssm
  .getParameter({
    Name: '/sixtycreek-dev/stripe-price-item',
    WithDecryption: true
  })
  .promise();
exports.handler = async (event) => {
  try {
    const stripeSecretKey = await stripeSecretKeyPromise;
    const priceItem = await priceItemPromise;
    const stripe = require("stripe")(stripeSecretKey.Parameter.Value);
    const price = await stripe.prices.retrieve(priceItem.Parameter.Value);
    return { data: price, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: { message: new Error(err).message } }
  }
};
