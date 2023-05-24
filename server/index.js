import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes/userRoutes.js';
import postRoutes from './routes/postRoutes/postRoutes.js';
import homeRoute from './routes/Homeroute/homeRoute.js';
import authRoutes from './routes/authRoutes/authRoutes.js';
import bodyParser from 'body-parser';
const app = express();
app.use(express.json({limit: '25mb'}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });
//this is important to do or else req.body will always be undefined for us and no data will be posted in the database
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*Mongoose setup*/
//stores the data in local machine for now
dotenv.config();
mongoose.connect(process.env.MONGO);

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/home', homeRoute);
app.use('/', authRoutes);
app.get("/", (req, res) => {
  res.status(201).json({message: "Connected to Backend!"});
});
app.listen(process.env.PORT, () => {console.log(`Cloud server started...`)});