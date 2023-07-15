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

  // Using inquirer to prompt users with different options
  await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Main Menu',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'Exit',
    ],
  }).then(async (answer) => {
    // Call the appropriate function based on the user's choice
    switch (answer.action) {
      case 'View All Departments':
        await viewAllDepartments();
        break;
      case 'View All Roles':
        await viewAllRoles();
        break;
      case 'View All Employees':
        await viewAllEmployees();
        break;
      case 'Add a Department':
        await addDepartment();
        break;
      case 'Add a Role':
        await addRole();
        break;
      case 'Add an Employee':
        await addEmployee();
        break;
      case 'Update an Employee Role':
        await updateEmployeeRole();
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

// View All Departments
const viewAllDepartments = async () => {
  try {
    const [departments] = await connection.promise().query('SELECT * FROM department');
    console.table('All Departments:', departments);
    startTracking();
  } catch (error) {
    console.error('Error viewing all departments:', error);
    startTracking();
  }
};

// View All Roles
const viewAllRoles = async () => {
  try {
    const query = `
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
    `;
    const [roles] = await connection.promise().query(query);
    console.table('All Roles:', roles);
    startTracking();
  } catch (error) {
    console.error('Error viewing all roles:', error);
    startTracking();
  }
};

// View All Employees
const viewAllEmployees = async () => {
  try {
    const query = `
      SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name,
      role.title AS Role, department.name AS Department, role.salary AS Salary,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
      FROM employee AS e
      LEFT JOIN role ON e.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS m ON e.manager_id = m.id
    `;
    const [employees] = await connection.promise().query(query);
    console.table('All Employees:', employees);
    startTracking();
  } catch (error) {
    console.error('Error viewing all employees:', error);
    startTracking();
  }
};

// Add a Department
const addDepartment = async () => {
  try {
    const departmentData = await inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
      validate: (input) => {
        if (!input.trim()) {
          return 'Department name cannot be empty.';
        }
        return true;
      },
    });

    const query = 'INSERT INTO department (name) VALUES (?)';
    await connection.promise().query(query, [departmentData.name]);

    console.log('Department added successfully.');
    startTracking();
  } catch (error) {
    console.error('Error adding department:', error);
    startTracking();
  }
};

// Add a Role
const addRole = async () => {
  try {
    const [departments] = await connection.promise().query('SELECT * FROM department');
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const roleData = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
        validate: (input) => {
          if (!input.trim()) {
            return 'Role title cannot be empty.';
          }
          return true;
        },
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:',
        validate: (input) => {
          if (isNaN(input) || parseInt(input) <= 0) {
            return 'Salary must be a positive number.';
          }
          return true;
        },
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      },
    ]);

    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    await connection.promise().query(query, [roleData.title, roleData.salary, roleData.department_id]);

    console.log('Role added successfully.');
    startTracking();
  } catch (error) {
    console.error('Error adding role:', error);
    startTracking();
  }
};

// Add an Employee
const addEmployee = async () => {
  try {
    const [roles] = await connection.promise().query('SELECT * FROM role');
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const [employees] = await connection.promise().query('SELECT * FROM employee');
    const managerChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    managerChoices.push({ name: 'None', value: null });

    const employeeData = await inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the first name of the employee:',
        validate: (input) => {
          if (!input.trim()) {
            return 'First name cannot be empty.';
          }
          return true;
        },
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the last name of the employee:',
        validate: (input) => {
          if (!input.trim()) {
            return 'Last name cannot be empty.';
          }
          return true;
        },
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the role for the employee:',
        choices: roleChoices,
      },
      {
        name: 'manager_id',
        type: 'list',
        message: 'Select the manager for the employee:',
        choices: managerChoices,
      },
    ]);

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    await connection.promise().query(query, [employeeData.first_name, employeeData.last_name, employeeData.role_id, employeeData.manager_id]);

    console.log('Employee added successfully.');
    startTracking();
  } catch (error) {
    console.error('Error adding employee:', error);
    startTracking();
  }
};

// Update Employee Role
const updateEmployeeRole = async () => {
  try {
    const [employees] = await connection.promise().query('SELECT * FROM employee');
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const [roles] = await connection.promise().query('SELECT * FROM role');
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const employeeToUpdate = await inquirer.prompt({
      name: 'employee_id',
      type: 'list',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    });

    const newRole = await inquirer.prompt({
      name: 'role_id',
      type: 'list',
      message: 'Select the new role for the employee:',
      choices: roleChoices,
    });

    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    await connection.promise().query(query, [newRole.role_id, employeeToUpdate.employee_id]);

    console.log('Employee role updated successfully.');
    startTracking();
  } catch (error) {
    console.error('Error updating employee role:', error);
    startTracking();
  }
};

// Connect to the database and start the application
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database. Please make sure the MySQL server is running.');
    return;
  }
  console.log('Connected to the employee_db database.');

  // Read and execute the schema.sql file
  fs.readFile('./db/schema.sql', (err, schemaBuffer) => {
    if (err) {
      console.error('Error reading schema.sql file:', err);
      return;
    }
  
    const schema = schemaBuffer.toString('utf8'); // Convert buffer to a string
    const queries = schema.split(';'); // Split the content into individual queries

    // Execute each query one by one
    queries.forEach(async (query) => {
      if (query.trim() !== '') {
        try {
          await connection.promise().query(query);
        } catch (error) {
          console.error('Error executing query:', error);
        }
      }
    });

    console.log('Schema executed successfully.');


      // Read and execute the seeds.sql file
      fs.readFile('./db/seeds.sql', async (err, seeds) => {
        if (err) {
          console.error('Error reading seeds.sql file:', err);
          return;
        }

        const seedQueries = seeds.toString().split(';');

        for (const query of seedQueries) {
            const trimmedQuery = query.trim();
            if(trimmedQuery !== '') {
                try {
                    await connection.promise().query(trimmedQuery);
                } catch (error) {
                    console.error('Error executing query:', error);
                }
            }
        }

          console.log('Seeds executed successfully.');

          // Read and execute the query.sql file
          fs.readFile('./db/query.sql', (err, query) => {
            if (err) {
              console.error('Error reading query.sql file:', err);
              return;
            }

            // Split the data by semicolon to get individual queries
            const queries = query.toString().split(';');

            // Execute each query
            queries.forEach(async (query) => {
              if (query.trim() !== '') {
                try {
                  await connection.promise().query(query);
                } catch (error) {
                  console.error('Error executing query:', error);
                }
              }
            });

            // Start the application
            startTracking();
          });
        });
      });
    });
