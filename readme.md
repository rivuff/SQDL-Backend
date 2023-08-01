# SQDL App Backend Report
### By Prakhar Gupta and Rivu Naskar

This repository contains the backend code for the SQDL App, which has been designed using the MERN stack. 

The backend is running express, on port 5000 of localhost. All of the source code is inside the ./src directory.

config/ contains the configuration code for establishing a connection to the cloud-based MongoDB atlas database. This database is on a developer's personal account and it is highly recommended that the database be migrated/copied to an enterpirse based account, or hosted locally on the server.


invite/ contains the code for the mailer service and related database actions. It handles all the CRUD requests related to inviting a new teacher, as well as sending an email using `node mailer` demon - through an account called sqdl.iitb@outlook.com, with password sqdliitb23. It is recommendeed that the mailer be reconfigured to work with some sort of enterprise/institutional email service. The email uses a JWT-encrypted link to securely implement email verification (post admin-invite) for teacher accounts.

The rest of the databse uses a MVC model - 

controller/ contains the Control features that interfaces with repository based functions to perform actions upon the database. the individual files under controller refer to the model they perform functions on, and each file has a number of exports that act as API endpoints for the backend. These endpoints can be accessed at URLs under routes/, which is talked about later. The controller endpoints have some degree of exception handling but load testing is needed.


model/ contain the schemas used to define the collections in the MongoDB database. These have been defined using mongoose - and in cases where custom ID generation is needed, the features have been abstracted into the design of the model and no outside work is needed

repository/ contains the repository functions for the models. The functions in this layer act as intermediary between the controller and collection - facilitating actions such as specialized querying and saving. It is recommended that the repository model MVC framework is continued as it allows good abstracion and error-detection.

routes/ contains the routes for API endpoints. routes/v1/index.js contains the endpoints for the current version of the application. Express router has been used for their configuration. routes/index.js is the source routing file, that is to be used during deployment and will have to be configured. This file also connects to the socket-related handelrs in socket.js, which essentially acts as a broadcast node between one client and all other connected clients. As of right now, for any event in a network of n clients, there is a broadcast emitted to alln-1 clients, regardless of session. Relevance and handling is performed in the frontend, which leads to large resource utilizaition when the number of clients is many. Additionally, client disconnection robustness is required - and as such, many improvements can be made to the socket handler. Particularly, using room management should be most effective in reducing server load. Another thing to keep in mind is that since requests are made post socket broadcast, the server is likely to encounter requests in burst, and as such, some sort of request buffering/throttling in a deployment instance would be highly useful.


As mentioned in the readme for the frontend, the application can offer a lot features - but robustness for deployment is lacking. Additionally, use of timeseries in addition to time stamps in the databse may be more useful for analysis/research purposes. 