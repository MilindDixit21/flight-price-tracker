// server/routes/flights.js
import express from 'express';
import { query } from 'express-validator';
import { testConnection, searchFlights } from '../controllers/flightsController.js';
import { validateRequest } from '../middleware/validateRequest.js';


const router = express.Router();

router.get('/test', testConnection);

// simple search endpoint example
router.get(
  '/search',
  [
    query('origin').isString().notEmpty(),
    query('destination').isString().notEmpty(),
    // optional: date param
  ],
  validateRequest,
  searchFlights
);

export default router;
