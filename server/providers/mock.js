export default{
    providerName:'mock',
    async search(params){
        // params: {origin, destination, date,limit}
        // Return normalized array of flights
        const {origin, destination} = params;
        const now = Date.now();
        const sample ={
            flightNumber: `MOCK${Math.floor(Math.random()*10000)}`,
            airline: 'MockAir',
            origin,
            destination,
            departureTime: new Date(now + 3600 * 1000).toISOString(),
            arrivalTime: new Date(now + 3 * 3600 * 1000).toISOString(),
            price: Math.round(100 + Math.random() * 400),
            currency: 'USD',
            provider: 'mock',
        };
        return [sample];
    }
};