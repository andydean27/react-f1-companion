import React, { useState, useEffect, useContext } from "react";
import { fetchDriverData} from "../../services/fetchSessionData";

import RaceMap from "../../features/RaceMap/RaceMap";
import SessionSelector from "../../features/SessionSelector/SessionSelector";
import TimePlayer from "../../components/ui/TimePlayer";

import './MainPage.css';
import { SelectedSessionContext, usePlayback, useCurrentTime, useDrivers } from "../../contexts/Contexts";
import TimingBoard from "../../features/TimingBoard/TimingBoard";
import { useLapData } from "../../hooks/useLapData";


const MainPage = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { drivers, setDrivers } = useDrivers();
    const { isPlaying, setIsPlaying } = usePlayback();
    const { currentTime, setCurrentTime } = useCurrentTime();

    // Hooks
    const laps = useLapData(selectedSession?.session_key);

    // States
    const [startTime, setStartTime] = useState(0);
    const [timeMarkers, setTimeMarkers] = useState(null);
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

    useEffect(() => {
        // Generate time markers by getting the first occurence of each lap_number
        // Returns a list of objects with lap_number and time only using the first occurence of each lap_number
        if (laps) {
            // Sort laps by date_start
            laps.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
            
            // Get the first occurence of each lap_number, regardless of driver number
            const markers = laps.filter((lap, index, self) => 
                index === self.findIndex((t) => (
                    t.lap_number === lap.lap_number
                ))
            ).map((lap) => {
                return {
                    time: new Date(lap.date_start).getTime(),
                    lap_number: lap.lap_number,
                    style: {
                        height: lap.lap_number % 5 === 0 ? '10px' : '5px',
                    }
                };
            });

            setTimeMarkers(markers);
        }
        
    }, [selectedSession, laps]);

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
            {selectedSession &&
            <TimePlayer
                startTime={startTime}
                endTime={endTime}
                value={startTime}
                timeMarkers={timeMarkers}
                onTimeUpdate={handleTimeUpdate}
                onPlayUpdate={handlePlayUpdate}
            />
            }
        </div>
    );
};

export default MainPage;
