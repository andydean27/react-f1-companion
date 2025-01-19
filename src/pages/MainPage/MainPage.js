import React, { useState, useEffect, useContext } from "react";
import { fetchDriverData} from "../../services/fetchSessionData";

import RaceMap from "../../features/RaceMap/RaceMap";
import SessionSelector from "../../features/SessionSelector/SessionSelector";
import TimePlayer from "../../components/ui/TimePlayer";

import './MainPage.css';
import { SelectedSessionContext, usePlayback, useCurrentTime, useDrivers } from "../../contexts/Contexts";
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
            <TimingBoard/>
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
