-- delete existing database
DROP DATABASE IF EXISTS employee_DB;
-- create db
CREATE DATABASE employee_DB;
-- select db
USE employee_DB;

-- create 3 tables for dept, role, employee
-- table for departments
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30)
);

-- table for roles
CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    department_id INT,
    salary DECIMAL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- table for employees
CREATE TABLE employees (
    employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);