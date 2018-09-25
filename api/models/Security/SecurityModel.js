var db = require("../../../Utils/sqliteDb"),
  crypto = require("../../../helpers/crypto");

exports.listOfAccessibleApps = function(username) {
  let query = "";
  if (username === "guest") {
    query = `SELECT SA.ApplicationID
            ,SA.Application
            ,SA.RouteName as [Path]
            ,SA.Icon as Icon
            ,SA.Component as Component
            ,SA.Params as params
            ,SA.ParentID
            ,SA.ShowInNavigationTree
            ,IFNULL(SA.AppOrder,1000 + SA.ApplicationID) as AppOrder
             FROM tbSecApplication SA WHERE IsPublic = 1
             ORDER BY IFNULL(SA.AppOrder,1000 + SA.ApplicationID) `;
  } else {
    query = `SELECT
        SA.ApplicationID
        ,SA.Application
        ,SA.RouteName as [Path]
        ,SA.Icon as Icon
        ,SA.Component as Component
        ,SA.Params as params
        ,SA.ParentID
        ,SA.ShowInNavigationTree
        ,IFNULL(SA.AppOrder,1000 + SA.ApplicationID) as AppOrder
        FROM tbSecApplication SA
        LEFT JOIN tbSecApplicationRole SAR ON SA.ApplicationID = SAR.ApplicationID
        LEFT JOIN tbSecUserRole UR ON UR.RoleID = SAR.RoleID
        LEFT JOIN tbSecUser U ON U.UserID = UR.UserID AND U.UserName LIKE '${username}'
        WHERE (ISPublic = 1 OR U.UserID IS NOT NULL)
        ORDER BY IFNULL(SA.AppOrder,1000 + SA.ApplicationID) `;
  }
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

exports.listOfUsers = async function() {
  var query = "SELECT * FROM tbSecUser";
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log(rows);
        resolve(rows);
      }
    });
  });
};

exports.updateUser = async function(request) {
  var query =
    "UPDATE tbSecUser SET " +
    request.Update +
    " WHERE USERID = " +
    request.UserID;
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      //console.log(`Row(s) updated: ${this.changes}`);
      if (err) {
        reject(err);
      } else {
        resolve(`Row(s) updated: ${this.changes}`);
      }
    });
  });
};

exports.insertUser = async function(request) {
  var query = "INSERT INTO tbSecUser " + request.Insert;
  console.log(query);
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      //console.log(`Row(s) updated: ${this.changes}`);
      if (err) {
        reject(err);
      } else {
        resolve(`Row inserted: ${this.changes}`);
      }
    });
  });
};

exports.changePassword = async function(request) {
  var cryptoResult = crypto.saltHashPassword(request.password);
  var query = `INSERT OR Replace INTO tbSecUserPassword  
  (UserPasswordID, UserID, PasswordHash, PasswordSalt, Expired, CreatedAt) 
   Values ( 
  (SELECT UserPasswordID FROM tbSecUserPassword WHERE UserID = ${
    request.UserID
  })
  ,${request.UserID}
  ,"${cryptoResult.hashedPassword}"
  ,"${cryptoResult.salt}"
  ,0
  ,(SELECT strftime("%Y-%m-%d %H:%M:%S", datetime("now")))
  )`;
  //console.log(query);
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      //console.log(`Row(s) updated: ${this.changes}`);
      if (err) {
        reject(err);
      } else {
        resolve(`Row inserted: ${this.changes}`);
      }
    });
  });
};

exports.listOfRoles = async function(userID) {
  var query = "SELECT *, false as IsUsersRole FROM tbSecRole";
  if (userID && userID >= 0) {
    query = `SELECT R.*, 
    CASE WHEN UR.UserID IS NOT NULL THEN true ELSE false END as IsUsersRole
    FROM tbSecRole R 
    LEFT JOIN tbSecUserRole UR
    ON R.RoleID = UR.RoleID
    AND UR.UserID = ${userID}`;
  }
  console.log(query);
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.modifyUserRoles = async function(userID, roleID, isAdd) {
  var query = "";
  if (isAdd == "true") {
    query = `INSERT INTO tbSecUserRole (UserID, RoleID)
    SELECT ${userID}, ${roleID}`;
  } else {
    query = `DELETE FROM tbSecUserRole WHERE UserID = ${userID} AND RoleID = ${roleID}`;
  }
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      if (err) {
        reject(err);
      } else {
        resolve(`Row inserted: ${this.changes}`);
      }
    });
  });
};

exports.insertRole = async function(request) {
  var query = "INSERT INTO tbSecRole " + request.Insert;
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      //console.log(`Row(s) updated: ${this.changes}`);
      if (err) {
        reject(err);
      } else {
        resolve(`Row inserted: ${this.changes}`);
      }
    });
  });
};

exports.deleteRole = async function(RoleID) {
  var query = "DELETE FROM tbSecRole WHERE RoleID = " + RoleID;
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      //console.log(`Row(s) updated: ${this.changes}`);
      if (err) {
        reject(err);
      } else {
        resolve(`Row deleted: ${this.changes}`);
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
