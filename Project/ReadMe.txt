
Author: Yasmeen Joumaa

Description: This is a shopping app I have been working on which includes the
requirements from the Summer 2019 Developer Intern Challenge Question. I unfortunately saw the
job posting too close to the deadline so I hope that this will do.

The routes/checkout.js, 
models/cart.js and models/product.js are the main files to look at for the challenge requirements.
I hope that I may get a chance to display my skills with another challenge.
Thank you!



Warnings:
Also, ensure that your mongo database is empty first and there is not already a mongo database running.

To run this app :
you need a personal Paypal Account
You can create on at paypal.com
When you create the account you DON'T need to link a credit card or bank account at creation time.
I just ignored that step when prompted and it created the account anyway. I received confirmation by email.



1) Setup project
First get mongod running. That is, start up the mongodb database listening
on its default port of 27017.
Next Install the npm module dependencies in package.json by executing:

npm install


then, run the populate-for-startup.js file inside the seed directory to populate the mongodb database.
You can run the file with below command (after locating in the terminal)

node populate-for-startup.js

2) Run the application
In the application folder execute:
npm start
then you can access from localhost at
134.117.31.217:3000

3) Login to the app using the dummy user for project:
username : admin@admin.com
password : admin

4) Important
Before starting application please make sure your mongo database runs.
