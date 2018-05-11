const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  const errors = {};

  // let errors = {};
  siteUrls = [
    "website",
    "youtube",
    "twitter",
    "facebook",
    "linkedin",
    "instagram"
  ];
  dataFields = ["handle", "status", "skills"];
  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.email = "Handle must be between 2 and 40 characters";
  }
  dataFields.forEach(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : "";
    if (validator.isEmpty(data[field])) {
      errors[field] = `${field} is required`;
    }
  });
  if (validator.isEmpty(data.handle)) {
    errors.handle = "";
    errors.email = "E-mail is required";
  }
  siteUrls.forEach(url => {
    if (!isEmpty(data[url])) {
      if (!validator.isURL(data[url])) {
        errors[url] = "Badly formatted URL for ${url}";
      }
    }
  });

  //   // conevrts an empyty input to string

  //   data.handle = !isEmpty(data.handle) ? data.handle : "";
  //   data.status = !isEmpty(data.status) ? data.status : "";
  //   data.skills = !isEmpty(data.skills) ? data.skills : "";

  //   // validate handle field
  //   if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
  //     errors.handle = "Handle needs to be beteween 2 and 40 characters";
  //   }
  //   if (validator.isEmpty(data.handle)) {
  //     errors.handle = "Profile handle is required";
  //   }

  //   // validate status field
  //   if (validator.isEmpty(data.status)) {
  //     errors.status = "Status field  is required";
  //   }

  //   // validate field skills
  //   if (validator.isEmpty(data.skills)) {
  //     errors.skills = "Skills field is required";
  //   }

  //   // avalidation website field
  //   if (!isEmpty(data.website)) {
  //     if (!validator.isURL(data.website)) {
  //       errors.website = "Not a valid URL";
  //     }
  //   }

  //   // social media fiels validation
  //   if (!isEmpty(data.youtube)) {
  //     if (!validator.isURL(data.youtube)) {
  //       errors.youtube = "Not a valid URL";
  //     }
  //   }
  //   if (!isEmpty(data.twitter)) {
  //     if (!validator.isURL(data.twitter)) {
  //       errors.twitter = "Not a valid URL";
  //     }
  //   }
  //   if (!isEmpty(data.facebook)) {
  //     if (!validator.isURL(data.facebook)) {
  //       errors.facebook = "Not a valid URL";
  //     }
  //   }
  //   if (!isEmpty(data.instagram)) {
  //     if (!validator.isURL(data.instagram)) {
  //       errors.instagram = "Not a valid URL";
  //     }
  //   }
  //   if (!isEmpty(data.linkedin)) {
  //     if (!validator.isURL(data.linkedin)) {
  //       errors.linkedin = "Not a valid URL";
  //     }
  //   }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
