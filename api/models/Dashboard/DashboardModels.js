var sql = require("mssql"),
  db = require("../../../Utils/sqliteDb");

exports.FigureCardData = async function(queryParam) {
  var query = `SELECT CAST(RANDOM()*100 as INT) as d`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.WidgetDate = async function(widgetID) {
  //each widget should have it's own data retrieve method (this is just a sample)
  var query = `SELECT 'T' as labels, RANDOM() as series
UNION SELECT 'W' as labels, RANDOM() as series
UNION SELECT 'T' as labels, RANDOM() as series
UNION SELECT 'F' as labels, RANDOM() as series`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
