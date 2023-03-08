const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const roleArr = [];
let empArr = [];

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'jacket52',
    database: 'tracker_db',
  },
  console.log('Connected to the tracker_db database')
);

const start = () => {
  empArr = [];
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'Add Employees',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Update Employee Role',
          'Quit',
        ],
      },
    ])
    .then((answer) => {
      if (answer.start === 'View All Employees') {
        db.query(
          "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name,' ' ,manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id =  role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id",
          function (err, results) {
            console.table(results);
            start();
          }
        );
      } else if (answer.start === 'View All Roles') {
        db.query('SELECT * FROM role', function (err, results) {
          console.table(results);
          start();
        });
      } else if (answer.start === 'View All Departments') {
        db.query('SELECT * FROM department', function (err, results) {
          console.table(results);
          start();
        });
      } else if (answer.start === 'Add Department') {
        addDep();
      } else if (answer.start === 'Add Role') {
        addRoleTitle();
      } else if (answer.start === 'Add Employees') {
        addEmpFirst();
      } else if (answer.start === 'Update Employee Role') {
        updateRole();
      } else if (answer.start === 'Quit') {
        console.log('\nHave a great day!!!\n');
        process.exit();

      }
    });
};

const addDep = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addDepart',
        message: 'What is the name of the department?',
      },
    ])
    .then((answer) => {
      if (answer.addDepart !== '') {
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
        type: 'input',
        name: 'addRoleTitle',
        message: 'What is the name of the role?',
      },
    ])
    .then((answer) => {
      if (answer.addRoleTitle !== '') {
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
        type: 'input',
        name: 'addRoleSalary',
        message: 'What is the salary of the role?',
      },
    ])
    .then((answer) => {
      if (answer.addRoleSalary !== '') {
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
        type: 'list',
        name: 'selectDepart',
        message: 'Which department does the role belong to?',
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
        type: 'input',
        name: 'addEmpFirst',
        message: "What is the Employee's first name?",
      },
    ])
    .then((answer) => {
      if (answer.addEmpFirst !== '') {
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
        type: 'input',
        name: 'addEmpLast',
        message: "What is the Employee's last name?",
      },
    ])
    .then((answer) => {
      if (answer.addEmpLast !== '') {
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
        type: 'list',
        name: 'selectEmpRole',
        message: 'Which department does the role belong to?',
        choices: name,
      },
    ])
    .then((answer) => {
      db.query(
        `SELECT id FROM role WHERE title="${answer.selectEmpRole}"`,
        function (err, results) {
          empArr.push(results[0].id);
          console.log(empArr);
        }
      );
      getManager();
    });
};

const getManager = () => {
  db.query(
    `SELECT first_name, last_name FROM employee`,
    function (err, results) {
      const managers = [];
      managers.push('None');
      for (let index = 0; index < results.length; index++) {
        managers.push(`${results[index].first_name}`);
      }
      selectManager(managers);
    }
  );
};

const selectManager = (manager) => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectManager',
        message: "Who is the employee's manager?",
        choices: manager,
      },
    ])
    .then((answer) => {
      if (answer.selectManager !== 'None') {
        db.query(
          `SELECT * FROM employee WHERE first_name="${answer.selectManager}"`,
          function (err, results) {
            console.log(results);
            empArr.push(results[0].id);
            console.log(empArr);
            let empAdd = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${empArr[0]}","${empArr[1]}",${empArr[2]},${empArr[3]})`;
            db.query(empAdd);
            start();
          }
        );
      } else {
        console.log(empArr);
        let empAdd = `INSERT INTO employee (first_name,last_name,role_id) VALUES ("${empArr[0]}","${empArr[1]}","${empArr[2]}")`;
        db.query(empAdd);
        start();
      }
    });
};

const updateRole = () => {
  const employee = [];
  const roleArr2 = [];
  let empToUpdate;
  db.query(
    `SELECT first_name, last_name FROM employee`,
    function (err, results) {
      for (let index = 0; index < results.length; index++) {
        employee.push(
          results[index].first_name + ' ' + results[index].last_name
        );
      }
      console.log(employee);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'updateRole',
            message: "Which employees's role do you want to update?",
            choices: employee,
          },
        ])
        .then((answer) => {
          empToUpdate = answer.updateRole;
          db.query(`SELECT title FROM role`, function (err, results) {
            for (let i = 0; i < results.length; i++) {
              roleArr2.push(results[i].title);
            }
            updateChosen(empToUpdate, roleArr2);
          });
        });
    }
  );
};

const updateChosen = (chosen, roles) => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'chosen',
        message: 'Which role would you like to update',
        choices: roles,
      },
    ])
    .then((answer) => {
      const pick = chosen.split(' ', 2);

      db.query(
        `SELECT id FROM role WHERE title ='${answer.chosen}'`,
        function (err, results) {
          db.query(
            `UPDATE employee SET role_id='${results[0].id}' WHERE first_name='${pick[0]}'`,
            function (err, results2) {
              return results2;
            }
          );
        }
      );
      start();
    });
};

start();
