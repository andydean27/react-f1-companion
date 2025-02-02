import { useMemo, useRef, useState, useEffect, useContext, useCallback } from 'react';
import { SelectedSessionContext, useSelectedDriver, useCurrentTime } from '../contexts/Contexts';
import { useLocationData } from './useLocationData';
import { getTrackCoordinates } from '../config/trackCoordinates';
import { GetCurrentLocation } from '../utils/DriverDataProcessing';
import { use } from 'react';

const useDriverMarkerSource = (drivers) => {
    // States
    const [driverFeatureCollection, setDriverFeatureCollection] = useState(null);

    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { selectedDriver } = useSelectedDriver();
    const { currentTime } = useCurrentTime();

    // Refs
    const selectedDriverRef = useRef(selectedDriver);
    const currentTimeRef = useRef(currentTime);
    // const locationsRef = useRef(useLocationData(selectedSession?.session_key));

    const locations = useLocationData(selectedSession?.session_key);
    const locationsRef = useRef(locations);

    // States
    const [currentDriverLocations, setCurrentDriverLocations] = useState(null);

    // Effects
    useEffect(() => {
        selectedDriverRef.current = selectedDriver;
    }, [selectedDriver]);

    useEffect(() => {
        locationsRef.current = locations;
    }, [locations]);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    const updateDriverLocations = useCallback(() => {
        if (!selectedSession) return;

        const trackData = getTrackCoordinates(selectedSession.location);
        const updatedDrivers = GetCurrentLocation(drivers, locationsRef.current, currentTimeRef.current, trackData);

        if (updatedDrivers) {
            setCurrentDriverLocations(updatedDrivers);
        }
    }, [selectedSession, drivers]);

    useEffect(() => {
        if (!selectedSession) return;

        const mapIntervalID = setInterval(updateDriverLocations, 50);
        return () => {
            console.log('Clearing map update interval...');
            clearInterval(mapIntervalID);
        };
    }, [selectedSession, updateDriverLocations]);

    useEffect(() => {
        if (!currentDriverLocations) return;

        const currentDriverFeatures = currentDriverLocations?.map(driver => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [driver.x, driver.y],
            },
            properties: {
                teamColour: `#${driver.team_colour}`,
                driverNameAcronym: driver.name_acronym,
                isSelected: driver.driver_number === selectedDriverRef.current?.driver_number,
            }
        }));

        setDriverFeatureCollection({
            type: 'FeatureCollection',
            features: currentDriverFeatures,
        });

    }, [currentDriverLocations]);

    return driverFeatureCollection;

    // return useMemo(() => {
    //     const currentDriverFeatures = currentDriverLocations?.map(driver => ({
    //         type: 'Feature',
    //         geometry: {
    //             type: 'Point',
    //             coordinates: [driver.x, driver.y],
    //         },
    //         properties: {
    //             teamColour: `#${driver.team_colour}`,
    //             driverNameAcronym: driver.name_acronym,
    //             isSelected: driver.driver_number === selectedDriverRef.current?.driver_number,
    //         }
    //     }));

    //     // console.log(currentDriverFeatures[0].geometry.coordinates);

    //     return {
    //         type: 'FeatureCollection',
    //         features: currentDriverFeatures,
    //     };
    // }, [currentDriverLocations]);
};

export default useDriverMarkerSource;
