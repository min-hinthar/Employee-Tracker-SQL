// require mysql
const mysql = require('mysql2');
// require console.table
const consoleTb = require('console.table'); 
// require inquirer
const inquirer = require('inquirer');


// use .env variables to connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      password: '@UCLAroot',
      database: 'employee_DB'
    },
    console.log(`Connected to the employee_DB.`)
  );

trackerPrompt();

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
    console.log("trackerPrompt is functional");
    inquirer.prompt(choicesList)
        .then(function(data){
            
            // use switch case break on choice data
            console.log(data.choice)
            switch (data.choice){
                case 'View All Employee':
                    viewAllEmployee();
                break;
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
    CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employees 
    LEFT JOIN roles ON (roles.role_id = employees.role_id) 
    INNER JOIN departments ON (departments.department_id = roles.department_id)
    LEFT JOIN employees AS manager ON ( manager.employee_id = employees.manager_id) 
    ORDER BY employees.employee_id;`

    db.query(query, function(err, res) {
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
    db.query(queryRoles, function(err, res) {
        if (err) throw (err);
        // loop through roles array for role title and role id
        let roles = res.map(roles => ({name: roles.title, value: roles.role_id}));
        let employeesList = res.map(employees => ({name: employees.first_name + ' ' + employees.last_name, value: employees.employee_id})); 
        
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
                message: 'Who is the Manager of new employee?',
                choices: employeesList
            },
        ]
        
        let queryEmp = 
            `SELECT * FROM employees;`
            db.query(queryEmp, (err, res) => {
                    if (err) throw (err);
                    // loop through employees array
                        inquirer.prompt(employeePrompt)
                        .then((res) => {
                            db.query(`INSERT INTO employees SET ?`,
                            {
                                first_name: res.firstName,
                                last_name: res.lastName,
                                role_id: res.role,
                                manager_id: res.manager,
                            },
                            (err, res) => {
                                if (err) throw (err);
                            })
                            db.query(`INSERT INTO SET ?`,
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
    db.query(queryEmp, function(err, res) {
        if (err) throw (err);
        let employeeArray = res.map(({ id, first_name, last_name, }) => ({ name: first_name + " " + last_name, value: id}));
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
            db.query(query, removedEmp, (err, res) => {
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
    let queryEmp = 
    `SELECT * FROM employees`;
    db.query(queryEmp, function(err, res)  {
        if (err) throw (err);
        let employeeArray = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
            type: 'list',
            name: 'name',
            message: 'Please select employee to update role?',
            choices: employeeArray
            }
        ])
        .then(updEmp => {
            let updatedEmp = updEmp.name;
            let params = [];
            params.push(updatedEmp);
            const query = 
            `SELECT * FROM roles`;
            db.query(query, function(err, res) {
                if (err) throw (err);
                let rolesArray = res.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role for the employee?',
                        choices: rolesArray
                    }
                ])
                .then(roleEmp => {
                    let newRole = roleEmp.role;
                    params.push(newRole);
                    let employee = params[0]
                    params[0] = newRole
                    params[1] = employee

                    let query = 
                    `UPDATE employees SET role_id = ? WHERE id = ?`;
                    db.query(query, params, function(err, res) {
                        if (err) throw (err);
                        console.table(res);
                        console.log('Role of employee updated successfully');
                        // return to main prompt
                        trackerPrompt();
                    })
                })
            })
        })
    })
};

// console.table to VIEW EMPLOYEE ROLE
function viewAllRole() {
    let query = 
    `SELECT roles.role_id, roles.title, departments.department_name AS Department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.department_id`

    db.query(query, function(err, res) {
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
        
        db.query(roleSelect, function(err, res) {
                if (err) throw (err);
                let deptData = data.map(({department_name, department_id}) => ({name: department_name, value: department_id}));
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
                    db.query(roleSql, params, (err, res) => {
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
    `SELECT departments.department_id AS id, departments.department_name AS department FROM departments`;

    db.query(query, function(err, res) {
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
        db.query(query, res.addDept, function(err, res) {
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
    db.close;
};
