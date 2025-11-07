import "./config/env.js"; //Load env BEFORE anything else

import express from "express";
import morgan  from "morgan";
import cors from "cors";

// dotenv.config(); // .env must be in project root folder and where expected by Node 

import { connectDB } from "./db/connect.js"; //ESM import
import  flightsRouter from "./routes/flights.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/error.js";
// import { cacheMiddleware } from "./providers/cache.js";


// initialize app
const app = express();

// global middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Optional: attach cache middleware globally (for read-only GET requests)
// app.use(cacheMiddleware);

//connect to MongoDB
const dbUri = process.env.MONGODB_URI;
if(!dbUri){
    console.error('MONGODB_URI not set in env');
    process.exit(1);
}
await connectDB(dbUri);

// base route
app.get('/', (req, res) =>{
    res.send("Flight price tracker API is running...");
});

// Apply global API rate limit (recommended for all /api routes)
app.use("/api/", apiLimiter);

//register flights routes
app.use("/api/flights", flightsRouter);

// global error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));