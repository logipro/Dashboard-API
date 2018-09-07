var Security = require("../models/Security/SecurityModel"),
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  config = require("../../config");

exports.getGuestToken = function(req, res) {
  res.json({
    token: jwt.sign({ id: 0, username: "guest" }, config.jwt_secret)
  });
};

exports.login = function(req, res, next) {
  console.log("login request received");
  passport.authenticate("local", function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: "error", code: "unauthorized" });
    } else {
      return res.json({
        token: jwt.sign(
          { id: user.UserID, username: user.UserName },
          config.jwt_secret,
          { expiresIn: 600000 }
        )
      });
    }
  })(req, res, next);
};

exports.logout = function(req, res) {
  console.log(`${req.tokenPayload.username} is logging out.`);
  res.json();
};

// exports.listofAccessibleApps = function(req, res) {
//   console.log(req.tokenPayload.username);
//   Security.listOfAccessibleApps(req.tokenPayload.username).then(result => {
//     res.json(result);
//   });
// };

// exports.listOfWidgets = function(req, res) {
//   console.log(req.tokenPayload.username);
//   Security.listOfWidgets(req.tokenPayload.username).then(result => {
//     res.json(result);
//   });
// };

// exports.listOfUsers = function(req, res) {
//   Security.listOfUsers()
//     .then(result => {
//       res.json(result);
//     })
//     .catch(err => {
//       res.status(400);
//       res.json(err.message);
//     });
// };
