const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const stripeSecretKeyPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/stripe-secret-key`,
    WithDecryption: true,
  })
  .promise();

exports.handler = async (event) => {
  try {
    const stripeSecretKey = await stripeSecretKeyPromise;
    const stripe = require("stripe")(stripeSecretKey.Parameter.Value);
    const { email, paymentMethodId } = event.arguments.input;
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    const data = {
      paymentMethodId: paymentMethodId,
      customerId: customer.id,
    };
    return { data: data, error: null };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
