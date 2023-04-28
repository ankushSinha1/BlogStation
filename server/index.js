import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';

import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes/userRoutes.js';
import postRoutes from './routes/postRoutes/postRoutes.js';
import homeRoute from './routes/Homeroute/homeRoute.js';
import authRoutes from './routes/authRoutes/authRoutes.js';
import bodyParser from 'body-parser';
const app = express();

//this is important to do or else req.body will always be undefined for us and no data will be posted in the database
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*Mongoose setup*/
//stores the data in local machine for now
dotenv.config();
mongoose.connect(process.env.MONGO);
app.use(cors({origin: true, credentials: true}));
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/home', homeRoute);
app.use('/', authRoutes);
app.listen(3001, () => {console.log(`Cloud server started...`)});