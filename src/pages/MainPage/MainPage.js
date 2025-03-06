import React, { useState, useEffect, useContext } from "react";
import { fetchDriverData} from "../../services/fetchSessionData";

import RaceMap from "../../features/RaceMap/RaceMap";
import SessionSelector from "../../features/SessionSelector/SessionSelector";
import TimePlayer from "../../components/ui/TimePlayer";
import RaceControl from "../../features/RaceControl/RaceControl";
import TeamRadio from "../../features/TeamRadio/TeamRadio";
import Settings from "../../features/Settings/Settings";

import './MainPage.css';
import { SelectedSessionContext, usePlayback, useCurrentTime, useDrivers, useSelectedDriver } from "../../contexts/Contexts";
import TimingBoard from "../../features/TimingBoard/TimingBoard";
import DriverDetails from "../../features/DriverDetails/DriverDetails";
import { useLapData } from "../../hooks/useLapData";
import { useRaceControlData } from "../../hooks/useRaceControlData";
import { useTeamRadioData } from "../../hooks/useTeamRadio";
import { generateTimeMarkers, generateSectionMarkers } from "../../utils/SessionDataProcessing";



const MainPage = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const {selectedDriver} = useSelectedDriver();
    const { drivers, setDrivers } = useDrivers();
    const { isPlaying, setIsPlaying } = usePlayback();
    const { currentTime, setCurrentTime } = useCurrentTime();

    // Hooks
    const laps = useLapData(selectedSession?.session_key);
    const raceControl = useRaceControlData(selectedSession?.session_key);
    const teamRadio = useTeamRadioData(selectedSession?.session_key);

    // States
    const [startTime, setStartTime] = useState(0);
    const [timeMarkers, setTimeMarkers] = useState(null);
    const [sectionMarkers, setSectionMarkers] = useState(null);
    const [endTime, setEndTime] = useState(0);
    const [isRaceControlVisible, setIsRaceControlVisible] = useState(false);
    const [isTeamRadioVisible, setIsTeamRadioVisible] = useState(false);


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
            <RaceMap/>

            {selectedSession && <TimingBoard/>}

            {(selectedSession && raceControl) && <RaceControl raceControl={raceControl}/>}

            {(selectedSession && teamRadio) && <TeamRadio teamRadio={teamRadio}/>}

            {selectedDriver && 
            <DriverDetails driver={selectedDriver}/>
            }

            {selectedSession &&
            <TimePlayer
                startTime={startTime}
                endTime={endTime}
                value={startTime}
                timeMarkers={timeMarkers}
                sectionMarkers={sectionMarkers}
                onTimeUpdate={handleTimeUpdate}
                onPlayUpdate={handlePlayUpdate}
            />}

            {/* <Settings/> */}

            <div className="main-page-options">
                <SessionSelector/>
                <div className="main-page-features">
                    <div className="main-page-feature-toggles">
                        {/* Timing */}
                        <button className="container">
                            <svg 
                                viewBox="0 0 256 256"
                                xmlns="http://www.w3.org/2000/svg"
                                className="button-icon"
                            >
                                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM40,160H80v32H40Zm176,32H96V160H216v32Z"/>
                            </svg> 
                            {"Timing"}
                        </button>
                        {/* Race Control Toggle Button */}
                        <button className="container" onClick={() => setIsRaceControlVisible(!isRaceControlVisible)}>
                            <svg 
                                viewBox="0 0 256 256"
                                xmlns="http://www.w3.org/2000/svg"
                                className="button-icon"
                            >
                                <path d="M219.6,40.8a8.2,8.2,0,0,0-8.4.8c-28.3,21.2-52.3,11-80-.9s-60.3-25.9-96,.9h-.1l-.4.3-.2.2-.3.3-.3.3-.2.3-.3.3c0,.1-.1.2-.2.3l-.2.4c0,.1-.1.2-.1.3a.8.8,0,0,0-.2.4c-.1.1-.1.2-.2.4s-.1.2-.1.3-.1.3-.1.4-.1.2-.1.3-.1.3-.1.4V47c0,.1-.1.3-.1.4V216a8,8,0,0,0,16,0V172.1c26.9-18.1,50.1-8.2,76.8,3.3,16.3,6.9,33.8,14.4,52.6,14.4,13.8,0,28.3-4,43.4-15.4A8.1,8.1,0,0,0,224,168V48A8.2,8.2,0,0,0,219.6,40.8Z"/>
                            </svg>
                            {"Race Control"}
                        </button>
                        {/* Radio Toggle Button */}
                        <button className="container" onClick={() => setIsRaceControlVisible(!isRaceControlVisible)}>
                            <svg 
                                viewBox="0 0 256 256"
                                xmlns="http://www.w3.org/2000/svg"
                                className="button-icon"
                            >
                                <path d="M216,72H86.5L194.3,39.7a8,8,0,1,0-4.6-15.4l-160,48h0l-.7.3h-.1l-.5.3H28a6.8,6.8,0,0,0-2.1,1.7.1.1,0,0,1-.1.1c-.1.1-.1.2-.2.4l-.2.2a.3.3,0,0,0-.1.2,6.7,6.7,0,0,0-1,2.3c-.1.1-.1.2-.1.4h-.1a2,2,0,0,1-.1.7h0V80h0V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM96,184H56a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm0-32H56a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm0-32H56a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm72,52a28,28,0,1,1,28-28A28.1,28.1,0,0,1,168,172Z"/>
                            </svg>
                            {"Radio"}
                        </button>
                    </div>
                    <div className="main-page-settings-toggle">
                        {/* Settings Button */}
                        <button className="container button-settings" onClick={() => setIsRaceControlVisible(!isRaceControlVisible)}>
                            <svg 
                                viewBox="0 0 256 256"
                                xmlns="http://www.w3.org/2000/svg"
                                className="button-icon"
                            >
                                <path d="M234.8,150.4l-14.9-19.8c.1-1.8,0-3.7,0-5.1l14.9-19.9a7.8,7.8,0,0,0,1.3-6.9,114.8,114.8,0,0,0-10.9-26.4,8.2,8.2,0,0,0-5.8-4l-24.5-3.5-3.7-3.7-3.5-24.5a8.4,8.4,0,0,0-3.9-5.8,117.5,117.5,0,0,0-26.5-10.9,7.8,7.8,0,0,0-6.9,1.3L130.6,36h-5.2L105.6,21.2a7.8,7.8,0,0,0-6.9-1.3A114.8,114.8,0,0,0,72.3,30.8a8.2,8.2,0,0,0-4,5.8L64.8,61.1l-3.7,3.7L36.6,68.3a8.2,8.2,0,0,0-5.8,4A114.8,114.8,0,0,0,19.9,98.7a7.8,7.8,0,0,0,1.3,6.9l14.9,19.8v5.1L21.2,150.4a7.8,7.8,0,0,0-1.3,6.9,114.8,114.8,0,0,0,10.9,26.4,8.2,8.2,0,0,0,5.8,4l24.5,3.5,3.7,3.7,3.5,24.5a8.2,8.2,0,0,0,4,5.8,114.8,114.8,0,0,0,26.4,10.9,7.6,7.6,0,0,0,2.1.3,7.7,7.7,0,0,0,4.8-1.6L125.4,220h5.2l19.8,14.8a7.8,7.8,0,0,0,6.9,1.3,113,113,0,0,0,26.4-10.9,8.2,8.2,0,0,0,4-5.8l3.5-24.6c1.2-1.2,2.6-2.5,3.6-3.6l24.6-3.5a8.2,8.2,0,0,0,5.8-4,114.8,114.8,0,0,0,10.9-26.4A7.8,7.8,0,0,0,234.8,150.4ZM128,172a44,44,0,1,1,44-44A44,44,0,0,1,128,172Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
            </div>

        </div>
    );
};

export default MainPage;
