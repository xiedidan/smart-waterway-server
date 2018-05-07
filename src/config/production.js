module.exports = {
    port: process.env.SW_PORT,
    mongoURL: process.env.SW_MONGO_URL,
    redis: {
        host: process.env.SW_REDIS_HOST,
        port: process.env.SW_REDIS_PORT
    },
    sessionSecret: process.env.SW_SESSION_SECRET,
    // The name of the MongoDB collection to store sessions in
    sessionCollection: process.env.SW_SESSION_COL,
    // The session cookie name
    sessionName: process.env.SW_SESSION_NAME,
    drive: process.env.SW_DRIVE === 'true',
};
