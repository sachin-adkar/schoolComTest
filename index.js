require('dotenv').config({
    path: `${__dirname + '/.env'}`
});
module.exports = require('./src/server');
