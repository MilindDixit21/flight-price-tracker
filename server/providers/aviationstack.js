import axios from 'axios';
import { response } from 'express';

const BASE = 'https://api.aviationstack.com/v1/flights' ;

export default {
    providerName: 'aviationstack',

    /**
   * Search flights using AviationStack API.
   * @param {Object} params
   * @param {string} params.origin – IATA code for departure e.g., 'JFK'
   * @param {string} params.destination – IATA code for arrival e.g., 'LAX'
   * @param {string} [params.date] – flight_date in YYYY-MM-DD (historical) or leave out for live
   * @param {number} [params.limit] – number of results to return (max depends on plan)
   * @returns {Promise<Array<Object>>} – normalized flights array
   */

    async search({origin,destination, date, limit =10}){
        const accessKey  = process.env.FLIGHT_API_KEY;
        if(!accessKey ) throw new Error('Missing FLIGHT_API_KEY environment variable');

        const queryParams ={
            access_key:key,
            dep_iata:origin,
            arr_iata:destination,            
            limit:limit
        };

        if(date){
            queryParams.flight_date = date;
        }
    
        if(!response.data || !Array.isArray(response.data.data)){
            throw new Error(`Invalid response from AviaationStack: ${JSON.stringify(response.data)}`);
        }

        // normalize to internal format

        const normalized = response.data.data.map(item =>{
            return{
                provider:this.providerName,
                flightNumber:item.flight?.iataNumber || item.flight?.number || null,
                airline:item.airline?.name || item.airline?.iata || null,
                origin:item.departure?.iata || origin,
                destination:item.arrival?.iata || destination,
                departureTime:item.departure?.scheduled ? new Date(item.departure.scheduled).toISOString() : null,
                arrivalTime:item.arrival?.scheduled ? new Date(item.arrival.scheduled).toISOString : null,
                price:item.price ?? null,
                currency:item.currency || 'USD',
                fetchedAt:new Date().toISOString(),
            };
        });
        
        return normalized;
    }
}
