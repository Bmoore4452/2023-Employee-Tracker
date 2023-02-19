const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "jacket52",
    database: "tracker_db",
  },
  console.log("Connected to the tracker_db database")
);

db.query("SHOW TABLES", function (err, results) {
  console.log(results);
});


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
