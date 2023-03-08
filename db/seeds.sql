INSERT INTO department (name)
VALUES ("IT"),
       ("Physical Wellness");

INSERT INTO role (title,salary,department_id)
VALUES ("Junior Developer",100000,1),
       ("Personal Trainer",100000,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Brian","Moore",1,NULL),
       ("LaToya","Moore",2,1);
