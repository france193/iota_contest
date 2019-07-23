'use strict';
const dotenv = require('dotenv');
const IOTA = require('@iota/core');

// check env settings
const result = dotenv.config();

if (result.error) {
    throw result.error
}

const iota = IOTA.composeAPI({
    provider: process.env.IOTA_FULL_NODE // replace with your IRI node.
});

// Must be truly random & 81-trytes long.
const seed_1 = process.env.SEED_1;
const seed_2 = process.env.SEED_2;

iota.getNewAddress(seed_2, {
    start: 0,
    security: 2,
    checksum: true
}).then(address => {
    console.log('Address: ' + address);

    // Array of transfers which defines transfer recipients and value transferred in IOTAs.
    const transfers = [{
        address: address,
        value: 10, // 1Ki
        tag: '', // optional tag of `0-27` trytes
        message: '' // optional message in trytes
    }];

// Depth or how far to go for tip selection entry point.
    const depth = 3;

// Difficulty of Proof-of-Work required to attach transaction to tangle.
    const minWeightMagnitude = 14;

// Prepare a bundle and signs it.
    iota.prepareTransfers(seed_1, transfers)
        .then(trytes => {
            // Persist trytes locally before sending to network.
            // This allows for reattachments and prevents key reuse if trytes can't
            // be recovered by querying the network after broadcasting.

            // Does tip selection, attaches to tangle by doing PoW and broadcasts.
            return iota.sendTrytes(trytes, depth, minWeightMagnitude)
        })
        .then(bundle => {
            console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
            console.log(`Bundle: ${bundle}`)
        })
        .catch(err => {
            // handle errors here
        });
}).catch(err => {
    // ...
});
