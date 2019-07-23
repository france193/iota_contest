'use strict';
const dotenv = require('dotenv');
const IOTA = require('@iota/core');
const axios = require('axios');
const qs = require('qs');

// check env settings
const result = dotenv.config();

if (result.error) {
    throw result.error
}

const iota = IOTA.composeAPI({
    provider: process.env.IOTA_FULL_NODE // replace with your IRI node.
});

const PaymentReceipt = require('../PaymentReceipt');

const server = 'http://localhost';
const port = '8080';
const api_path = '/api/';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

const seed_1 = process.env.SEED_1;

main()
    .catch(async function (error) {
        console.log("Error " + error);
    });

async function main() {
    //const address = await getANewAddressFromSeed(seed_2);
    //console.log(`Indirizzo: ${address}`);

    const address = await requestAddress_GET();
    console.log(`Indirizzo: ${address}`);

    const amount = 10;

    const hash = await sendIOTA(seed_1, amount, address);
    console.log(`HAsh della transazione: ${hash}`);

    await sendPaymentReceipt_POST(hash, address, amount);
}

async function requestAddress_GET() {
    return await axios.get(`${server}:${port}${api_path}get_new_address`, config)
        .then(async function (response) {
            console.log(`GET Response: ${response.status} - ${response.statusText} - ${JSON.stringify(response.data)}`);
            return response.data.address;
        })
        .catch(async function (error) {
            // handle error
            console.log(`> GET ERROR: "${error}"`);
        });
}

async function sendPaymentReceipt_POST(hash, address, amount) {
    const paymentReceipt = new PaymentReceipt(hash, address, amount);

    axios.post(`${server}:${port}${api_path}send_payment_receipt`, qs.stringify(paymentReceipt), config)
        .then(function (response) {
            console.log(`POST Response: ${response.status} - ${response.statusText} - ${JSON.stringify(response.data)}`);
        })
        .catch(function (error) {
            // handle error
            console.log(`> POST ERROR: "${error}"`);
        });
}

async function sendIOTA(seed, amount, address) {
    // Array of transfers which defines transfer recipients and value transferred in IOTAs.
    const transfers = [{
        address: address,
        value: amount,
        tag: '', // optional tag of `0-27` trytes
        message: '' // optional message in trytes
    }];

    // Depth or how far to go for tip selection entry point.
    const depth = 3;

    // Difficulty of Proof-of-Work required to attach transaction to tangle.
    const minWeightMagnitude = 14;

    // Prepare a bundle and signs it.
    return await iota.prepareTransfers(seed, transfers)
        .then(trytes => {
            // Persist trytes locally before sending to network.
            // This allows for reattachments and prevents key reuse if trytes can't
            // be recovered by querying the network after broadcasting.

            // Does tip selection, attaches to tangle by doing PoW and broadcasts.
            return iota.sendTrytes(trytes, depth, minWeightMagnitude)
        })
        .then(bundle => {
            console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
            return bundle[0].hash;
        })
        .catch(err => {
            console.log(`ERROR Send Transfer: ${err}`)
        });
}
