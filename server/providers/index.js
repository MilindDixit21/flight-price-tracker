import mockProvider from './mock.js';
import aviationStackProvider from './aviationstack.js';

const providers ={
    mock:mockProvider,
    aviationStack:aviationStackProvider,
}

export function getProviders(name = process.env.FLIGHT_API_PROVIDER || 'mock'){
    return providers[name] || providers['mock'];
}