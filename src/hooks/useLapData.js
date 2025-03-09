import { useState, useEffect, useRef } from "react";
import { useIsLive, usePlayback, useCurrentTime, useSettings } from "../contexts/Contexts";
import { fetchOpenf1Data } from "../services/fetchSessionData";


export const useLapData = (sessionKey) => {
    const [laps, setLaps] = useState([]);
    const { isPlaying } = usePlayback();
    const { isLive } = useIsLive();
    const {settings } = useSettings();
    const isFetching = useRef(false);


    useEffect(() => {
        if (!sessionKey) return; // Skip interval creation if session not selected

        const fetchData = async () => {
            if (isFetching.current) return; // Skip if a fetch is already in progress
            isFetching.current = true;

            const data = await fetchOpenf1Data(
                'laps',    // endPoint
                sessionKey,     // sessionKey
                undefined,   // currentTime
                undefined,      // dateProperty
                undefined,      // bufferUp
                1000000,        // bufferDown
                '',                   // other url args
                true);          // log
            
            setLaps(data || laps); // if the new data set is null due to errors keep the existing data
            isFetching.current = false;
        }

        // Initially load data
        fetchData();

        // If not playing skip
        if (!isPlaying) return;

        // If session is not live return and don't set up interval
        if (!isLive) return;

        // If session is live start interval to continuously load data
        const intervalID = setInterval(fetchData, settings.lapFrequency);
    
        return () => {
            console.log('Clearing lap data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change

    }, [isPlaying, sessionKey]);

    return laps;
};