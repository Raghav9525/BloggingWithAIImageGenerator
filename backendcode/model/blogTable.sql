

CREATE TABLE blog (
    blog_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300),
    description VARCHAR(1000),
    category varchar(50),
    date date
);


CREATE TABLE singnup (
    name varchar(30),
    mobile varchar(13) PRIMARY KEY,

    password varchar(20)
);


-- insert into blog (title,description,category,image_url,date) values (
--     " Cricket Rules That ICC Needs to Dump Right Away",
--     "No one could have scripted this World Cup 2019 finish better. Other than the cricket governing body itself, the International Cricket Council (ICC). While we will talk about this thrilling World Cup 2019 final living up to its reputation for years to come",
--     "cricket",
--     "http://localhost:5000/images/downloaded_image_2024-04-20T19-05-57.009Z.png",
--     "2024-04-21"
--     )

