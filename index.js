const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
});

const startTracking = async () => {
    console.log(`Begin Employee Tracking`);

    // Using inquirer to prompt users with different options
    await inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Main Menu",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Exit",
            ],
        })
        .then((answer) => {
            // Call the appropriate function based on the user's choice
            switch (answer.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    console.log('Employees managed!');
                    break;
                default:
                    console.log('Invalid choice. Please select a valid option.');
                    startTracking();
            }
        });
};


// ...

// Connect to the database and start the application
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database. Please make sure the MySQL server is running.');
        return;
    }
    console.log('Connected to the employee_db database.');

    // Read and execute the schema.sql file
    fs.readFile('./db/schema.sql', 'utf8', (err, schema) => {
        if (err) {
            console.error('Error reading schema.sql file:', err);
            return;
        }

        connection.query(schema, (err) => {
            if (err) {
                console.error('Error executing schema.sql:', err);
                return;
            }

            console.log('Schema executed successfully.');

            // Read and execute the seeds.sql file
            fs.readFile('./db/seeds.sql', 'utf8', (err, seeds) => {
                if (err) {
                    console.error('Error reading seeds.sql file:', err);
                    return;
                }

                connection.query(seeds, (err) => {
                    if (err) {
                        console.error('Error executing seeds.sql:', err);
                        return;
                    }

                    console.log('Seeds executed successfully.');

                    // Read and execute the query.sql file
                    fs.readFile('./db/query.sql', 'utf8', (err, query) => {
                        if (err) {
                            console.error('Error reading query.sql file:', err);
                            return;
                        }

                        // Split the data by semicolon to get individual queries
                        const queries = query.split(';');

                        // Execute each query
                        queries.forEach((query) => {
                            if (query.trim() !== '') {
                                connection.query(query, (err, results) => {
                                    if (err) {
                                        console.error('Error executing query:', err);
                                        return;
                                    }
                                    console.log(results);
                                });
                            }
                        });

                        // Start the application
                        startTracking();
                    });
                });
            });
        });
    });
});
