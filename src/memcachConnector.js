
const path = require('path');
const nodeEnv = process.env.NODE_ENV;
const dev = nodeEnv !== 'production';
require('dotenv').config({ path: path.join(__dirname, dev ? '../.dev.env' : '../.production.env') });

const memUrl = process.env.MEMCACHED_URL || process.env.COMPOSE_MEMCACHED_URL
const {Client} = require("memjs");
module.exports = Client.create(memUrl);
