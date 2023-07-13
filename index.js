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
        name: '',
        message: ''
    }
    {

    }
]

inquirer.prompt(questions).then((answerObj) => {
    const sql = `INSERT INTO biographies (name, author) VALUES (?, ?)`;

    connection.query(sql, [answerObj.biographyName, answerObj.author], (err, results) => {
        if (err) return console.log(err);

        connection.query('SELECT * FROM biographies', (err, data) => {
            if (err) return console.log(err);

            console.log('New biography and author added\n,',);

            connection.query('SELECT * FROM biographies', (err, data) => {
                if(err) return console.log(err);
                console.log(data);
            });

            connection.end();
        });
    });
});