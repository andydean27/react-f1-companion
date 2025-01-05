import { useState, useEffect, useRef } from "react";
import { useIsLive, usePlayback, useCurrentTime } from "../contexts/Contexts";
import { fetchOpenf1Data } from "../services/fetchSessionData";


export const useLapData = (sessionKey) => {
    const [laps, setLaps] = useState([]);
    const { isPlaying } = usePlayback();
    const { isLive } = useIsLive();
    // const { currentTime } = useCurrentTime();
    // const currentTimeRef = useRef(currentTime);

    // useEffect(() => {
    //     currentTimeRef.current = currentTime;
    // }, [currentTime]);

    useEffect(() => {

        const fetchData = async () => {
            
            // let _currentTime = undefined;

            // // If session is live then use the slider time to continuously update the intervals
            // if (isLive) {
            //     _currentTime = currentTimeRef.current
            // }

            const data = await fetchOpenf1Data(
                'laps',    // endPoint
                sessionKey,     // sessionKey
                undefined,   // currentTime
                undefined,      // dateProperty
                undefined,      // bufferUp
                1000000,        // bufferDown
                true);          // log
            
            setIntervals(data);
        }

        // Initially load data
        fetchData();

        // If session is not live return and don't set up interval
        if (!isLive) {
            return;
        }

        // If session is live start interval to continuously load data
        const intervalID = setInterval(fetchData, 2000);
    
        return () => {
            console.log('Clearing lap data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change

    }, [isPlaying, sessionKey]);

    return laps;
};