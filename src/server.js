const express = require('express');
const app = express();
const mongoose = require('mongoose');
const configs = require('./configs');
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

mongoose.connect(configs.mongoUrl, mongoOptions, (error, data) => {
    if (error) {
        console.error('Error', error);
        console.error('Unable to establish database connection, exiting....');
        process.exit();
    }
    app.listen(3000, () => {
        console.log('Server is listening on 3000');
    });
});
app.use(bodyParser.json({ type: ['json', 'application/csp-report'] }));
app.use(bodyParser.urlencoded({ limit: '6mb', extended: true }));
app.use(bodyParser.json({ limit: '6mb' }));
app.use(bodyParser.json());
app.use(auth);
require('./routes')(app);

module.exports = app;
