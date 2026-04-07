// src/components/maps/NearbyMap.jsx — Google Maps with nearby health store markers
import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import LocationButton from './LocationButton';
import api from '../../services/api';

const MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#1E1E1E' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#A0A0A0' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#121212' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2A2A2A' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0D1B2A' }] },
];

const FILTER_TYPES = [
    { value: 'health_food', label: '🥗 Health Food' },
    { value: 'farmers_market', label: '🌽 Farmers Market' },
    { value: 'organic_grocery', label: '🌿 Organic Grocery' },
];

export default function NearbyMap() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    });

    const [userLocation, setUserLocation] = useState(null);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [locating, setLocating] = useState(false);
    const [filterType, setFilterType] = useState('health_food');
    const [error, setError] = useState('');
    const [isMock, setIsMock] = useState(false);

    const handleLocate = useCallback(async () => {
        setLocating(true);
        setError('');
        setPlaces([]);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                setUserLocation({ lat, lng });
                try {
                    const { data } = await api.get('/api/places/nearby', {
                        params: { lat, lng, type: filterType },
                    });
                    setPlaces(data.places || []);
                    setIsMock(!!data.isMock);
                } catch {
                    setError('Could not fetch nearby stores. Please try again.');
                } finally {
                    setLocating(false);
                }
            },
            (err) => {
                setError('Location access denied. Please enable location in your browser settings.');
                setLocating(false);
            },
        );
    }, [filterType]);

    if (!isLoaded) {
        return (
            <div className="h-64 flex items-center justify-center text-text-secondary text-sm">
                Loading Google Maps…
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
                <LocationButton onLocate={handleLocate} loading={locating} />
                <div className="flex gap-2">
                    {FILTER_TYPES.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilterType(f.value)}
                            className={`text-xs px-3 py-2 rounded-lg border transition ${filterType === f.value
                                    ? 'border-primary bg-primary/20 text-primary'
                                    : 'border-white/10 bg-surface-2 text-text-secondary hover:border-primary/30'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-danger text-sm" role="alert">{error}</p>}

            {isMock && (
                <p className="text-xs text-warning" role="note">
                    ⚠️ Showing demo data — add a Google Maps API key to see real results.
                </p>
            )}

            {/* Map */}
            {userLocation ? (
                <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: 400 }}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={userLocation}
                        zoom={14}
                        options={{ styles: MAP_STYLE, disableDefaultUI: true, zoomControl: true }}
                        aria-label="Map showing nearby health food stores"
                    >
                        {/* User location marker */}
                        <MarkerF
                            position={userLocation}
                            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                            title="Your location"
                        />

                        {/* Place markers */}
                        {places.map((place) => (
                            <MarkerF
                                key={place.placeId}
                                position={{ lat: place.lat, lng: place.lng }}
                                onClick={() => setSelectedPlace(place)}
                                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                                title={place.name}
                            />
                        ))}

                        {/* Info window */}
                        <AnimatePresence>
                            {selectedPlace && (
                                <InfoWindowF
                                    position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                                    onCloseClick={() => setSelectedPlace(null)}
                                >
                                    <div style={{ background: '#1E1E1E', padding: '12px', minWidth: '200px', color: '#F5F5F5', fontFamily: 'Poppins, sans-serif', borderRadius: '8px' }}>
                                        <h4 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>{selectedPlace.name}</h4>
                                        <p style={{ fontSize: '12px', color: '#A0A0A0', marginBottom: '8px' }}>{selectedPlace.address}</p>
                                        {selectedPlace.rating && (
                                            <p style={{ fontSize: '12px', marginBottom: '8px' }}>⭐ {selectedPlace.rating}</p>
                                        )}
                                        <a
                                            href={selectedPlace.directionsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#6C63FF', fontSize: '12px', textDecoration: 'underline' }}
                                        >
                                            🗺️ Get Directions
                                        </a>
                                    </div>
                                </InfoWindowF>
                            )}
                        </AnimatePresence>
                    </GoogleMap>
                </div>
            ) : (
                <div className="h-48 flex flex-col items-center justify-center text-text-secondary gap-2 bg-surface-2 rounded-2xl border border-white/10">
                    <span className="text-4xl">🗺️</span>
                    <p className="text-sm">Click "Find Stores Near Me" to discover healthy food options around you.</p>
                </div>
            )}

            {/* Place list */}
            {places.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    {places.map((place) => (
                        <motion.div
                            key={place.placeId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3 }}
                            onClick={() => setSelectedPlace(place)}
                            className="bg-surface-2 rounded-xl p-4 border border-white/5 hover:border-primary/30 cursor-pointer transition"
                        >
                            <p className="font-medium text-sm text-text-primary truncate">{place.name}</p>
                            <p className="text-xs text-text-secondary mt-1 truncate">{place.address}</p>
                            {place.rating && (
                                <p className="text-xs text-gold mt-1">⭐ {place.rating}</p>
                            )}
                            <a
                                href={place.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-2 inline-block"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Get directions to ${place.name}`}
                            >
                                Get Directions →
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
