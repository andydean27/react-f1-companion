import { Rnd } from "react-rnd";
import { useEffect, useContext, useRef, useState } from "react";
import { updateTargetObject, addFastestLapToDrivers } from "../../utils/DriverDataProcessing";
import { CurrentTimeContext, SelectedSessionContext, useCurrentTime, usePlayback, useDrivers, useSelectedDriver, useSettings, useIsLive } from "../../contexts/Contexts";
import { useIntervalData } from "../../hooks/useIntervalData";
import { usePositionData } from "../../hooks/usePositionData";
import DriverTiming from "./DriverTiming";
import './TimingBoard.css'
import { useLapData } from "../../hooks/useLapData";
import { useStintData } from "../../hooks/useStintData";
import TimingHeader from "./TimingHeader";

const TimingBoard = () => {
    // Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { isPlaying, setIsPlaying } = usePlayback();

    const { currentTime, setCurrentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    const { drivers } = useDrivers();
    const driversRef = useRef(drivers);

    const { selectedDriver, setSelectedDriver } = useSelectedDriver();

    const {settings } = useSettings();
    const settingsRef = useRef(settings);

    const { isLive } = useIsLive();

    // States
    const [expanded, setExpanded] = useState(false);
    const [currentDrivers, setCurrentDrivers] = useState(null);
    const [currentLapNumber, setCurrentLapNumber] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [boardSize, setBoardSize] = useState({ width: 200, height: 400 }); // Initial size

    // Hooks
    const intervals = useIntervalData(selectedSession?.session_key);
    const intervalsRef = useRef(intervals)

    const positions = usePositionData(selectedSession?.session_key);
    const positionsRef = useRef(positions)

    const laps = useLapData(selectedSession?.session_key);
    const lapsRef = useRef(laps);

    const stints = useStintData(selectedSession?.session_key);
    const stintsRef = useRef(stints);

    // Refs
    const tableRef = useRef(null);

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

    useEffect(() => {
        stintsRef.current = stints;
    }, [stints]);

    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    // New driver data for timing board
    useEffect(() => {
        if (!selectedSession){
            return;
        };
        
        const updateDriverData = () => {
            let updatedDrivers = driversRef.current;

            // Skip if updated drivers in null
            if (!updatedDrivers) return;

            if (intervalsRef.current) {
                // Get current interval for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    intervalsRef.current,
                    'date',
                    'latest',
                    currentTimeRef.current - settingsRef.current.broadcastDelay*isLive,
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
                    currentTimeRef.current - settingsRef.current.broadcastDelay*isLive,
                    'date',
                    () => true, // No additional filtering
                    (position) => ({ latest_position: position.position }) // Add the latestInterval property
                );

                // Get current intitial for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    positionsRef.current,
                    'date',
                    'smallest',
                    currentTimeRef.current - settingsRef.current.broadcastDelay*isLive,
                    'date',
                    () => true, // No additional filtering
                    (position) => ({ initial_position: position.position }) // Add the latestInterval property
                );

                // Calculate position change
                updatedDrivers = updatedDrivers.map(driver => ({
                    ...driver,
                    position_change: driver.initial_position - driver.latest_position
                }));
            }

            if (lapsRef.current) {
                // Get fastest lap for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    lapsRef.current,
                    'lap_duration',
                    'smallest',
                    currentTimeRef.current - settingsRef.current.broadcastDelay*isLive,
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
                    currentTimeRef.current - settingsRef.current.broadcastDelay*isLive,
                    'date_start',
                    () => true, // No additional filtering
                    (lap) => ({ current_lap: lap }) // Add the latestInterval property
                );

                updatedDrivers = addFastestLapToDrivers(updatedDrivers);

                // Add fastest lap delta
                // updatedDrivers = updatedDrivers.map(driver => ({
                //     ...driver,
                //     fastest_lap_delta: driver.fastest_lap?.lap_duration - driver.overall_fastest_lap?.lap_duration
                // }));
            }

            if (stintsRef.current) {
                // Get current stint for each driver based on current time
                updatedDrivers = updateTargetObject(
                    updatedDrivers,
                    stintsRef.current,
                    'lap_start',
                    'largest',
                    null,
                    'lap_start',
                    (stint) => {
                        // Match stint to the driver's current lap number
                        const driverData = updatedDrivers.find(d => d.driver_number === stint.driver_number);
                        return driverData && stint.lap_start <= driverData.current_lap?.lap_number;
                    },
                    (stint) => ({ current_stint: stint }), // Add the latestInterval property
                    true
                );
            }

            // Sort drivers
            if (positionsRef.current){
                updatedDrivers = Object.values(updatedDrivers).sort((a, b) => a.latest_position - b.latest_position);
            }

            // console.log(updatedDrivers[1]);
            setCurrentDrivers(updatedDrivers);
            setCurrentLapNumber(updatedDrivers?.[0]?.current_lap?.lap_number);
        };

        const intervalID = setInterval(updateDriverData, 500);
        return () => {
            console.log('Clearing map update interval...');
            clearInterval(intervalID);
        }
    }, [selectedSession]);

    
    const toggleExpanded = () => {
        setExpanded((prev) => !prev);
    };

    const toggleClose = () => {
        // Does nothing yet
    };

    useEffect(() => {
        if (tableRef.current) {
            const tableWidth = tableRef.current.scrollWidth;
            setBoardSize((prev) => ({
                ...prev,
                width: tableWidth,
            }));
        }
    }, [expanded, currentDrivers]); // Recalculate width when content or expansion changes


    const handleResize = (e, direction, ref, delta, position) => {
        setBoardSize((prev) => ({
            ...prev,
            height: parseInt(ref.style.height, 10), // Allow only vertical resizing
        }));
    };

    const handleDriverSelect = (driver) => {
        // Toggle driver selection
        if (selectedDriver?.driver_number === driver?.driver_number) {
            setSelectedDriver(null);
            return;
        }   
        setSelectedDriver(driver);
    };

    return (
        <Rnd
            default={{
                x: 16,
                y: 80,
            }}
            size={boardSize}
            onResize={handleResize}
            bounds="parent"
            minHeight={32}
            enableResizing={{
                top: false,
                right: false,
                bottom: true,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
            }}
            maxHeight={window.innerHeight - 160}
            className="timing-board container"
        >
            <div className="timing-board-content">
                <div className="controls">
                    {/* <button className="button-round" onClick={toggleClose}>✕</button> */}
                    <span className="title">{`Lap: ${currentLapNumber || "-"}`}</span>
                    <button className="button-round" onClick={toggleExpanded}>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="button-icon">
                            <rect fill="none" height="256" width="256"/>
                            {expanded ?
                                <path d="M216,136H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"/>:
                                <path d="M216,120H136V40a8,8,0,0,0-16,0v80H40a8,8,0,0,0,0,16h80v80a8,8,0,0,0,16,0V136h80a8,8,0,0,0,0-16Z"/>
                            }
                        </svg>

                    </button>
                </div>
                <div className="driver-timing-container">
                    <table ref={tableRef} className="timing-table">
                        <thead>
                            <TimingHeader 
                                sessionType={selectedSession?.session_type}
                                expanded={expanded}
                            />
                        </thead>
                        <tbody>
                            {currentDrivers &&
                                currentDrivers.map((driver) => (
                                    <DriverTiming
                                        key={driver.driver_number}
                                        driver={driver}
                                        expanded={expanded}
                                        sessionType={selectedSession?.session_type}
                                        onClick={handleDriverSelect}
                                        selected={selectedDriver?.driver_number === driver?.driver_number}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Rnd>
    );
};

export default TimingBoard