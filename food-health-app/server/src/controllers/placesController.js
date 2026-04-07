// src/controllers/placesController.js — Google Places nearby search
const axios = require('axios');
const Joi = require('joi');
const config = require('../config');

const nearbySchema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    type: Joi.string().valid('health_food', 'farmers_market', 'organic_grocery').default('health_food'),
});

const KEYWORD_MAP = {
    health_food: 'health food store',
    farmers_market: 'farmers market',
    organic_grocery: 'organic grocery',
};

/**
 * GET /api/places/nearby?lat=&lng=&type=
 * Proxies Google Places API nearby search through backend (keeps API key server-side).
 */
async function getNearbyHealthStores(req, res, next) {
    try {
        const { error, value } = nearbySchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: { message: 'lat and lng query params are required', code: 'VALIDATION_ERROR' },
            });
        }

        const keyword = KEYWORD_MAP[value.type] || 'health food store';

        if (!config.googleMaps.apiKey) {
            // Return mock data when API key is absent
            return res.status(200).json({
                places: [
                    {
                        placeId: 'mock_1',
                        name: 'Green Earth Organic Store',
                        address: '123 Wellness Ave, Health City',
                        lat: value.lat + 0.002,
                        lng: value.lng + 0.003,
                        rating: 4.5,
                        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${value.lat + 0.002},${value.lng + 0.003}`,
                    },
                    {
                        placeId: 'mock_2',
                        name: 'Farmers Fresh Market',
                        address: '45 Nature Lane, Organic Town',
                        lat: value.lat - 0.001,
                        lng: value.lng + 0.005,
                        rating: 4.8,
                        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${value.lat - 0.001},${value.lng + 0.005}`,
                    },
                    {
                        placeId: 'mock_3',
                        name: 'Wholesome Foods Co.',
                        address: '78 Harvest Road, Vitality Park',
                        lat: value.lat + 0.005,
                        lng: value.lng - 0.002,
                        rating: 4.3,
                        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${value.lat + 0.005},${value.lng - 0.002}`,
                    },
                ],
                isMock: true,
            });
        }

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            {
                params: {
                    location: `${value.lat},${value.lng}`,
                    radius: 5000,
                    keyword,
                    key: config.googleMaps.apiKey,
                },
                timeout: 8000,
            },
        );

        const results = (response.data.results || []).slice(0, 10).map((place) => ({
            placeId: place.place_id,
            name: place.name,
            address: place.vicinity,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            rating: place.rating || null,
            directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}&destination_place_id=${place.place_id}`,
        }));

        return res.status(200).json({ places: results });
    } catch (err) {
        return next(err);
    }
}

module.exports = { getNearbyHealthStores };
