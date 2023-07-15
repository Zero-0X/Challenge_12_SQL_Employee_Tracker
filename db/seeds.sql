INSERT INTO department (name)
VALUES ('Engineering'),
       ('Marketing'),
       ('Accounting'),
       ('Sales'),
       ('Legal'),
       ('IT');

INSERT INTO role (title, salary, department_id)
VALUES ('Senior Engineer', 100000, 1),
       ('Chief Marketing Officer', 100000, 2),
       ('Senior Accountant', 100000, 3),
       ('Head of Sales', 100000, 4),
       ('Chief Legal Representative', 100000, 5),
       ('Tech Support Lead', 100000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Dave', 'Cutler', 1, NULL),
       ('Jacob', 'Marley', 2, NULL),
       ('Ebenezer', 'Scrooge', 3, NULL),
       ('Jordan', 'Belfort', 4, NULL),
       ('Clarence', 'Darrow', 5, NULL),
       ('Linus', 'Torvalds', 6, NULL);
