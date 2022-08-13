-- use the employee_DB to insert employee information
USE employee_DB;

-- departments table values Sales, Engineering, Finance, Legal
INSERT INTO departments (department_name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

-- roles table values Title, Salary, DepartmentID
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
('Salesperson', 80000, 1), 
('Lead Engineer', 150000, 2), 
('Software Engineer', 120000, 2), 
('Account Manager', 160000, 3), 
('Accountant', 125000, 3), 
('Legal Team Lead', 250000, 4), 
('Lawyer', 190000, 4);

-- employees table with values firstN, lastN, roleID, managerID
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Su', 'Yi', 1, null),
('Min', 'Kant', 2, 1),
('Steve', 'Hops', 3, null),
('Edward', 'Winters', 4, 3),
('Kevin', 'Singh', 5, null),
('Tam', 'Sawyer', 6, 5),
('Abbie', 'Lincoln', 7, null),
('Johnny', 'Shallows', 8, 6);