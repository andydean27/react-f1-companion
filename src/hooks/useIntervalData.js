import { useState, useEffect, useRef } from "react";
import { useIsLive, usePlayback, useCurrentTime, useSettings } from "../contexts/Contexts";
import { fetchOpenf1Data } from "../services/fetchSessionData";


export const useIntervalData = (sessionKey) => {
    const [intervals, setIntervals] = useState([]);
    const { isPlaying } = usePlayback();
    const { isLive } = useIsLive();
    const { currentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);
    const {settings} = useSettings();
    const isFetching = useRef(false);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        if (!sessionKey) return; // Skip interval creation if session not selected

        const fetchData = async () => {
            if (isFetching.current) return; // Skip if a fetch is already in progress
            isFetching.current = true;
            
            let _currentTime = undefined;

            // If session is live then use the slider time to continuously update the intervals
            if (isLive) {
                _currentTime = currentTimeRef.current  - settings.broadcastDelay*isLive
            }

            const data = await fetchOpenf1Data(
                'intervals',    // endPoint
                sessionKey,     // sessionKey
                _currentTime,   // currentTime
                undefined,      // dateProperty
                undefined,      // bufferUp
                1000000,        // bufferDown
                '',                   // other url args
                true);          // log
            
            setIntervals(data || intervals); // if the new data set is null due to errors keep the existing data
            isFetching.current = false;
        }

        // Initially load data
        fetchData();

        // If not playing skip
        if (!isPlaying) return;

        // If session is not live return and don't set up interval
        if (!isLive) return;

        // If session is live start interval to continuously load data
        const intervalID = setInterval(fetchData, settings.intervalFrequency);
    
        return () => {
            console.log('Clearing interval data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change

    }, [isPlaying, sessionKey]);

    return intervals;
};