'use strict';
const dotenv = require('dotenv');
const IOTA = require('@iota/core');

const iota = IOTA.composeAPI({
    provider: 'https://nodes.thetangle.org:443'
});

// check env settings
const result = dotenv.config();

if (result.error) {
    throw result.error
}

const seed_1 = process.env.SEED_1;
const seed_2 = process.env.SEED_2;

main()
    .catch(async function (error) {
        console.log("Error " + error);
    });

async function main() {
    //await getSeedBalance(seed_1);
    //await getSeedBalance(seed_2);
    await checkTransactionStatus('YCZQHVKSQTPFWAMERZRMSRZOTRYURWWTMZWGQPTSCPAKIIQHLCNDBRLJFRCJBGPKHTHECQ9LAIUQA9999');
}

/*
iota.getNodeInfo()
    .then(info => console.log(info))
    .catch(error => {
        console.log(`Request error: ${error.message}`)
    });
*/

async function getSeedBalance(seed) {
    return await iota.getAccountData(seed, {
        start: 0,
        security: 2
    }).then(accountData => {
        const {addresses, inputs, transactions, balance} = accountData;

        console.log('Balance: ' + balance);
    }).catch(err => {
        console.log(`>  ERROR: "${err}"`);
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
