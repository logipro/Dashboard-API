var sql = require("mssql"),
  db = require("../../../db");

exports.FigureCardData = async function (queryParam) {
  return await new sql.Request(await db.getDBInstance("shopfloor"))
    .query("SELECT CAST(RAND()*100 as INT) as d")
    .then(result => {
      return result.recordset;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
};

exports.WidgetDate = async function (widgetID) {
  return await new sql.Request(await db.getDBInstance("shopfloor"))
    .input("widgetID", sql.Int, widgetID)
    .execute("spDshGetWidgetData")
    .then(result => {
      return result.recordset;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
};
