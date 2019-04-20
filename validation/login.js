const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validationLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!validator.isLength(data.password, { min: 6, max: 32 })) {
    errors.password = "Password length should be between 6 and 32";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return { errors, isValid: isEmpty(errors) };
};
