-- View all departments
SELECT * FROM department;

-- View all roles
SELECT r.id AS Role_ID, r.title AS Title, r.salary AS Salary, d.name AS Department
FROM role AS r
LEFT JOIN department AS d ON r.department_id = d.id;

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
LEFT JOIN role AS r ON e.role_id = r.id
LEFT JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id;