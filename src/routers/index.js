import express from 'express';

import userRouter from './users';
import projectRouter from './projects';
import entityRouter from './entities';
import recordRouter from './records';

const routers = express.Router();

routers.use(userRouter);
routers.use(projectRouter);
routers.use(entityRouter);
routers.use(recordRouter);

// testing route
routers.route('/greeting').get((req, res) => {
    res.status(200).send({
        message: 'Hello, I\'m smart waterway.'
    });
});

export default routers;
