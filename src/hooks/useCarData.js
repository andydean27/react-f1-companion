// useLocationData.js
import { useEffect, useState, useRef } from 'react';
import { fetchOpenf1Data } from '../services/fetchSessionData';
import { useCurrentTime, useIsLive, usePlayback, useSettings } from '../contexts/Contexts';

export const useCarData = (sessionKey, driver) => {
    const [carData, setCarData] = useState([]);
    const { isPlaying } = usePlayback();
    const { currentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);
    const { settings } = useSettings();
    const { isLive } = useIsLive();

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        if (!isPlaying || !sessionKey) return; // Skip interval creation if not playing
        
        const fetchData = async () => {
            const data = await fetchOpenf1Data(
                'car_data',             // endPoint
                sessionKey,             // sessionKey
                currentTimeRef.current - settings.broadcastDelay*isLive, // currentTime
                'date',                 // dateProperty
                settings.carDataBuffer,                  // bufferUp
                settings.carDataBuffer,                   // bufferDown
                `&driver_number=${driver.driver_number}`,                   // other url args
                true);                  // log
            
            setCarData(data);
        };

        fetchData(); // fetch immediately when isPlaying is set to true

        const intervalID = setInterval(fetchData, settings.carDataFrequency);
    
        return () => {
            console.log('Clearing car data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change
    }, [isPlaying, sessionKey, driver]);
    

    return carData;
};
