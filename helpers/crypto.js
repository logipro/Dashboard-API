"use strict";
var crypto = require("crypto");

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length) {
  console.log("ads");
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("base64") /** convert to base64 format */
    .slice(0, length); /** return required number of characters */
};

exports.saltHashPasswordValidation = function(
  plainPassword,
  originHashedPassword,
  salt
) {
  crypto.DEFAULT_ENCODING = "base64";
  var hashedPassword = crypto.pbkdf2Sync(
    plainPassword,
    salt,
    1000,
    24,
    "SHA512"
  );

  return hashedPassword === originHashedPassword;
};

exports.saltHashPassword = function(password) {
  var salt = genRandomString(24);

  crypto.DEFAULT_ENCODING = "base64";
  var hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 24, "SHA512");

  return {
    hashedPassword: hashedPassword,
    salt: salt,
    iteration: 1000
  };
};
