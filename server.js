// require express
const express = require('express');
// use app as express 
const app = express();
// declare PORT env
const PORT = process.env.PORT || 3001;
// require mysql
const mysql = require('mysql2');
// require console.table
const consoleTb = require('console.table'); 
// require inquirer
const inquirer = require('inquirer');
// require access to sequelize
const Sequelize = require('sequelize');
const Connection = require('mysql2/typings/mysql/lib/Connection');
// require .env variables
require('dotenv').config();

// use .env variables to connect to database
let sequelize = new Sequelize(
    'process.env.DB_NAME',
    'process.env.DB_USERNAME',
    'process.env.DB_PASSWORD',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3001
    }
);

// use inquirer prompt to begin list of choice prompt
function trackerPrompt () {
    // create options list of choices for prompt
    let choicesList = [
    {
        type: 'list',
        message: 'Please select your options to proceed',
        name: 'choice',
        choices: [
                    'View All Employee',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Departments',
                    'Quit'
        ]
    }];
    inquirer.prompt(choicesList)
        .then(function(data){
            // use switch case break on choice data
            switch (data.choice){
                case 'View All Employee':
                    viewAllEmployee();
                case 'Add Employee':
                    addEmployee();
                break;
                case 'Remove Employee':
                    removeEmployee();
                break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                break;
                case 'View All Roles':
                    viewAllRole();
                break;
                case 'Add Role':
                    addRole();
                break;
                case 'View All Departments':
                    viewAllDepartment();
                break;
                case 'Add Departments':
                    addDepartment();
                break;
                case 'Quit':
                    quitPrompt();
                break;
            }
        })
};

// console.table to VIEW ALL EMPLOYEES
function viewAllEmployee() {
    let query = 
    `SELECT employees.first_name AS First_Name, 
    employees.last_name AS Last_Name, 
    roles.title AS Title, 
    departments.department_name AS Department, 
    CONCAT(manager.first_name, manager.last_name) AS Manager FROM employees 
    LEFT JOIN employees manager on manageNER JOIN roles ON (role_id = employees.role_id) 
    INNER JOIN department ON (department_id = roles.department_id) 
    ORDER BY employees.employee_id;`

    sequelize.query(query, function(err, res) {
            if (err) throw (err);
            // view all employees from table
            console.table(res);
            console.log("Viewing All Employees...");
            // return to main prompt
            trackerPrompt();
        });
};

// console.table to ADD EMPLOYEE
function addEmployee() {
    let queryRoles = 
    `SELECT * FROM roles;`
    let employeePrompt = [
        {
            name: 'firstName',
            type: 'input',
            message: 'What is the First Name of new employee?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the Last Name of new employee?'
        },
        {
            name: 'role',
            type: 'rawlist',
            message: 'What is the Role of new employee?',
            choices: roles
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: 'What is the Manager of new employee?',
            choices: employees
        },
    ]
    
    sequelize.query(queryRoles, function(err, res) {
            if (err) throw (err);
            // loop through roles array for role title and role id
            let roles = res.map(roles => ({name: roles.title, value: roles.role_id}));
            let queryEmp = 
            `SELECT * FROM employees;`
            sequelize.query(queryEmp, (err, res) => {
                    if (err) throw (err);
                    // loop through employees array
                    let employees = res.map(employees => ({name: employees.first_name + '' + employees.last_name, value: employees.employee_id})); 
                        inquirer.prompt(employeePrompt)
                        .then((res) => {
                            sequelize.query(`INSERT INTO employees SET ?`,
                            {
                                first_name: res.firstName,
                                last_name: res.lastName,
                                role_id: res.roles,
                                manager_id: res.manager,
                            },
                            (err, res) => {
                                if (err) throw (err);
                            })
                            sequelize.query(`INSERT INTO SET ?`,
                            {
                                department_id: res.departments,
                            },
                            (err, res) => {
                                if(err) throw (err);
                                // view all employees from table
                                console.table(res);
                                console.log("New Employee Added...");
                                // return to main prompt
                                trackerPrompt();
                                
                            });
                        });
                });
        });
};

// option to delete employee from database
function removeEmployee () {
    let queryEmp = 
    `SELECT * FROM employees`;
    sequelize.query(queryEmp, function(err, res) {
        if (err) throw (err);
        let employeeArray = data.map(({ id, first_name, last_name, }) => ({ name: first_name + " " + last_name, value: id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Please select employee to be removed from database',
                choices: employeeArray
            }
        ])
        .then(employeeRemoved => {
            let removedEmp = employeeRemoved.name;
            let query =
            `DELETE FROM employees WHERE id = ?`;
            sequelize.query(query, removedEmp, (err, res) => {
                if (err) throw (err);
                console.table(res);
                console.log('Employee removed from database successfully');
                // return to main prompt
                trackerPrompt();
            })
        })
    })
};


// console.table to UPDATE EMPLOYEE ROLE
function updateEmployeeRole() {
    let queryRoles = 
    `SELECT * FROM roles;`
    let roles = res.map(role => ({name: role.title, value: role.role_id}));
    sequelize.query(queryRoles, function(err, res) {
            if (err) throw (err);
            // view all employee ROLE from table
            console.table(res);
            console.log("Employee Role Updated...");
            // return to main prompt
            trackerPrompt();
        });
};

// console.table to VIEW EMPLOYEE ROLE
function viewAllRole() {
    let query = 
    `SELECT roles.role_id, roles.title, departments.department_name AS Department
    FROM roles
    INNER JOIN Department ON roles.department_id = departments.department_id`

    sequelize.query(query, function(err, res) {
            if (err) throw (err);
            // view all employees from table
            console.table(res);
            console.log("Viewing All Roles...");
            // return to main prompt
            trackerPrompt();
        });
};

// console.table to ADD EMPLOYEE ROLE
function addRole() {
    // declare rolePrompt questions
    let rolePrompt = [
        {
            type: 'input',
            name: 'role',
            message: 'Do you want to add a new Role?',
            // Validate input
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please add a valid Role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the Salary of this new role?',
            // Validate ifNAN return false
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a Number value');
                    return false;
                }
            }
        }
    ];
    // use inquirer for rolePrompt questions
    inquirer.prompt(rolePrompt)
    .then(res => {
        let params = [res.role, res.salary];
        let roleSelect = 
        `SELECT department_name, department_id FROM departments`;
        
        sequelize.query(roleSelect, function(err, res) {
                if (err) throw (err);
                let deptData = data.map(({department_name, department_id}) => ({name: department_name, vlue: department_id}));
                let deptPrompt = [
                    {
                        type: 'list',
                        name: 'deptData',
                        message: 'What Department is this new Role added?',
                        choice: deptData
                    }
                ];

                inquirer.prompt(deptPrompt)
                .then(res => {
                    let deptData = res.deptData;
                    params.push(deptData);
                    
                    let roleSql = 
                    `INSERT INTO roles (title, salary, department_id)
                    VALUE (?, ?, ?)`;

                    // view all employee ROLE from table
                    sequelize.query(roleSql, params, (err, res) => {
                        if (err) throw (err);
                        console.table(res);
                        console.log("Employee Role Added..." + res.role);
                        // return to main prompt
                        trackerPrompt();
                    })
                })
            })
    });
};

// console.table to VIEW ALL Department
function viewAllDepartment() {
    let query = 
    `SELECT departments.department_id AS ID, departments.department_name AS departments`;

    sequelize.query(query, function(err, res) {
            if (err) throw (err);
            // view all DEPARTMENT from table
            console.table(res);
            console.log("Viewing All Departments...");
            // return to main prompt
            trackerPrompt();
        });
};

// console.table to ADD Department
function addDepartment() {
    // declare newDeptPrompt
    let newDeptPrompt = [
        {
            type: 'input',
            name: 'addDept',
            message: 'What new Department would you like to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please input valid department name!');
                    return false;
                }
            }
        }
    ];
    
    inquirer.prompt(newDeptPrompt)
    .then(res => {
        let query = 
        `INSERT INTO departments (department_name)
        VALUES (?)`;
        sequelize.query(query, res.addDept, function(err, res) {
            if (err) throw (err);
            // view all DEPARTMENT from table
            console.table(res);
            console.log("New Department Added..." + res.addDept);
            // return to main prompt
            trackerPrompt();
        });

    })
};

// exit prompt
function quitPrompt() {
    console.log("Exiting prompt...");
    sequelize.close;
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log('APP is now listeneing at',{PORT}));
});