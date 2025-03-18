import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscriptions.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

// middleware for parsing JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())  // Note the function call
app.use(arcjetMiddleware);
// app.use(cookieParser)

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Service!');
})

app.listen(PORT, async () => {
    console.log(`Subscription Service is running on http://localhost:${PORT}`);

    await connectDB();
})

export default app;