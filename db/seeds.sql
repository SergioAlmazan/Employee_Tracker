USE employee_trackerDB;
INSERT INTO department (name)
VALUES 
    ("Management"),
    ("Legal"),
    ("Sales"),
    ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("manager", 300000,1 ),
    ("Lawyer", 250000,2),
    ("Sales Lead", 150000,3),
    ("Software Engineer", 300000,4),
    ("Sales Rep", 80000,3);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Mike", "Turner",1,NULL),
    ("Sergio", "Miller",5,1),
    ("Fil", "Upper",2,NULL),
    ("Sam", "Foster",4,1)