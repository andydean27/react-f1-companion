// useLocationData.js
import { useEffect, useState, useRef } from 'react';
import { fetchOpenf1Data } from '../services/fetchSessionData';
import { useCurrentTime, usePlayback } from '../contexts/Contexts';

export const useLocationData = (sessionKey) => {
    const [carData, setCarData] = useState([]);
    const { isPlaying } = usePlayback();
    const { currentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        if (!isPlaying || !sessionKey) return; // Skip interval creation if not playing
        
        const fetchData = async () => {
            const data = await fetchOpenf1Data(
                'car_data',             // endPoint
                sessionKey,             // sessionKey
                currentTimeRef.current, // currentTime
                'date',                 // dateProperty
                10000,                  // bufferUp
                5000,                   // bufferDown
                '',                   // other url args
                true);                  // log
            
            setCarData(data);
        };

        fetchData(); // fetch immediately when isPlaying is set to true

        const intervalID = setInterval(fetchData, 5000);
    
        return () => {
            console.log('Clearing car data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change
    }, [isPlaying, sessionKey]);
    

    return carData;
};
