const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.states = require('./states')(mongoose);
db.districts = require('./districts')(mongoose);
db.resources = require('./resources')(mongoose);
db.provider_resource_map = require('./provider_resource_map')(mongoose)
db.providers = require('./provider')(mongoose);
module.exports = db;
