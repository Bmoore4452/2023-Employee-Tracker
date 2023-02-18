DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)

);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT

);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT

);

