const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "employee_trackerDB",
});

connection.connect(function(err) {
	if (err) throw err;
});

const appQuest = function() {
  inquirer
    .prompt({
      type: "list",
      name: "startQ",
      message: "What would you like to do?",
      choices: [
        "view all employees",
        "view all roles",
        "view all departments",
        "add employee",
        "add department",
        "add role",
        "Exit"
      ]
    })
    .then(function(answer) {
      console.log(answer);
      // start of switch statment for user choice
      switch (answer.startQ) {
        case "view all employees":
          viewallemployees();
          break;

        case "view all roles":
          viewallroles();
          break;

        case "view all departments":
          viewalldepartments();
          break;

        case "add employee":
          addEmployee();
          break;

        case "add department":
          addDepartment();
          break;

        case "add role":
          addRole();
          break;

        case 'Exit':
           connection.end();
           break;
      }
    });
};
appQuest();

// View all the departments
function viewalldepartments() {
  connection.query("SELECT * FROM department", function(err, answer) {
    console.log("\n Departments Retrieved from Database \n");
    console.table(answer);
  });
  appQuest();
}

// View all employee roles
function viewallroles() {
  connection.query("SELECT * FROM role", function(err, answer) {
    console.log("\n Roles Retrieved from Database \n");
    console.table(answer);
  });
  appQuest();
}

// View all employees 
function viewallemployees() {
  console.log("retrieving employess from database");
  var fancyQuery =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(fancyQuery, function(err, answer) {
    console.log("\n Employees retrieved from Database \n");
    console.table(answer);
  });
  appQuest();
}

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input", 
                message: "Employee's fist name: ",
            },
            {
                name: "last_name",
                type: "input", 
                message: "Employee's last name: "
            },
            {
                name: "role", 
                type: "list",
                choices: function() {
                var roleArray = [];
                for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title);
                }
                return roleArray;
                },
                message: "What is this employee's role? "
            }
            ]).then(function (answer) {
                let roleID;
                for (let j = 0; j < res.length; j++) {
                if (res[j].title == answer.role) {
                    roleID = res[j].id;
                    console.log(roleID)
                }                  
                }  
                connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleID,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your employee has been added!");
                    appQuest();
                }
                )
            })
    })
}


// Add a new department into the database
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "enter department name",
      name: "dept"
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
        }
      ),
        console.table(answer);
      appQuest();
    });
}

// Add a new role/title
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "enter employee title",
        name: "addtitle"
      },
      {
        type: "input",
        message: "enter employee salary",
        name: "addsalary"
      },
      {
        type: "input",
        message: "enter employee department id",
        name: "addDepId"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.addtitle,
          salary: answer.addsalary,
          department_id: answer.addDepId
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
        }
      );
      appQuest();
    });
}
