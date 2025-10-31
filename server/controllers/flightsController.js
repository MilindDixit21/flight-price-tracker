import Flight from "../models/Flight.js";
import PriceHistory from "../models/PriceHistory.js";

// Simple test endpoint to confirm backend + DB
export const testConnection = async(req,res) => {
    return res.json({ok:true, message:'Server +DB ready'});
}

// Mocked flight search – will later call real 3rd-party APIs
export const searchFlights = async (req,res, next)=>{
    try {
        
        const {origin, destination} = req.query;

        console.log('[searchFlights] origin=', origin, 'dest=', destination);

        // For Day 2: return dummy/mocked data and optionally save to DB.
        // Later Sprint 2 will replace with real 3rd-party API calls.

        const sample ={
            flightNumber: 'MOCK123',
            airline: 'MockAir',
            origin,
            destination,
            departureTime: new Date(),
            arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            price: Math.round(100 + Math.random() * 400),
            currency: 'USD',
            provider: 'mock',
        }

         // save to DB (optional for demo)
        const saved = await Flight.create(sample);

        console.log(`✅ Flight saved in DB with ID: ${saved._id}`);

        // Update or create price history entry
        await PriceHistory.findOneAndUpdate(
            { origin, destination, date : new Date().toISOString().slice(0,10)},
            {$push:{history:{price:saved.price, fetchedAt:new Date()}}},
            {upsert:true, new:true}
        );

        console.log(`📊 Price history updated for ${origin}-${destination}`);

        res.json({ok:true, data:[saved]});

    } catch (error) {
        next(error);
    }
}