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
    query = `SELECT DISTINCT
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

exports.listOfAccessibleWidgets = function(userID) {
  console.log(userID);
  let query = "";
  if (userID < 0) {
    query = `SELECT *,1 AS IsVisible, W.WidgetID as WidgetOrder
    FROM tbDshWidget W
    WHERE IsPublic > 0 `;
  } else {
    query = `SELECT Distinct W.*, IFNULL(L.IsVisible,1) AS IsVisible, IFNULL(L.WidgetOrder, W.WidgetID) AS WidgetOrder
    FROM tbDshWidget W
    JOIN tbDshWidgetRole WR ON W.WidgetID = WR.WidgetID
    JOIN tbSecUserRole UR ON UR.RoleID = WR.RoleID AND UR.UserID = ${userID}
    LEFT JOIN tbDshUserLayout L on W.WidgetID = L.WidgetID AND L.UserID = ${userID}
    UNION 
    SELECT W.*, IFNULL(L.IsVisible,1) AS IsVisible, IFNULL(L.WidgetOrder, W.WidgetID) AS WidgetOrder
    FROM tbDshWidget W
    LEFT JOIN tbDshUserLayout L on W.WidgetID = L.WidgetID AND L.UserID = ${userID}
    WHERE IsPublic > 0 `;
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
  var query = `DELETE FROM tbSecRole WHERE RoleID = ` + RoleID;
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      //console.log(`Row(s) updated: ${this.changes}`);
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(`Row deleted: ${this.changes}`);
      }
    });
  });
};

exports.listOfRolesApps = async function(RoleID) {
  var query = `SELECT
  SA.ApplicationID
  ,SA.Application
  ,SA.ParentID
  ,SA.ShowInNavigationTree
  ,IFNULL(SA.AppOrder,1000 + SA.ApplicationID) as AppOrder
,ISPublic
,SA.Icon
,SAR.ApplicationRoleID
  FROM tbSecApplication SA
  LEFT JOIN tbSecApplicationRole SAR ON SA.ApplicationID = SAR.ApplicationID
 AND (ISPublic = 1 OR SAR.RoleID = ${RoleID})
  ORDER BY IFNULL(SA.AppOrder,1000 + SA.ApplicationID)`;
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

exports.modifyRoleApps = async function(
  RoleID,
  ApplicationID,
  ApplicationRoleID
) {
  var query = "";
  if (ApplicationRoleID === null) {
    query = `INSERT INTO tbSecApplicationRole (ApplicationID, RoleID)
    SELECT ${ApplicationID}, ${RoleID}`;
  } else {
    query = `DELETE FROM tbSecApplicationRole WHERE ApplicationRoleID = ${ApplicationRoleID}`;
  }
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      if (err) {
        reject(err);
      } else {
        resolve(`Row modified: ${this.changes}`);
      }
    });
  });
};

exports.listOfRolesWidgets = async function(RoleID) {
  var query = `SELECT DW.* ,WR.WidgetRoleID
  FROM tbDshWidget DW
    LEFT JOIN tbDshWidgetRole WR ON DW.WidgetID = WR.WidgetID
   AND (ISPublic = 1 OR WR.RoleID = ${RoleID})`;
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

exports.modifyRoleWidgets = async function(RoleID, WidgetID, WidgetRoleID) {
  var query = "";
  if (WidgetRoleID === null) {
    query = `INSERT INTO tbDshWidgetRole (WidgetID, RoleID)
    SELECT ${WidgetID}, ${RoleID}`;
  } else {
    query = `DELETE FROM tbDshWidgetRole WHERE WidgetRoleID = ${WidgetRoleID}`;
  }
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      if (err) {
        reject(err);
      } else {
        resolve(`Row modified: ${this.changes}`);
      }
    });
  });
};

exports.modifyUserWidgetLayout = async function(userID, widgets) {
  //first delete user's current layout
  var query = `DELETE FROM tbDshUserLayout 
  WHERE UserID = ${userID}`;

  //add the new layout statement
  var insertStatement =
    "INSERT INTO tbDshUserLayout (UserID, WidgetID, WidgetOrder, IsVisible)";
  widgets.forEach(w => {
    console.log(w);
    insertStatement += ` SELECT  ${userID}, ${w.WidgetID}, ${w.widgetOrder}, ${
      w.isVisible
    } UNION `;
  });
  //--remove the last UNION
  insertStatement = insertStatement.substring(0, insertStatement.length - 6);
  console.log(insertStatement);
  //---
  return new Promise((resolve, reject) => {
    db.run(query, [], function(err, runset) {
      if (err) {
        console.log("first step : " + err);
        reject(err);
      } else {
        db.run(insertStatement, [], function(err, runset) {
          if (err) {
            console.log(insertStatement);
            console.log("second step : " + err);
            reject(err);
          } else {
            resolve("saved");
          }
        });
      }
    });
  });
};
