var db = require("../../../Utils/sqliteDb");

exports.listOfAccessibleApps = function(username) {
  let query = "";
  if (username === "guest") {
    query = `SELECT SA.Application as RtName
            ,SA.RouteName as [Path]
            ,SA.Icon as Icon
            ,SA.Component as Component
            ,SA.Params as params
             FROM tbSecApplication SA WHERE IsPublic = 1`;
  } else {
    query = `SELECT
        SA.Application as RtName
        ,SA.RouteName as [Path]
        ,SA.Icon as Icon
        ,SA.Component as Component
        ,SA.Params as params
        FROM tbSecApplication SA
        LEFT JOIN tbSecApplicationRole SAR ON SA.ApplicationID = SAR.ApplicationID
        LEFT JOIN tbSecUserRole UR ON UR.RoleID = SAR.RoleID
        LEFT JOIN tbSecUser U ON U.UserID = UR.UserID AND U.UserName LIKE '${username}'
        WHERE (ISPublic = 1 OR U.UserID IS NOT NULL)`;
  }
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(rows);
        resolve(rows);
      }
    });
  });
};

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
