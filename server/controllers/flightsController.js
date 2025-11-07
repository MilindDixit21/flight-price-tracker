// server/controllers/flightsController.js
import Flight from "../models/Flight.js";
import PriceHistory from "../models/PriceHistory.js";
import aviationstack from "../providers/aviationstack.js";
import { getCache, setCache } from "../providers/cache.js";


const DATA_SOURCE = process.env.DATA_SOURCE || "mock";

/**
 * Test endpoint
 */
export const testConnection = async (req, res) => {
  return res.json({ ok: true, message: "Server + DB ready" });
};

// Smart, multi-source controller + caching
export const getFlights = async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;

     if (!origin || !destination) {
      return res.status(400).json({ ok: false, message: "source and destination are required" });
    }

    // Generate cache key based on query params
    const cacheKey = `flights:${origin}-${destination}-${date || "any"}`;

    // Check cache first
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      console.log("✅ Served from cache:", cacheKey);
      return res.json({ ok: true, source: "cache", data: cachedData });
    }

    console.log(`[INFO] Fetching flights using source: ${DATA_SOURCE}`);

    let results = [];

    if (DATA_SOURCE === "mock") {
      // --- MOCK DATA ---
      const sample = {
        flightNumber: "MOCK123",
        airline: "MockAir",
        origin,
        destination,
        departureTime: new Date(),
        arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        price: Math.round(100 + Math.random() * 400),
        currency: "USD",
        provider: "mock",
      };
      results = [sample];

      // Optional: save to DB for testing
      await Flight.create(sample);
    } 
    
    else if (DATA_SOURCE === "db") {
      // --- READ FROM MONGODB ---
      results = await Flight.find({ origin, destination }).limit(10);
    } 
    
    else if (DATA_SOURCE === "api") {
      // --- FETCH FROM AVIATIONSTACK API ---
      results = await aviationstack.search({ origin, destination, date });
    }

    // Log one entry for debug
    console.log(`[INFO] ${results.length} flight(s) fetched`);

    // Update price history (optional for API or DB modes)
    if (results.length > 0 && results[0].price) {
      await PriceHistory.findOneAndUpdate(
        { origin, destination, date: new Date().toISOString().slice(0, 10) },
        { $push: { history: { price: results[0].price, fetchedAt: new Date() } } },
        { upsert: true, new: true }
      );
    }

    res.json({ ok: true, source: DATA_SOURCE, data: results });
  } catch (error) {
    console.error("[ERROR] getFlights failed:", error.message);
    next(error);
  }
};
