module.exports = {
    port: process.env.SW_PORT_DEV || 9527,
    mongoURL: process.env.SW_MONGO_URL_DEV || 'mongodb://127.0.0.1:27017',
    redis: {
        host: process.env.SW_REDIS_HOST_DEV || '127.0.0.1',
        port: process.env.SW_REDIS_PORT_DEV || '6379'
    },
    sessionSecret: process.env.SW_SESSION_SECRET_DEV,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.SW_SESSION_COL_DEV,
    // The session cookie name
    sessionName: process.env.SW_SESSION_NAME_DEV,
};
