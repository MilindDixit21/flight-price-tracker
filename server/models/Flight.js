import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema({
    provider:{type:String},
    flightNumber:{type:String},
    airline:{type:String},
    origin:{type:String, required:true},
    destination:{type:String, required:true},
    departureTime:{type:Date},
    arrivalTime: {type:Date},
    currency:{type:String},
    price:{type:Number, required:true},
    fetchedAt: {type:Date, default:Date.now},
},{timestamps:true});

export default mongoose.model('Flight', FlightSchema);