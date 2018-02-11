import express from 'express';

import userRouter from './users';
import projectRouter from './projects';
import entityRouter from './entities';

const routers = express.Router();

routers.use(userRouter);
routers.use(projectRouter);
routers.use(entityRouter);

// testing route
routers.route('/greeting').get((req, res) => {
    res.status(200).send({
        message: 'Hello, I\'m smart waterway.'
    });
});

export default routers;
