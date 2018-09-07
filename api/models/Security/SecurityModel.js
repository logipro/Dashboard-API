var sql = require("mssql");
//db = require("../../../db");

// exports.listOfAccessibleApps = async function(username) {
//   return await new sql.Request(await db.getDBInstance("shopfloor"))
//     .input("username", sql.VarChar, username)
//     .execute("spSecGetAccessibleApps")
//     .then(result => {
//       return result.recordset;
//     })
//     .catch(err => {
//       console.error(err);
//       return err;
//     });
// };

// exports.listOfWidgets = async function(username) {
//   return await new sql.Request(await db.getDBInstance("shopfloor"))
//     .input("username", sql.VarChar, username)
//     .execute("spSecGetWidgets")
//     .then(result => {
//       return result.recordset;
//     })
//     .catch(err => {
//       console.error(err);
//       return err;
//     });
// };

// exports.listOfUsers = async function() {
//   return await new sql.Request(await db.getDBInstance("megatron"))
//     .query("SELECT * FROM tbSecUser")
//     .then(result => {
//       return result.recordset;
//     })
//     .catch(err => {
//       console.error(err);
//       throw err;
//     });
// };
