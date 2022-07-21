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
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3001
    }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log('APP is now listeneing at',{PORT}));
});