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
const seed_2 = process.env.SEED_2;

iota.getAccountData(seed_2, {
    start: 0,
    security: 2
}).then(accountData => {
    const {addresses, inputs, transactions, balance} = accountData;

    console.log('Balance: ' + balance);
    // ...
}).catch(err => {
    // ...
});
