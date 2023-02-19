const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "jacket52",
    database: "tracker_db",
  },
  console.log("Connected to the tracker_db database")
);

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employees",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then((answer) => {
      if (answer.start === "View All Employees") {
        db.query("SELECT * FROM employee", function (err, results) {
          console.table(results);
          start();
        });
      } else if (answer.start === "View All Roles") {
        db.query("SELECT * FROM role", function (err, results) {
          console.table(results);
          start();
        });
      } else if (answer.start === "View All Departments") {
        db.query("SELECT * FROM department", function (err, results) {
          console.table(results);
          start();
        });
      } else if (answer.start === "Add Department") {
        addDep();
      } else if (answer.start === "Add Role") {
        addRoleTitle();
      }
    });
};

const addDep = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepart",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      if (answer.addDepart !== "") {
        db.query(
          `INSERT INTO department (name) VALUES ("${answer.addDepart}")`,
          function () {
            start();
          }
        );
      }
    });
};
const addRoleTitle = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRoleTitle",
        message: "What is the name of the role?",
      },
    ])
    .then((answer) => {
      if (answer.addRoleTitle !== "") {
        db.query(
          `INSERT INTO role (title) VALUES ("${answer.addRoleTitle}")`,
          function () {
            start();
          }
        );
      }
    });
};

start();
