import React, { useContext, useEffect, useRef, useState } from 'react';
import { DriversContext, LocationsContext, CurrentTimeContext, SelectedSessionContext, useDrivers, useCurrentTime, useSelectedDriver, useSettings } from '../../contexts/Contexts';
import { Map, Source, Layer } from 'react-map-gl';
import { GetCurrentLocation } from '../../utils/DriverDataProcessing';
import { getTrackCoordinates } from '../../config/trackCoordinates';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocationData } from '../../hooks/useLocationData';
import { use } from 'react';
import DriverMarkers from './DriverMarkers';



const RaceMap = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);

    const { drivers } = useDrivers();
    const driversRef = useRef(drivers);

    const {selectedDriver} = useSelectedDriver();
    const selectedDriverRef = useRef(selectedDriver);

    const { currentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    const {settings } = useSettings();

    // States
    const [currentDrivers, setCurrentDrivers] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);

    // Hooks
    // const locations = useLocationData(selectedSession?.session_key);
    // const locationsRef = useRef(locations);

    // const driverLayerSourceData = useDriverMapSource(driversRef.current);

    const mapRef = useRef();

    useEffect(() => {
        driversRef.current = drivers;
    }, [drivers]);

    useEffect(() => {
        selectedDriverRef.current = selectedDriver;
    }, [selectedDriver]);


    // Effect for map zooming
    useEffect(()=>{
        if (!selectedSession){
            return; 
        };
        const trackData = getTrackCoordinates(selectedSession.location);
        console.log(selectedSession.location);
        mapRef.current?.flyTo({
            center: [trackData.lon, trackData.lat],
            zoom: trackData.zoom,
            duration: 8000
        });
    },[selectedSession]);

    // Update track shape
    useEffect(()=>{
        if (!selectedSession){
            return; 
        }
        const loadTrackData = async () => {
            try {
                const trackData = getTrackCoordinates(selectedSession.location);
    
                // Fetch the GeoJSON file for the track
                const response = await fetch(`/circuits/${trackData.id}.geojson`);
                if (!response.ok) {
                    throw new Error(`Failed to load track data: ${response.status}`);
                }
    
                const geojson = await response.json();

    
                // Update state with parsed GeoJSON
                setCurrentTrack(geojson);
            } catch (error) {
                console.error("Error loading track GeoJSON:", error);
            }
        };
    
        loadTrackData();
    },[selectedSession])

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                longitude: 0,
                latitude: 0,
                zoom: 1,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={settings.theme === "dark" ? 
                "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" : 
                "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" }
            >
            

            {/* Track Layout */}
            {currentTrack && (
                <Source id="track" type="geojson" data={currentTrack}>
                    {/* Outline Layer */}
                    <Layer
                        id="track-outline"
                        type="line"
                        paint={{
                            'line-color': '#424757',
                            // 'line-color': '#f55442',
                            'line-width': [
                                'interpolate',
                                ['exponential', 2],
                                ['zoom'],
                                10, ["*", 32, ["^", 2, -6]], 
                                24, ["*", 32, ["^", 2, 8]]
                            ],
                            'line-opacity': 0.8
                        }}
                    />
                    {/* Main Line Layer */}
                    <Layer
                        id="track-main"
                        type="line"
                        paint={{
                            'line-color': '#f8fcff', // Main line color 
                            'line-width': [
                                'interpolate',
                                ['exponential', 2],
                                ['zoom'],
                                10, ["*", 16, ["^", 2, -6]], 
                                24, ["*", 16, ["^", 2, 8]]
                            ],
                            'line-opacity': 1
                        }}
                    />
                </Source>
            )}

            {/* Driver Markers */}
            {driversRef?.current && <DriverMarkers drivers={driversRef.current}/>}
            {/* {currentDrivers && (
                <Source id="drivers" type="geojson" data={geojsonDriverData}>
                    <Layer
                        id="driver-locations"
                        type="circle"
                        paint={{
                            'circle-radius': 10,
                            'circle-color': ['get', 'teamColour'],
                            'circle-opacity': 1,
                        }}
                    />
                </Source>
            )} */}
        </Map>
    );
};

export default RaceMap;
