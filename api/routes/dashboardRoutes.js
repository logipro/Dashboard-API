module.exports = function(app) {
  var dashboardController = require("../controllers/dashboardController");

  app
    .route("/dashboard/figurecard/:queryparam")
    .get(dashboardController.FigureCardData);

  app
    .route("/dashboard/widgetdata/:queryparam")
    .get(dashboardController.WidgetDate);
};
