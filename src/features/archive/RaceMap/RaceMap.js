import React, { useContext, useEffect, useRef, useState } from 'react';
import DriverIndicator from './DriverIndicator';
import { GetCurrentLocation } from '../../../utils/DriverDataProcessing';
import { DriversContext, LocationsContext, CurrentTimeContext, SelectedSessionContext } from '../../../contexts/Contexts';

const RaceMap = () => {
    const { drivers } = useContext(DriversContext);
    const driversRef = useRef(drivers);
    const { locations } = useContext(LocationsContext);
    const locationsRef = useRef(locations);
    const { currentTime } = useContext(CurrentTimeContext);
    const currentTimeRef = useRef(currentTime);
    const { selectedSession } = useContext(SelectedSessionContext);

    const [currentDrivers, setCurrentDrivers] = useState([]);

    // Sync refs with context values
    useEffect(() => {
        driversRef.current = drivers;
    }, [drivers]);

    useEffect(() => {
        locationsRef.current = locations;
    }, [locations]);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    // Periodically update driver data based on location
    useEffect(() => {
        const updateDriverData = () => {
            const startTime = performance.now()
            const updatedDrivers = GetCurrentLocation(driversRef.current, locationsRef.current, currentTimeRef.current);
            const endTime = performance.now()
            console.log(`${endTime - startTime} milliseconds`)
            if (updatedDrivers) {
                setCurrentDrivers(updatedDrivers);
            }
        };
        
        const mapIntervalID = setInterval(updateDriverData, 1000);
        return () => clearInterval(mapIntervalID);
    }, [selectedSession]);

    return (
        <div className="race-map-container">
            {currentDrivers.map(driver => (
                <DriverIndicator key={driver.driver_number} driver={driver} />
            ))}
        </div>
    );
};

export default RaceMap;
