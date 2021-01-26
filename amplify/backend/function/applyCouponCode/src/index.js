const stripe = require("stripe")("sk_test_zaPow1GtgCNMGuAGU43Gimp600E83MWUnH");

exports.handler = async (event) => {
  try {
    console.log(event.arguments.input);
    const { email, paymentMethodId, coupon } = event.arguments.input;
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: email,
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    console.log(customer);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: "price_1IDNKJA0FUwd39i1MUAeBYNu" }],
      coupon: coupon,
      expand: ['latest_invoice.payment_intent']
    });
    console.log(subscription);
    const data = {
      address: customer.address,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,

      paymentMethodId: paymentMethodId,
      subscriptionId: subscription.id,
      customerId: customer.id,
      subscriptionType: 'monthly',
      unitAmount: (subscription.latest_invoice.amount_due + subscription.discount.coupon.amount_off) / 100, // 50$ 5000 cents
      discount: subscription.discount.coupon.amount_off / 100,
    }
    return { data: data, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: { message: new Error(err).message } }
  }
};
