const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

// ROUTES FOR OUR API
const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    const time = moment().format('D MMM YYYY @ HH:mm:ss');

    console.log(`> ${time} - ${req.method} on "${req.originalUrl}"`);

    next(); // make sure we go to the next routes and don't stop here
});

router.get('/test_get_resource', function (req, res) {
    res.json({message: 'Response of the GET'});
});

router.post('/test_post_resource', function (req, res) {
    console.log(`Received with POST: ${JSON.stringify(req.body)}`);

    console.log(`Name: ${req.body._name}`);

    res.json({message: 'Response of the POST'});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Server running on port ' + port);
