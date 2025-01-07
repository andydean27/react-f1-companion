import { Rnd } from "react-rnd";
import { useEffect, useContext, useRef, useState } from "react";
import { updateTargetObject } from "../../utils/DriverDataProcessing";
import { CurrentTimeContext, SelectedSessionContext, useCurrentTime, usePlayback, useDrivers } from "../../contexts/Contexts";
import { useIntervalData } from "../../hooks/useIntervalData";
import { usePositionData } from "../../hooks/usePositionData";
import DriverCard from "./DriverCard";
import './TimingBoard.css'
import { useLapData } from "../../hooks/useLapData";

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
    const [boardSize, setBoardSize] = useState({ width: 200, height: 400 }); // Initial size

    // Hooks
    const intervals = useIntervalData(selectedSession?.session_key);
    const intervalsRef = useRef(intervals)

    const positions = usePositionData(selectedSession?.session_key);
    const positionsRef = useRef(positions)

    const laps = useLapData(selectedSession?.session_key);
    const lapsRef = useRef(laps);

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

    useEffect(() => {
        lapsRef.current = laps;
    }, [laps]);

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

            if (lapsRef.current) {
                // Get fastest lap for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    lapsRef.current,
                    'lap_duration',
                    'smallest',
                    currentTimeRef.current,
                    'date_start',
                    (lap) => lap.lap_duration > 0, // No additional filtering
                    (lap) => ({ fastest_lap: lap }) // Add the latestInterval property
                );

                // Get current lap for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    lapsRef.current,
                    'date_start',
                    'latest',
                    currentTimeRef.current,
                    'date_start',
                    () => true, // No additional filtering
                    (lap) => ({ current_lap: lap }) // Add the latestInterval property
                );
            }

            // Sort drivers
            if (positionsRef.current){
                updatedDrivers = Object.values(updatedDrivers).sort((a, b) => a.latest_position - b.latest_position);
            }

            console.log(updatedDrivers[1]);
            setCurrentDrivers(updatedDrivers);

        };

        const intervalID = setInterval(updateDriverData, 1000);
        return () => {
            console.log('Clearing map update interval...');
            clearInterval(intervalID);
        }
    }, [selectedSession]);

    
    const toggleExpanded = () => {
        setBoardSize((prevSize) => ({
            ...prevSize,
            width: expanded ? prevSize.width / 2.5 : prevSize.width * 2.5,
        }));
        setExpanded((prev) => !prev);
    };

    const handleResize = (e, direction, ref, delta, position) => {
        setBoardSize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
        });
    };

    return (
        <Rnd
            default={{
                x: 50,
                y: 100,
                // width: 300,
                // height: 400,
            }}
            size={boardSize} // Dynamically set the size
            onResize={handleResize} // Update state on resize
            bounds="parent"
            minWidth={200}
            minHeight={(currentDrivers?.length * 20 + 50) || 50} // Minimum size to fit all content
            className="timing-board"
        >
            
            <div className='driver-card-container'>
                <button onClick={toggleExpanded}>
                    toggle
                </button>
                {currentDrivers && 
                currentDrivers.map((driver) => (
                    <DriverCard 
                        key={driver.driver_number} 
                        driver={driver} 
                        expanded={expanded} 
                        sessionType={selectedSession?.session_type}
                    />
                ))}
            </div>
        </Rnd>
    );
};

export default TimingBoard