export const messageConvert = (message) => {
  if (message === "Error: An error occurred with our connection to Stripe.") {
    return "Failed your request. Please try again.";
  } else if (message.indexOf("Coupon expired") >= 0) {
    return "Your Coupon code has been expired.";
  } else if (message.indexOf("No such promotion code") >= 0) {
    return "Invalid discount code";
  }
  return message;
};
