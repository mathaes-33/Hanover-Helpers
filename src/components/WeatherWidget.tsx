
import React, { useState, useEffect, useCallback } from 'react';
import { SunIcon, SpinnerIcon, LocationPinIcon } from './Icons';

interface WeatherData {
    temperature: number;
    weathercode: number;
}

// Basic mapping from WMO weather codes to descriptions
const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
    };
    return descriptions[code] || 'Unknown';
};


const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    const HANOVER_COORDS = { lat: 44.15, lon: -81.03 };

    const getWeather = useCallback(async (lat: number, lon: number, name?: string) => {
        setStatus('loading');
        
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        
        let finalLocationName = name;

        try {
            // If no name is provided, fetch it.
            if (!finalLocationName) {
                const geoResponse = await fetch(geoUrl);
                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    finalLocationName = geoData.city || 'Your Location';
                } else {
                    finalLocationName = 'Your Location'; // Fallback
                }
            }
            setLocationName(finalLocationName);

            // Now fetch the weather.
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data.');
            }
            const weatherData = await weatherResponse.json();
            if (weatherData.current_weather) {
                setWeather({
                    temperature: Math.round(weatherData.current_weather.temperature),
                    weathercode: weatherData.current_weather.weathercode,
                });
                setStatus('success');
                setError(null);
            } else {
                throw new Error('Invalid weather data format from API.');
            }

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            console.error("Weather fetch error:", err);
            setError(message);
            setStatus('error');
            // Set the location name even on error so the user knows where we tried to get weather for.
            setLocationName(finalLocationName || 'Weather');
        }
    }, []);

    useEffect(() => {
        // This effect runs once on mount to determine which location to fetch weather for.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    getWeather(position.coords.latitude, position.coords.longitude);
                },
                // Error callback
                (err) => {
                    console.warn(`Geolocation error: ${err.message}. Falling back to default location.`);
                    getWeather(HANOVER_COORDS.lat, HANOVER_COORDS.lon, 'Hanover');
                }
            );
        } else {
            console.warn('Geolocation not supported by this browser. Falling back to default location.');
            getWeather(HANOVER_COORDS.lat, HANOVER_COORDS.lon, 'Hanover');
        }
    }, [getWeather]);


    const renderContent = () => {
        if (status === 'loading') {
            return (
                <>
                    <p className="font-semibold text-slate-700">Weather</p>
                    <div className="flex items-center space-x-2">
                        <SpinnerIcon className="w-6 h-6 text-slate-500" />
                        <span className="text-slate-500">Loading...</span>
                    </div>
                </>
            );
        }

        if (status === 'error' || !weather) {
            return (
                <>
                    <p className="font-semibold text-slate-700 flex items-center space-x-1">
                        <LocationPinIcon className="w-4 h-4" />
                        <span>{locationName || 'Weather'}</span>
                    </p>
                    <p className="text-2xl font-bold text-slate-800">--°C</p>
                    <p className="text-sm text-slate-500">{error || 'Data unavailable'}</p>
                </>
            );
        }

        return (
            <>
                <p className="font-semibold text-slate-700 flex items-center space-x-1">
                    <LocationPinIcon className="w-4 h-4" />
                    <span>{locationName}</span>
                </p>
                <p className="text-2xl font-bold text-slate-800">{weather.temperature}°C</p>
                <p className="text-sm text-slate-500">{getWeatherDescription(weather.weathercode)}</p>
            </>
        );
    };

    return (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg flex items-center space-x-4 shadow-sm border border-slate-200">
            <SunIcon className="w-10 h-10 text-slate-400" />
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default WeatherWidget;
