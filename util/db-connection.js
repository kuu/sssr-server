const config = require('config');
const mongo = require('mongodb').MongoClient;

const MONGODB_HOST = (config.db && config.db.host) || 'localhost';
const MONGODB_PORT = (config.db && config.db.port) || 27017;

module.exports = mongo.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/oodump`);
