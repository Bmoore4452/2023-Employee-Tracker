INSERT INTO department (name)
VALUES ("IT"),
       ("Physical Wellness");

INSERT INTO role (title,salary,department_id)
VALUES ("Junior Developer",100000.00,001),
       ("Personal Trainer",100000.00,002);

INSERT INTO employee (first_name,last_name,role_id)
VALUES ("Brian","Moore",001),
       ("LaToya","Moore",002);

UPDATE employee
SET manager_id = "001"
WHERE id = 1;

UPDATE employee
SET manager_id = "002"
WHERE id = 2;