var Dashboard = require("../models/Dashboard/DashboardModels");

exports.FigureCardData = function(req, res) {
  Dashboard.FigureCardData(req.params.queryparam).then(result => {
    res.json(result);
  });
};
exports.WidgetDate = function(req, res) {
  Dashboard.WidgetDate(req.params.queryparam).then(result => {
    res.json(result);
  });
};
