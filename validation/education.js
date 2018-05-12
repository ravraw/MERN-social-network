const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  const requiredFields = ["school", "degree", "fieldofstudy", "from"];

  // Converts required empty fields to "string"
  requiredFields.forEach(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : "";
    if (validator.isEmpty(data[field])) {
      errors[field] = `${field} field is required`;
    }
  });

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
