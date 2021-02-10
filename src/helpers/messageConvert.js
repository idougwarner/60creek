export const messageConvert = (message) => {
  if (message === "Error: An error occurred with our connection to Stripe.") {
    return "Failed your request. Please try again.";
  } else if (message.indexOf("Coupon expired") >= 0) {
    return "Your Coupon code has been expired.";
  }
  return message;
};
