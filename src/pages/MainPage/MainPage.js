import React, { useState, useEffect, useContext, useRef } from "react";
import { fetchDriverData, fetchLapData, fetchLocationData } from "../../services/fetchSessionData";

import TrackMap from "../../features/TrackMap/TrackMap";
import RaceMap from "../../features/RaceMap/RaceMap";
import SessionSelector from "../../features/SessionSelector/SessionSelector";
import TimePlayer from "../../components/ui/TimePlayer";

import './MainPage.css';
import { SelectedSessionContext, LocationsContext, usePlayback, useCurrentTime, useDrivers } from "../../contexts/Contexts";
import TimingBoard from "../../features/TimingBoard/TimingBoard";

const MainPage = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { drivers, setDrivers } = useDrivers();
    const { isPlaying, setIsPlaying } = usePlayback();
    const { currentTime, setCurrentTime } = useCurrentTime();

    // States
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    


    // Set the start and end time
    useEffect(()=>{
        if (selectedSession){
            setStartTime(new Date (selectedSession.date_start).getTime());
            setEndTime(new Date (selectedSession.date_end).getTime());
        }

    },[selectedSession]);

    // Load initial driver data when selectedSession changes
    useEffect(() => {
        const loadDriverData = async () => {
            const data = await fetchDriverData(selectedSession.session_key);
            setDrivers(data);
        };
        
        if (selectedSession){
            loadDriverData();
        }
    }, [selectedSession]);

    

    // Set up a 5-second interval to fetch location data using the latest currentTime
    // useEffect(() => {
    //     let locationDataIntervalID;
        
    //     const loadLocationData = async () => {
    //         if (currentTimeRef.current && isPlaying) {
    //             const locationData = await fetchLocationData(selectedSession.session_key, currentTimeRef.current, 15000);
    //             setLocations(locationData);
    //         }
    //     };

    //     if (selectedSession){
    //         loadLocationData();
    //         locationDataIntervalID = setInterval(loadLocationData, 5000);
    //     }
        
    //     return () => clearInterval(locationDataIntervalID);
    // }, [selectedSession, isPlaying]);

    const handleTimeUpdate = (time) => {
        setCurrentTime(time);
    };

    const handlePlayUpdate = (play) => {
        setIsPlaying(play);
    };

    return (
        <div className="main-page-container">
            
            {/* <TrackMap /> */}
            <RaceMap/>
            <SessionSelector />
            <TimingBoard
                drivers={drivers}
            />
            <TimePlayer
                startTime={startTime}
                endTime={endTime}
                value={startTime}
                onTimeUpdate={handleTimeUpdate}
                onPlayUpdate={handlePlayUpdate}
            />
        </div>
    );
};

export default MainPage;
