INSERT INTO department (name)
VALUES (Engineering),
(Marketing),
(Accounting),
(Sales),
(Legal),

INSERT INTO role (id, title, salary, department_id)
VALUES (1),
 (2),
 (3),
 (4),
 (5);

INSERT INTO employee (first_name, last_name, role_id) 
VALUES ('John', 'Jones'),
    ('Jacob', 'Marley'),
    ('Jingle', 'Bells'),
    ('Heimer', 'Schmidt'),
    ('Mickey', 'Mouse');

    

    SELECT 
    CONCAT(first_name, ' ', last_name) AS student_name,
    project_name,
    completed
        FROM students
        JOIN projects ON students.id = projects.student_id;