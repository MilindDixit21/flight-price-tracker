import express from "express";
import morgan  from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// load any variable
dotenv.config();

// initialize app
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// test route
app.get('/api/flights/test',(req,res) =>{
    res.json({ok:true, message:"Server running with ES6 Modules"});
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));