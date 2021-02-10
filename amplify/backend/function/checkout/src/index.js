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
    const { email, amount, token } = event.arguments.input;
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "usd",
      source: token,
      receipt_email: email,
      description: "Data Enhancement is payment.",
    });
    return {
      data: {
        id: charge.id,
        amount: charge.amount / 100,
        amountCaptured: charge.amount_captured / 100,
        amountRefunded: charge.amount_refunded / 100,
        description: charge.description,
        paid: charge.paid,
        receiptEmail: charge.receipt_email,
        receiptNumber: charge.receipt_number,
        receiptUrl: charge.receipt_url,
        source: charge.source,
        status: charge.status,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
