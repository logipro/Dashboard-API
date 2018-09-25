module.exports = function(app) {
  var securityController = require("../controllers/securityController");

  app.route("/guesttoken").get(securityController.getGuestToken);

  app.route("/login").post(securityController.login);

  app.route("/logout").post(securityController.logout);

  app.route("/accessibleapps").get(securityController.listofAccessibleApps);

  app.route("/security/users").get(securityController.listOfUsers);

  app.route("/security/users").put(securityController.updateUser);

  app.route("/security/users").post(securityController.insertUser);

  app.route("/security/userpassword").put(securityController.changePassword);

  app.route("/security/roles/:userID").get(securityController.listOfRoles);

  app
    .route("/security/modifyUserRoles")
    .post(securityController.modifyUserRoles);

  app.route("/security/roles").post(securityController.insertRole);

  app.route("/security/roles").delete(securityController.deleteRole);

  // app.route("/dashboard/widgets").get(securityController.listOfWidgets);
};
