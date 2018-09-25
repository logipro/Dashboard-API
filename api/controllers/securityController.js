var Security = require("../models/Security/SecurityModel"),
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  config = require("../../config");

exports.getGuestToken = function(req, res) {
  res.json({
    token: jwt.sign({ id: 0, username: "guest" }, config.jwt_secret),
    userID: -1
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
        ),
        userID: user.UserID
      });
    }
  })(req, res, next);
};

exports.logout = function(req, res) {
  console.log(`${req.tokenPayload.username} is logging out.`);
  //return a guest token
  res.json({
    token: jwt.sign({ id: 0, username: "guest" }, config.jwt_secret)
  });
};

exports.listofAccessibleApps = function(req, res) {
  console.log(req.tokenPayload.username);
  Security.listOfAccessibleApps(req.tokenPayload.username)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.listOfUsers = function(req, res) {
  Security.listOfUsers()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.updateUser = function(req, res) {
  Security.updateUser(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.insertUser = function(req, res) {
  Security.insertUser(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.changePassword = function(req, res) {
  Security.changePassword(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.listOfRoles = function(req, res) {
  //console.log(req);
  console.log(req.params);
  Security.listOfRoles(req.params.userID)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.modifyUserRoles = function(req, res) {
  Security.modifyUserRoles(req.body.userID, req.body.roleID, req.body.isAdd)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.insertRole = function(req, res) {
  Security.insertRole(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

// exports.listOfWidgets = function(req, res) {
//   console.log(req.tokenPayload.username);
//   Security.listOfWidgets(req.tokenPayload.username).then(result => {
//     res.json(result);
//   });
// };
