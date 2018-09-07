var LocalStrategy = require("passport-local").Strategy,
  db = require("../Utils/sqliteDb"),
  crypto = require("../helpers/crypto");

// expose this function to our app using module.exports
module.exports = function(app, passport) {
  passport.use(
    "local",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        console.log(username);
        // callback with email and password from our form
        return db.all(
          `SELECT u.UserID, u.UserName, up.PasswordHash, up.PasswordSalt \
        FROM tbSecUserPassword AS up JOIN tbSecUser AS u ON up.UserID=u.UserID \
        WHERE u.UserName = ?`,
          [username],

          (err, rows) => {
            if (!rows.length) {
              return done(null, false, {
                message: "Incorrect username and password."
              });
            } else if (
              crypto.saltHashPasswordValidation(
                password,
                rows[0].PasswordHash,
                rows[0].PasswordSalt
              )
            ) {
              return done(null, rows[0]);
            } else {
              return done(null, false, {
                message: "Incorrect username and password."
              });
            }
          }
        );
      }
    )
  );
};
