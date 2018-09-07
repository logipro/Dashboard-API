const sqlite3 = require("sqlite3").verbose();

// open the database
let db = new sqlite3.Database(
  "./Database/QuestSqlite.db",
  sqlite3.OPEN_READWRITE,
  err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the Quest Sqlite database.");
  }
);

module.exports = db;
