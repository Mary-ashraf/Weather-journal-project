// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// implementation of get request on the server side
app.get('/getData', (req, res)=> {
    //sends the projectData defined above
    res.send(projectData);
});

//implementation of post request on the server side
app.post('/addData', (req, res) => {
    //updating projectData object using values with data sent from client side
    projectData.temperature = req.body.temperature;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.feelings;
    //sending back projectData object after being updated with new valuess
    res.send(projectData);
});