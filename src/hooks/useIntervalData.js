import { useState, useEffect, useRef } from "react";
import { useIsLive, usePlayback } from "../contexts/Contexts";
import { fetchOpenf1Data } from "../services/fetchSessionData";


export const useIntervalData = (sessionKey) => {
    const [intervals, setIntervals] = useState([]);
    const { isPlaying } = usePlayback();
    const { isLive } = useIsLive();
    // const { currentTime } = useCurrentTime();
    // const currentTimeRef = useRef(currentTime);

    // useEffect(() => {
    //     currentTimeRef.current = currentTime;
    // }, [currentTime]);

    useEffect(() => {

        const fetchData = async () => {
            const data = await fetchOpenf1Data(
                'intervals',    // endPoint
                sessionKey,     // sessionKey
                undefined,      // currentTime
                undefined,      // buffer
                undefined,      // dateString
                true);          // log
            
            setIntervals(data);
        }

        // Initially load data
        fetchData();

        // If session is not live return
        if (!isLive) {
            return;
        }

        // If session is live start interval to continuously load data
        const intervalID = setInterval(fetchData, 5000);
    
        return () => {
            console.log('Clearing interval data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change

    }, [isPlaying, sessionKey]);

    return intervals;
};