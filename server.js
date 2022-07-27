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

// use inquirer prompt to begin list of choice prompt
function trackerPrompt () {
    inquirer.prompt(choicesList)
        .then(function(data){
            // use switch case break on choice data
            switch (data.choice){
                case 'View All Employee':
                    viewAllEmployee();
                case 'Add Employee':
                    addEmployee();
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

// console.table to VIEW all employess
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

// console.table to ADD employess
function addEmployee() {
    let query = 
    `SELECT `

    sequelize.query(query, function(err, res) {
            if (err) throw (err);
            // view all employees from table
            console.table(res);
            console.log("Employee Added...");
            // return to main prompt
            trackerPrompt();
        });
};

// console.table to ADD employess
function updateEmployeeRole() {
    let query = 
    `SELECT `

    sequelize.query(query, function(err, res) {
            if (err) throw (err);
            // view all employees from table
            console.table(res);
            console.log("Employee Role Updated...");
            // return to main prompt
            trackerPrompt();
        });
};

// console.table to ADD employess
function viewAllRole() {
    let query = 
    `SELECT `

    sequelize.query(query, function(err, res) {
            if (err) throw (err);
            // view all employees from table
            console.table(res);
            console.log("Viewing All Roles...");
            // return to main prompt
            trackerPrompt();
        });
};



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log('APP is now listeneing at',{PORT}));
});