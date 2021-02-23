const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const stripeSecretKeyPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/stripe-secret-key`,
    WithDecryption: true
  })
  .promise();
const priceItemPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/stripe-price-item`,
    WithDecryption: true
  })
  .promise();
exports.handler = async (event) => {
  try {
    const stripeSecretKey = await stripeSecretKeyPromise;
    const priceItem = await priceItemPromise;
    const stripe = require("stripe")(stripeSecretKey.Parameter.Value);
    const { email, paymentMethodId, coupon } = event.arguments.input;
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: email,
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceItem.Parameter.Value }],
      coupon: coupon ? coupon : null,
      expand: ['latest_invoice.payment_intent']
    });
    const data = {
      address: customer.address,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,

      paymentMethodId: paymentMethodId,
      subscriptionId: subscription.id,
      customerId: customer.id,
      subscriptionType: subscription.plan.interval,
      unitAmount: (subscription.latest_invoice.subtotal) / 100,
      discount: (subscription.latest_invoice.subtotal - subscription.latest_invoice.total) / 100
    }
    return { data: data, error: null };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } }
  }
};
