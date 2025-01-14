## Yoga app

This project contains an Angular Frontend (Angular 14) and a SpringBoot Backend (Java 1.8, SpringBoot 2.6.1)
You will need Java 11 (or later), NodeJS 16, MySQL and Angular CLI 14 on your machine.

# How to install

Git clone :

> git clone https://github.com/Shikizzz/FullStack-P5-Testing.git

1) FRONT

Then to run the front, go to {path to the root}/front and run :

> npm install
> npm run start

2) BACK

Database installation :
If you don't have MySQL in your machine, here is the installation doc : https://dev.mysql.com/doc/refman/8.4/en/installing.html
Database connection :
Open a terminal, and use this command :

> mysql -u {yourUsername} -p
Then you have to enter your password, and should be successfully connected tu MySQL DB.
> CREATE DATABASE test;
> USE test;
> SOURCE /path/to/project/resources/sql/file.sql

Now, Database is successfully imported.
In the backend's application.properties, you have to add the property spring.datasource.password={yourPassword} (or add this variable in your environment variables)
You may have to change spring.datasource.username property to fit your MySQL username.

Then to run the back, go to {path to the root}/back and run :
> mvn clean install
> mvn spring-boot:run

# Using the app

Run both Front and Back, and in your Browser, go to http://localhost:4200/

You can login as admin with these credentials :
> login: yoga@studio.com, 
> password: test!1234 ;

You can also register to create a User account.

# Running tests and generating coverage reports


