const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};
  const requiredFields = ["title", "company", "from"];

  // Converts required empty fields to "string"
  requiredFields.forEach(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : "";
    if (validator.isEmpty(data[field])) {
      errors[field] = `${field} is required`;
    }
  });

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
