exports.handler = (event, context, callback) => {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;  // this is NOT needed if e-mail is not in attributeList
  // event.response.autoVerifyPhone = true;  // this is NOT needed if phone # is not in attributeList
  context.done(null, event);
};