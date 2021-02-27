const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const stripeSecretKeyPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/stripe-secret-key`,
    WithDecryption: true
  })
  .promise();
exports.handler = async (event) => {
  try {
    const stripeSecretKey = await stripeSecretKeyPromise;
    const stripe = require("stripe")(stripeSecretKey.Parameter.Value);
    const { coupon } = event.arguments.input;
    const couponInfo = await stripe.promotionCodes.list({
      code: coupon
    });
    if (couponInfo.data && couponInfo.data.length > 0) {
      return { data: couponInfo.data[0].coupon, error: null };
    } else {
      return { data: null, error: { message: `Promotion code not found: '${coupon}'` } };
    }
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } }
  }
};