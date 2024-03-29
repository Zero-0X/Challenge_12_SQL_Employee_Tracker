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
VALUES ('Dave', 'Cutler', 1, 1),
       ('Seth', 'Godin', 2, 2),
       ('Ebenezer', 'Scrooge', 3, 3),
       ('Jordan', 'Belfort', 4, 4),
       ('Clarence', 'Darrow', 5, 5),
       ('Linus', 'Torvalds', 6, 6);
