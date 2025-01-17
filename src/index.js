import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Apply rate limiting to all requests
// ye ek linit set krega so that ek user uss limit jitni requests hi kr skta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: 'You have made too many requests, please try again later.'
  });

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Api to track time for freelancers and generate project summaries!!'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/api/v1`, // idhar base url aayega
                description: 'Local development server'
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(limiter);
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// all routes
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'
import logRoutes from './routes/log.routes.js'
import summaryRoutes from './routes/summary.routes.js'
import taskRoutes from './routes/task.routes.js'

// // routes udage
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/summary", summaryRoutes);
app.use("/api/v1/task", taskRoutes);

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);   
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed", err)
    });


