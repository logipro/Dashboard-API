var Dashboard = require("../models/Dashboard/DashboardModels");

exports.FigureCardData = function(req, res) {
  Dashboard.FigureCardData(req.params.queryparam).then(result => {
    res.json(result);
  });
};
exports.WidgetDate = function(req, res) {
  console.log(req.params);
  Dashboard.WidgetDate(req.params.queryparam)
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.json(err.message);
    });
};
