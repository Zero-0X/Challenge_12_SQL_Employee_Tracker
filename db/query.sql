-- View all employees
SELECT 
    e.id AS Employee_ID,
    e.first_name AS First_Name,
    e.last_name AS Last_Name,
    r.title AS Role,
    d.name AS Department,
    r.salary AS Salary,
    CONCAT(m.first_name, ' ', m.last_name) AS Manager
FROM employee AS e
LEFT JOIN roles AS r ON e.role_id = r.id
LEFT JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id;

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 2);

-- Update employee role
UPDATE employee
SET role_id = 3
WHERE id = 5;

-- View All Roles
SELECT
    r.id AS Role_ID,
    r.title AS Title,
    r.salary AS Salary,
    d.name AS Department
FROM roles AS r
LEFT JOIN department AS d ON r.department_id = d.id;

-- Add role
INSERT INTO roles (title, salary, department_id)
VALUES ('Software Engineer', 85000, 1);

-- View all departments
SELECT * FROM department;

-- Add department
INSERT INTO department (name)
VALUES ('Finance');
