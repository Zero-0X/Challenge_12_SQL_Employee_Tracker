const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
});

const startTracking = async () => {
    console.log(`Begin Employee Tracking`);

    //Using inquirer to prompt users with different options
    await inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Main Menu",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "View All Employees by ROLE",
                "View All Employees by DEPARTMENT",
                "View All Employees by MANAGER",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee ROLE",
                "Update Employee MANGER",
                "Delete Employee",
                "Delete ROLE",
                "Delete DEPARTMENT",
                "View Department Budgets",
            ],
        })
        .then((answer) => {
            // Call the appropriate function based on the user's choice
            switch (answer.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Employees by DEPARTMENT':
                    viewAllEmployeesByDepartment();
                    break;
                case 'View All Employees by ROLE':
                    viewAllEmployeesByRole();
                    break;
                case 'View All Employees by MANAGER':
                    viewAllEmployeesByManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Employee ROLE':
                    updateEmployeeRole();
                    break;
                case 'Update Employee MANGER':
                    updateEmployeeManager();
                    break;
                case 'Delete Employee':
                    deleteEmployee();
                    break;
                case 'Delete ROLE':
                    deleteRole();
                    break;
                case 'Delete DEPARTMENT':
                    deleteDepartment();
                    break;
                case 'View Department Budgets':
                    viewDepartmentBudgets();
                    break;
                case 'Exit':
                    connection.end();
                    console.log('Employees managed!');
                default:
                    console.log('Invalid choice. Please select a valid option.');
                    startTracking();
            };
        });
};


// Prompt for department data
const departmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Please enter the department name:',
    },
];

// Prompt for role data
const roleQuestions = [
    {
        type: 'input',
        name: 'roleTitle',
        message: 'Please enter the role title:',
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'Please enter the role salary:',
    },
    {
        type: 'input',
        name: 'roleDepartment',
        message: 'Please enter the department ID for the role:',
    },
];

// Prompt for employee data
const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: "Please enter the employee's first name:",
    },
    {
        type: 'input',
        name: 'lastName',
        message: "Please enter the employee's last name:",
    },
    {
        type: 'input',
        name: 'roleId',
        message: "Please enter the employee's role ID:",
    },
    {
        type: 'input',
        name: 'managerId',
        message: "Please enter the employee's manager ID:",
    },
];

const addDepartment = () => {
    inquirer.prompt(departmentQuestions).then((answerObj) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;

        connection.query(sql, [answerObj.departmentName], (err) => {
            if (err) return console.log(err);

            console.log('New department added\n,',);

            connection.query('SELECT * FROM department', (err, data) => {
                if (err) return console.log(err);
                console.table('Departments:', data);
                startTracking();
            });
        });
    });
};

const addRole = () => {
    inquirer.prompt(roleQuestions).then((answerObj) => {
        const sql = `INSERT INTO role (name, salary, department) VALUES (?, ?, ?)`;

        connection.query(sql, [answerObj.roleData], (err) => {
            if (err) return console.log(err);

            console.log('New role added\n,',);

            connection.query('SELECT * FROM role', (err, data) => {
                if (err) return console.log(err);
                console.table('Roles:', data);
                startTracking();
            });
        });
    });
};

const addEmployee = () => {
    inquirer.prompt(employeeQuestions).then((answerObj) => {
        const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)`;

        connection.query(sql, [answerObj.employeeData], (err, results) => {
            if (err) return console.log(err);

            console.log('New employee added\n,',);

            connection.query('SELECT * FROM employee', (err, data) => {
                if (err) return console.log(err);
                console.table('Employees:', data);
                startTracking();
            });
        });
    });
};


// View All Departments
const viewAllDepartments = () => {
    connection.query('SELECT * FROM department', (err, data) => {
        if (err) return console.log(err);
        console.table('Departments:', data);
        startTracking();
    });
};

// View All Roles
const viewAllRoles = () => {
    connection.query(
        'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id',
        (err, data) => {
            if (err) return console.log(err);
            console.table('Roles:', data);
            startTracking();
        }
    );
};

// View All Employees
const viewAllEmployees = () => {
    connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
        (err, data) => {
            if (err) return console.log(err);
            console.table('Employees:', data);
            startTracking();
        }
    );
};

const viewAllEmployeesByDepartment = () => {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Enter the department name:",
        })
        .then((answer) => {
            const departmentName = answer.departmentName;
            const sql = `
          SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
          FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          WHERE role.title = ?
        `;

            connection.query(sql, [departmentName], (err, data) => {
                if (err) return console.log(err);
                console.table(`Employees in the role "${departmentName}":`, data);
                startTracking();
            });
        });
};

const viewAllEmployeesByRole = () => {
    inquirer
        .prompt({
            name: "role",
            type: "input",
            message: "Enter the role name:",
        })
        .then((answer) => {
            const roleName = answer.roleTitle;
            const sql = `
          SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
          FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          WHERE role.title = ?
        `;

            connection.query(sql, [roleName], (err, data) => {
                if (err) return console.log(err);
                console.table(`Employees in the role "${roleName}":`, data);
                startTracking();
            });
        });
};

const viewAllEmployeesByManager = () => {
    inquirer
        .prompt({
            name: "managerId",
            type: "input",
            message: "Enter the manager ID:",
        })
        .then((answer) => {
            const managerId = answer.managerId;
            const sql = `
                SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                WHERE employee.manager_id = ?
            `;

            connection.query(sql, [managerId], (err, data) => {
                if (err) return console.log(err);
                console.table(`Employees managed by Manager ID "${managerId}":`, data);
                startTracking();
            });
        });
};

// Update Employee Role
const updateEmployeeRole = () => {
    // Prompt for employee ID and new role ID
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: "Please enter the employee's ID:",
            },
            {
                type: 'input',
                name: 'roleId',
                message: "Please enter the new role ID for the employee:",
            },
        ])
        .then((answerObj) => {
            const { employeeId, roleId } = answerObj;
            const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';

            connection.query(sql, [roleId, employeeId], (err, result) => {
                if (err) return console.log(err);

                console.log('Employee role updated!');

                connection.query('SELECT * FROM employee', (err, data) => {
                    if (err) return console.log(err);
                    console.table('Employees:', data);
                    startTracking();
                });
            });
        });
};

// Connect to the database and start the application
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database. Please make sure the MySQL server is running.');
        return;
    }
    console.log('Connected to the employee_db database.');

    // Read the seeds.sql file
    fs.readFile('db/seeds.sql', 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading seeds.sql file:', err);
            return;
        }

        // Execute the SQL statements in the seeds.sql file
        connection.query(sql, (err) => {
            if (err) {
                console.error('Error executing seeds.sql:', err);
                return;
            }

            console.log('Seeds executed successfully.');

            // Start the application
            startTracking();
        });
    });
});