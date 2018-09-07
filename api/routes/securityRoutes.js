module.exports = function(app) {
  var securityController = require("../controllers/securityController");

  app.route("/guesttoken").get(securityController.getGuestToken);

  app.route("/login").post(securityController.login);

  app.route("/logout").post(securityController.logout);

  app.route("/accessibleapps").get(securityController.listofAccessibleApps);

  // app.route("/accessibleapps").get(securityController.listofAccessibleApps);

  // app.route("/dashboard/widgets").get(securityController.listOfWidgets);

  // app.route("/security/users").get(securityController.listOfWidgets);
};
