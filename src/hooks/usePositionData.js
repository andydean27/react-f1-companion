import { useState, useEffect, useRef } from "react";
import { useIsLive, usePlayback, useCurrentTime, useSettings } from "../contexts/Contexts";
import { fetchOpenf1Data } from "../services/fetchSessionData";


export const usePositionData = (sessionKey) => {
    const [positions, setPositions] = useState([]);
    const { isPlaying } = usePlayback();
    const { isLive } = useIsLive();
    const { settings } = useSettings();

    useEffect(() => {
        if (!sessionKey) return; // Skip interval creation if session not selected

        const fetchData = async () => {

            const data = await fetchOpenf1Data(
                'position',     // endPoint
                sessionKey,     // sessionKey
                undefined,      // currentTime
                undefined,      // dateProperty
                undefined,      // bufferUp
                undefined,      // bufferDown
                '',                   // other url args
                true);          // log
            
            setPositions(data || positions); // if the new data set is null due to errors keep the existing data
        }

        // Initially load data
        fetchData();

        // If not playing skip
        if (!isPlaying) return;

        // If session is not live return and don't set up interval
        if (!isLive) return;

        // If session is live start interval to continuously load data
        const intervalID = setInterval(fetchData, settings.positionFrequency);
    
        return () => {
            console.log('Clearing position data interval...');
            clearInterval(intervalID);
         } // Cleanup on unmount or when dependencies change

    }, [isPlaying, sessionKey]);

    return positions;
};