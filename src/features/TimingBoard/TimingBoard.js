import { Rnd } from "react-rnd";
import { useEffect, useContext, useRef, useState } from "react";
import { updateTargetObject } from "../../utils/DriverDataProcessing";
import { CurrentTimeContext, SelectedSessionContext, useCurrentTime, usePlayback, useDrivers } from "../../contexts/Contexts";
import { useIntervalData } from "../../hooks/useIntervalData";
import { usePositionData } from "../../hooks/usePositionData";
import DriverCard from "./DriverCard";
import './TimingBoard.css'

const TimingBoard = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { isPlaying, setIsPlaying } = usePlayback();

    const { currentTime, setCurrentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    const { drivers } = useDrivers();
    const driversRef = useRef(drivers);

    // States
    const [expanded, setExpanded] = useState(false);
    const [currentDrivers, setCurrentDrivers] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);

    // Hooks
    const intervals = useIntervalData(selectedSession?.session_key);
    const intervalsRef = useRef(intervals)

    const positions = usePositionData(selectedSession?.session_key);
    const positionsRef = useRef(positions)

    // Keep the ref updated with the latest currentTime
    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        driversRef.current = drivers;
    }, [drivers]);

    useEffect(() => {
        intervalsRef.current = intervals;
    }, [intervals]);

    useEffect(() => {
        positionsRef.current = positions;
    }, [positions]);

    // New driver data for timing board
    useEffect(() => {
        if (!selectedSession){
            return;
        };
        
        const updateDriverData = () => {
            let updatedDrivers = driversRef.current;

            if (intervalsRef.current) {
                // Get current interval for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    intervalsRef.current,
                    'date',
                    'latest',
                    currentTimeRef.current,
                    'date',
                    () => true, // No additional filtering
                    (interval) => ({ latest_interval: interval }) // Add the latestInterval property
                );
            }

            if (positionsRef.current) {
                // Get current interval for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    positionsRef.current,
                    'date',
                    'latest',
                    currentTimeRef.current,
                    'date',
                    () => true, // No additional filtering
                    (position) => ({ latest_position: position.position }) // Add the latestInterval property
                );
            }


            // Sort drivers
            if (positionsRef.current){
                updatedDrivers = Object.values(updatedDrivers).sort((a, b) => a.latest_position - b.latest_position);
            }

            console.log(updatedDrivers[1].latest_position);
            setCurrentDrivers(updatedDrivers);

        };

        const intervalID = setInterval(updateDriverData, 1000);
        return () => {
            console.log('Clearing map update interval...');
            clearInterval(intervalID);
        }
    }, [selectedSession]);

    
    const toggleExpanded = () => setExpanded((prev) => !prev);

    return (
        <Rnd
            default={{
                x: 50,
                y: 50,
                width: 300,
                height: 400,
            }}
            bounds="parent"
            className="timing-board"
        >
            <button onClick={toggleExpanded}>
                toggle
            </button>
            {currentDrivers && 
            currentDrivers.map((driver) => (
                <DriverCard key={driver.driver_number} driver={driver} expanded={expanded}/>
            ))}
        </Rnd>
    );
};

export default TimingBoard