module.exports = function(app) {
  var securityController = require("../controllers/securityController");

  app.route("/guesttoken").get(securityController.getGuestToken);

  app.route("/login").post(securityController.login);

  app.route("/logout").post(securityController.logout);

  app.route("/validateToken").post(securityController.validateToken);

  app.route("/accessibleapps").get(securityController.listofAccessibleApps);

  app
    .route("/dashboard/widgets")
    .get(securityController.listofAccessibleWidgets);

  app
    .route("/security/users")
    .get(securityController.listOfUsers)
    .put(securityController.updateUser)
    .post(securityController.insertUser);

  app.route("/security/userpassword").put(securityController.changePassword);

  app.route("/security/roles/:userID").get(securityController.listOfRoles);

  app
    .route("/security/modifyUserRoles")
    .post(securityController.modifyUserRoles);

  app
    .route("/security/roles")
    .post(securityController.insertRole)
    .delete(securityController.deleteRole);

  app
    .route("/security/rolesApps/:roleID")
    .get(securityController.listOfRolesApps);

  app.route("/security/modifyRoleApps").post(securityController.modifyRoleApps);

  app
    .route("/security/rolesWidgets/:roleID")
    .get(securityController.listOfRolesWidgets);

  app
    .route("/security/modifyRoleWidgets")
    .post(securityController.modifyRoleWidgets);

  app
    .route("/modifyUserWidgetLayout")
    .post(securityController.modifyUserWidgetLayout);

  app
    .route("/security/apps")
    .get(securityController.listOfApps)
    .post(securityController.insertApp)
    .delete(securityController.deleteApp)
    .put(securityController.updateApp);

  app
    .route("/security/widgets")
    .get(securityController.listOfWidgets)
    .post(securityController.insertWidget)
    .delete(securityController.deleteWidget)
    .put(securityController.updateWidget);
};
