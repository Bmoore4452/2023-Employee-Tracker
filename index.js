const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const roleArr = [];
const empArr = [];

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
      } else if (answer.start === "Add Employees") {
        addEmpFirst();
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
        const roleTite = answer.addRoleTitle;
        // db.query(`INSERT INTO role (title) VALUES ("${answer.addRoleTitle}")`);
        roleArr.push(roleTite);
        console.log(roleArr);
        addRoleSalary();
      }
    });
};

const addRoleSalary = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRoleSalary",
        message: "What is the salary of the role?",
      },
    ])
    .then((answer) => {
      if (answer.addRoleSalary !== "") {
        const roleSalary = answer.addRoleSalary;
        roleArr.push(roleSalary);
        console.log(roleArr);
      }
    })
    .then(() => {
      db.query(`SELECT * FROM department`, function (err, results) {
        const name = [];
        for (let index = 0; index < results.length; index++) {
          name.push(results[index].name);
        }
        selectDepart(name);
      });
    });
};

const selectDepart = (name) => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selectDepart",
        message: "Which department does the role belong to?",
        choices: name,
      },
    ])
    .then((answer) => {
      db.query(
        `SELECT * FROM department WHERE name="${answer.selectDepart}"`,
        function (err, results) {
          roleArr.push(results[0].id);
          console.log(roleArr);
          let roleAdd = `INSERT INTO role (title,salary,department_id) VALUES ("${roleArr[0]}","${roleArr[1]}","${roleArr[2]}")`;
          db.query(roleAdd);
          start();
        }
      );
    });
};

const addEmpFirst = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addEmpFirst",
        message: "What is the Employee's first name?",
      },
    ])
    .then((answer) => {
      if (answer.addEmpFirst !== "") {
        const empFirst = answer.addEmpFirst;
        // db.query(`INSERT INTO role (title) VALUES ("${answer.addRoleTitle}")`);
        empArr.push(empFirst);
        console.log(empArr);
        addEmpLast();
      }
    });
};

const addEmpLast = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addEmpLast",
        message: "What is the Employee's last name?",
      },
    ])
    .then((answer) => {
      if (answer.addEmpLast !== "") {
        const empLast = answer.addEmpLast;
        empArr.push(empLast);
        console.log(empArr);
      }
    })
    .then(() => {
      db.query(`SELECT * FROM role`, function (err, results) {
        const name = [];
        for (let index = 0; index < results.length; index++) {
          name.push(results[index].title);
        }
        selectEmpRole(name);
      });
    });
};

const selectEmpRole = (name) => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selectEmpRole",
        message: "Which department does the role belong to?",
        choices: name,
      },
    ])
    .then((answer) => {
      empArr.push(answer.selectEmpRole);
      console.log(empArr);
    });
};

start();
