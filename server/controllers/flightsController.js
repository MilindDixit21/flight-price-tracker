import Flight from "../models/Flight.js";
import PriceHistory from "../models/PriceHistory.js";
import aviationstack from "../providers/aviationstack.js";

/**
 * @desc Test server + DB connection
 * @route GET /api/flights/test
 */

export const testConnection = async(req,res) => {
    return res.json({ok:true, message:'Server +DB ready'});
}

/**
 * @desc Search flights via AviationStack provider (real data)
 * @route GET /api/flights/search?origin=JFK&destination=LAX&date=2025-11-01
 */

export const searchFlights = async (req, res, next)=>{
    try {        
        const {origin, destination, date, limit } = req.query;

      if(!origin || !destination){
        return res.status(400).json({
            of:false,
            message:"Missing required query params: origin and destination",
        });
      }

      // fetch flights from provider (AviationStack)
        const flights = await aviationstack.search({
            origin,
            destination,
            date,
            limit: limit ? Number(limit):10,
        });

         // stored fetched data in MongoDB (for analytics/history)
        const savedFlights = await Flight.insertMany(flights, {ordered:false});

        console.log(`✅ Flight saved in DB with ID: ${saved._id}`);

        // Update  price history for today
        if(savedFlights.length > 0){
            const latestPrice = savedFlights[0].price || null;
        }
        await PriceHistory.findOneAndUpdate(
            { 
                origin, 
                destination, 
                date : new Date().toISOString().slice(0,10)
            },
            {
                $push:{history:{price:latestPrice, fetchedAt:new Date()}}
            },
            {
                upsert:true, new:true
            }
        );

        console.log(`📊 Price history updated for ${origin}-${destination}`);

        res.json({
            ok:true, 
            count: flights.length,
            provider: aviationstack.providerName,
            data:flights,

        });

    } catch (error) {
        console.error("Flight search failed:", error.message);
        next(error);
    }
};