const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
});

const questions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Please enter a department name'
    },
    {
        type: 'input',
        name: 'roleData',
        message: 'Please enter role data'
    },
    {
        type: 'input',
        name: 'employeeData',
        message: 'Please enter employee data'
    },
]

inquirer.prompt(questions).then((answerObj) => {
    const sql = `INSERT INTO department (name) VALUES (?)`;

    connection.query(sql, [answerObj.departmentName], (err, results) => {
        if (err) return console.log(err);

        connection.query('SELECT * FROM department', (err, data) => {
            if (err) return console.log(err);

            console.log('New department added\n,',);

            connection.query('SELECT * FROM department', (err, data) => {
                if(err) return console.log(err);
                console.log(data);
            });

            connection.end();
        });
    });
});

inquirer.prompt(questions).then((answerObj) => {
    const sql = `INSERT INTO role (name, salary, department) VALUES (?, ?, ?)`;

    connection.query(sql, [answerObj.roleData], (err, results) => {
        if (err) return console.log(err);

        connection.query('SELECT * FROM role', (err, data) => {
            if (err) return console.log(err);

            console.log('New role added\n,',);

            connection.query('SELECT * FROM role', (err, data) => {
                if(err) return console.log(err);
                console.log(data);
            });

            connection.end();
        });
    });
});

inquirer.prompt(questions).then((answerObj) => {
    const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

    connection.query(sql, [answerObj.employeeData], (err, results) => {
        if (err) return console.log(err);

        connection.query('SELECT * FROM employee', (err, data) => {
            if (err) return console.log(err);

            console.log('New employee added\n,',);

            connection.query('SELECT * FROM employee', (err, data) => {
                if(err) return console.log(err);
                console.log(data);
            });

            connection.end();
        });
    });
});