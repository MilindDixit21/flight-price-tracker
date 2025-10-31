import mongoose from "mongoose";

const PricePointSchema = new mongoose.Schema({
    price:Number,
    fetchedAt:Date,
},{timestamps:true});

const PriceHistorySchema = new mongoose.Schema({
    origin:{type:String, required :true},
    destination:{type:String, required:true},
    date: {type:String} , // flight date (ISO or yyyy-mm-dd)
    history:{type:[PricePointSchema], default:[]}
}, {timestamps:true});

export default mongoose.model('PriceHistory', PriceHistorySchema);