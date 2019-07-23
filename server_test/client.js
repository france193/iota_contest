const axios = require('axios');
const qs = require('qs');

const SampleData = require('../SampleData');

const server = 'http://localhost';
const port = '8080';
const api_path = '/api/';

const getResourceUrl = `${server}:${port}${api_path}test_get_resource`;
const postResourceUrl = `${server}:${port}${api_path}test_post_resource`;

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

main()
    .catch(async function (error) {
        console.log("Error " + error);
    });

async function main() {
    await performGet();
    await performPost();
}

async function performGet() {
    axios.get(getResourceUrl, config)
        .then(async function (response) {
            console.log(`GET Response: ${response.status} - ${response.statusText} - ${JSON.stringify(response.data)}`);
        })
        .catch(async function (error) {
            // handle error
            console.log(`> GET ERROR: "${error}"`);
        });
}

async function performPost() {
    const data = new SampleData("Name 1", "Message 1");

    axios.post(postResourceUrl, qs.stringify(data), config)
        .then(function (response) {
            console.log(`POST Response: ${response.status} - ${response.statusText} - ${JSON.stringify(response.data)}`);
        })
        .catch(function (error) {
            // handle error
            console.log(`> POST ERROR: "${error}"`);
        });
}