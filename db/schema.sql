-- delete existing database
DROP DATABASE IF EXISTS employee_DB;
-- create db
CREATE DATABASE employee_DB;
-- select db
USE employee_DB;

-- create 3 tables for dept, role, employee
-- table for departments
CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30)
);

-- table for roles
CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department_id
);

-- table for employees
