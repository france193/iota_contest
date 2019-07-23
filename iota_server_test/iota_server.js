'use strict';
const dotenv = require('dotenv');
const IOTA = require('@iota/core');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

// check env settings
const result = dotenv.config();

if (result.error) {
    throw result.error
}

const iota = IOTA.composeAPI({
    provider: process.env.IOTA_FULL_NODE // replace with your IRI node.
});

const seed_2 = process.env.SEED_2;

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

router.get('/get_new_address', async function (req, res) {
    const address = await getANewAddressFromSeed(seed_2);

    res.json({address: address});
});

router.post('/send_payment_receipt', async function (req, res) {
    console.log(`Received with POST: ${JSON.stringify(req.body)}`);

    const result = await checkTransactionStatus(req.body._tailhash);

    res.json({message: 'Response of the POST'});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Server running on port ' + port);

async function getANewAddressFromSeed(seed) {
    return await iota.getNewAddress(seed, {
        start: 0,
        security: 2,
        checksum: true
    });
}

async function getBundleofTransactionHash(tailhash) {
    return await iota.getBundle(tailhash)
        .then(bundle => {
            console.log(JSON.stringify(bundle));
        })
        .catch(err => {
            // handle errors
        });
}

async function checkTransactionStatus(tailhash) {
    console.log(`Checking: ` + tailhash);

    return await iota.getLatestInclusion([tailhash])
        .then(result => {
            console.log(JSON.stringify(result));
        })
        .catch(err => {
            // handle errors
        });
}
