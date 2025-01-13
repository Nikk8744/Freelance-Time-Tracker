import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';
// import { createServer } from 'http';

const app = express();
// const server = createServer(app);

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// all routes
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'
// import logRoutes from './routes/timeLogs.routes.js'
// import summaryRoutes from './routes/summary.routes.js'

// // routes udage
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectRoutes);
// app.use("/api/v1/logs", logRoutes);
// app.use("/api/v1/summary", summaryRoutes);

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5001, () => {
            console.log(`Server is running on port ${process.env.PORT}`);   
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed", err)
    })

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);   
// })

