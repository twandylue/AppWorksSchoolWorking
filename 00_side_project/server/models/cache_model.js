require("dotenv").config();
const redis = require("redis");
const { REDISPORT } = process.env || 6379; // redis port setting
const client = redis.createClient(REDISPORT); // create redis client

function getCache (key) { // used in async function
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

module.exports = {
    client,
    getCache
};
