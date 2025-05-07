import imageRouter from './uploadImage.js';
import diseaseRouter from './disease.js';
import authRouter from './auth.js';
import historyRouter from './history.js';
import userRouter from './user.js';
import historyRoutes from './history.js';

const mountRoute = (app) => {
    app.use('/api/vi/process-image', imageRouter);
    app.use('/api/vi/disease', diseaseRouter);
    app.use('/api/vi/auth', authRouter);
    app.use('/api/vi/history', historyRouter);
    app.use('/api/vi/user', userRouter);

};

export default mountRoute;

