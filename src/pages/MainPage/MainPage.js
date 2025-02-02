import React, { useState, useEffect, useContext } from "react";
import { fetchDriverData} from "../../services/fetchSessionData";

import RaceMap from "../../features/RaceMap/RaceMap";
import SessionSelector from "../../features/SessionSelector/SessionSelector";
import TimePlayer from "../../components/ui/TimePlayer";

import './MainPage.css';
import { SelectedSessionContext, usePlayback, useCurrentTime, useDrivers } from "../../contexts/Contexts";
import TimingBoard from "../../features/TimingBoard/TimingBoard";
import { useLapData } from "../../hooks/useLapData";
import { useRaceControlData } from "../../hooks/useRaceControlData";
import { generateTimeMarkers, generateSectionMarkers } from "../../utils/SessionDataProcessing";


const MainPage = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { drivers, setDrivers } = useDrivers();
    const { isPlaying, setIsPlaying } = usePlayback();
    const { currentTime, setCurrentTime } = useCurrentTime();

    // Hooks
    const laps = useLapData(selectedSession?.session_key);
    const raceControl = useRaceControlData(selectedSession?.session_key);

    // States
    const [startTime, setStartTime] = useState(0);
    const [timeMarkers, setTimeMarkers] = useState(null);
    const [sectionMarkers, setSectionMarkers] = useState(null);
    const [endTime, setEndTime] = useState(0);


    // Set the start and end time
    useEffect(()=>{
        if (selectedSession){
            setStartTime(new Date (selectedSession.date_start).getTime());
            setEndTime(Math.max(new Date (selectedSession.date_end).getTime(), new Date(raceControl?.[raceControl.length-1]?.date).getTime()+120000));
        }

    },[selectedSession, raceControl]);

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

    useEffect(() => {
        setTimeMarkers(generateTimeMarkers(selectedSession, laps, raceControl));
        setSectionMarkers(generateSectionMarkers(selectedSession, laps, raceControl));
    }, [selectedSession, laps, raceControl]);

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
            <SessionSelector/>
            <TimingBoard/>
            {selectedSession &&
            <TimePlayer
                startTime={startTime}
                endTime={endTime}
                value={startTime}
                timeMarkers={timeMarkers}
                sectionMarkers={sectionMarkers}
                onTimeUpdate={handleTimeUpdate}
                onPlayUpdate={handlePlayUpdate}
            />
            }
        </div>
    );
};

export default MainPage;
