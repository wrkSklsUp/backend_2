
const path = require('path');
const nodeEnv = process.env.NODE_ENV;
const dev = nodeEnv !== 'production';
require('dotenv').config({ path: path.join(__dirname, dev ? '../.development.env' : '../.production.env') });

const {Client} = require("memjs");
module.exports = Client.create(process.env.MEMCACHED_URL);
