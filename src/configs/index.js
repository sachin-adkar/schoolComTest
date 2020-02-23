module.exports = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/schoolcom',
    mongoPort: process.env.MONGO_PORT
};
