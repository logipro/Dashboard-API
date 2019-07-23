var Security = require("../models/Security/SecurityModel"),
  passport = require("passport"),
  jwt = require("jsonwebtoken"),
  config = require("../../config");

exports.getGuestToken = function(req, res) {
  res.json({
    token: jwt.sign({ id: -1, username: "guest" }, config.jwt_secret),
    userID: -1
  });
};

exports.login = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: "error", code: "unauthorized" });
    } else {
      return res.json({
        token: jwt.sign(
          { id: user.UserID, username: user.UserName },
          config.jwt_secret,
          { expiresIn: config.tokenExpiry }
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
    token: jwt.sign({ id: -1, username: "guest" }, config.jwt_secret)
  });
};

exports.validateToken = function(req, res) {
  console.log(req.tokenPayload.id);
  console.log(req.tokenPayload.username);
  console.log(req.body.userID);
  console.log(req.body.username);
  if (
    req.tokenPayload.id === req.body.userID &&
    req.tokenPayload.username === req.body.username
  ) {
    res.json(true);
  } else {
    res.status(401);
    res.json(false);
  }
};

exports.listofAccessibleApps = function(req, res) {
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

exports.listofAccessibleWidgets = function(req, res) {
  Security.listOfAccessibleWidgets(req.tokenPayload.id)
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
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.deleteRole = function(req, res) {
  Security.deleteRole(req.body.RoleID)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.listOfRolesApps = function(req, res) {
  //console.log(req);
  console.log(req.params);
  Security.listOfRolesApps(req.params.roleID)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.modifyRoleApps = function(req, res) {
  console.log(req.body);
  Security.modifyRoleApps(
    req.body.RoleID,
    req.body.ApplicationID,
    req.body.ApplicationRoleID
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.listOfRolesWidgets = function(req, res) {
  Security.listOfRolesWidgets(req.params.roleID)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.modifyRoleWidgets = function(req, res) {
  console.log(req.body);
  Security.modifyRoleWidgets(
    req.body.RoleID,
    req.body.WidgetID,
    req.body.WidgetRoleID
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.modifyUserWidgetLayout = function(req, res) {
  Security.modifyUserWidgetLayout(req.tokenPayload.id, req.body.Widgets)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.listOfApps = function(req, res) {
  Security.listOfApps()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};
exports.insertApp = function(req, res) {
  Security.insertApp(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.deleteApp = function(req, res) {
  Security.deleteApp(req.body.ApplicationID)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.updateApp = function(req, res) {
  Security.updateApp(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};

exports.listOfWidgets = function(req, res) {
  Security.listOfWidgets()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};
exports.insertWidget = function(req, res) {
  Security.insertWidget(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.deleteWidget = function(req, res) {
  Security.deleteWidget(req.body.WidgetID)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};

exports.updateWidget = function(req, res) {
  Security.updateWidget(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400);
      res.json(err.message);
    });
};
