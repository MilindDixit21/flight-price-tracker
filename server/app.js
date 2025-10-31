import express from "express";
import morgan  from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js"; //ESM import
import  flightsRouter from "./routes/flights.js";
import { errorHandler } from "./middleware/error.js";

// load any variable
dotenv.config();

// initialize app
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//connect DB
const dbUri = process.env.MONGODB_URI;
if(!dbUri){
    console.error('MONGODB_URI not set in env');
    process.exit(1);
}
await connectDB(dbUri);


// route
app.use('/api/flights', flightsRouter);


// global error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));