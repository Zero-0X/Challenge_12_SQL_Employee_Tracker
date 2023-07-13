INSERT INTO  (first_name, last_name) 
VALUES ('John', 'Jones'),
    ('Jacob', 'Marley'),
    ('Jingle', 'Bells'),
    ('Heimer', 'Schmidt'),
    ('Minnie', 'Mouse'),
    ('Mickey', 'Mouse');

INSERT INTO  (project_name, student_id)
VALUES ('soundtrack', 1),
    ('finances', 2),
    ('soundtrack', 2),
    ('soundtrack', 3),
    ('soundtrack', 4),
    ('animation', 5),
    ('animation', 6);

    SELECT 
    CONCAT(first_name, ' ', last_name) AS student_name,
    project_name,
    completed
        FROM students
        JOIN projects ON students.id = projects.student_id;