const sqlite3 = require("sqlite3").verbose();
const config = require("../config");
// open the database
let db = new sqlite3.Database(config.sqliteDB, sqlite3.OPEN_READWRITE, err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the Quest Sqlite database.");
});
//enabling foreign keys
db.get("PRAGMA foreign_keys = ON");

module.exports = db;
