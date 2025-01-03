import { useEffect, useContext, useRef, useState } from "react";
import { fetchStintData, fetchLapData, fetchIntervalData } from "../../services/fetchSessionData";
import { updateTargetObject } from "../../utils/DriverDataProcessing";
import { CurrentTimeContext, SelectedSessionContext, useCurrentTime, usePlayback } from "../../contexts/Contexts";
import { useIntervalData } from "../../hooks/useIntervalData";

const TimingBoard = (drivers) => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { isPlaying, setIsPlaying } = usePlayback();
    const { currentTime, setCurrentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    // States
    

    // Hooks
    const intervals = useIntervalData(selectedSession?.session_key);
    const intervalsRef = useRef(intervals);

    // Keep the ref updated with the latest currentTime
    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    
    return (
        <div></div>
    );
};

export default TimingBoard