import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import * as mongoose from './lib/mongoose';
// import * as redis from './lib/redis';
import { httpLogger } from './lib/logger';
// import ssr from './lib/ssr';
import routers from './routers';
import config from './config';
import { init } from './services/init.service';

const app = express();
const MongoStore = require('connect-mongo')(session);

// MongoDB Connection
mongoose.connect();

// Redis Connection
// redis.connect();

// system init
init();

// Express MongoDB session storage
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new MongoStore({
        url: config.mongoURL
    }),
    cookie: config.sessionCookie,
    name: config.sessionName,
}));

// mount passport middleware
// passportRegister(app);

app.use(httpLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true,
    })
);

/*
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://piecent.com:8000");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", '3.2.1');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
*/

app.use(`/api/${config.apiVersion}`, routers);

// app.use(/^\/(?!static).*/, ssr);

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handler
// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.locals.url = req.originalUrl;

//     res.status(err.status || 500).end();
// });

module.exports = app;
