export const STRENGTH_0 = "strength";
export const STRENGTH_1 = "weak";
export const STRENGTH_2 = "good";
export const STRENGTH_3 = "strong";
export const STRENGTH_4 = "perfect";

export const _PasswordStrengths = [
  { legend: STRENGTH_0, regEx: "" },
  { legend: STRENGTH_1, regEx: "" },
  {
    legend: STRENGTH_2,
    regEx: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
  },
  {
    legend: STRENGTH_3,
    regEx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
  },
  {
    legend: STRENGTH_4,
    regEx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[+-_()])(?=.{8,})/,
  },
];

export const validateEmail = (email) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return true;
  }
  return false;
};

export const validateZip = (zip) => {
  if (/^[0-9]{5}(?:-[0-9]{4})?$/.test(zip)) {
    return true;
  }
  return false;
};

export const validatePhone = (phone) => {
  if (/\(([0-9]{3})\) ([0-9]{3}) - ([0-9]{4})/.test(phone)) {
    return true;
  }
  return false;
};

export const validateField = (fieldType, value) => {
  if (fieldType === "email") {
    return validateEmail(value);
  } else if (fieldType === "phone") {
    return validatePhone(value);
  } else if (fieldType === "zip") {
    return validateZip(value);
  }
  return true;
};
