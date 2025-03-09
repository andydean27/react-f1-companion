import React, { useState, useEffect, useRef } from "react";
import './TimePlayer.css';

const TimePlayer = ({ startTime, endTime, value, timeMarkers, sectionMarkers, onTimeUpdate, onPlayUpdate }) => {
    const [currentTime, setCurrentTime] = useState(value); // Tracks the current time
    const [isPlaying, setIsPlaying] = useState(false); // Playback state
    const [playbackSpeed, setPlaybackSpeed] = useState(1); // Normal speed
    const [isUserInteracting, setIsUserInteracting] = useState(false); // Tracks user interaction with the slider
    const intervalRef = useRef(null);

    // Sync `currentTime` with `value` when `value` changes
    useEffect(() => {
        setCurrentTime(value);
    }, [value]);

    // Update time at the set playback speed
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTime((prevTime) => {
                    const newTime = prevTime + 50 * playbackSpeed;
                    return newTime >= endTime ? endTime : newTime;
                });
            }, 50);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, playbackSpeed, endTime]);

    // Notify parent of time updates
    useEffect(() => {
        if (onTimeUpdate) {
            onTimeUpdate(currentTime);
        }
    }, [currentTime]);
    // }, [currentTime, onTimeUpdate]);

    // Notify parent of play state changes
    useEffect(() => {
        if (onPlayUpdate) {
            onPlayUpdate(isPlaying);
        }
    }, [isPlaying]);
    // }, [isPlaying, onPlayUpdate]);

    // Handle slider changes
    const handleSliderChange = (e) => {
        setCurrentTime(Number(e.target.value));
    };

    // Handle slider interaction start
    const handleSliderMouseDown = () => {
        setIsUserInteracting(true);
    };

    // Handle slider interaction end
    const handleSliderMouseUp = () => {
        setIsUserInteracting(false);
        setIsPlaying(false);
    };

    // Play/Pause toggle
    const togglePlayPause = () => {
        setIsPlaying((prevState) => !prevState);
        if (!isPlaying) {
            setPlaybackSpeed(1); // Reset to normal speed on play
        }
    };

    // Fast-forward
    // const fastForward = () => {
    //     if (isPlaying) {
    //         setPlaybackSpeed((prevSpeed) => prevSpeed * 2); // Double the speed
    //     }
    // };

    // Format time (in milliseconds) as HH:MM:SS
    const formatTime = (time) => {
        const date = new Date(time);
        return date.toISOString().substr(11, 8);
    };

    // To do: dont call this function every render, create a state for the jsx
    const generateTimeMarkers = () => {
        // Takes time marker object and generates jsx to display them
        // time.time in milliseconds
        if (!timeMarkers || !sectionMarkers) return null;
        return (
            <div className="time-marker-container">
            {sectionMarkers && sectionMarkers.map((section, index) => (
                <div
                    key={index}
                    className="section-marker"
                    style={{ ...section?.style,
                        left: `${(section?.start_time - startTime) / (endTime - startTime) * 100}%`,
                        width: `${(section?.end_time - section?.start_time) / (endTime - startTime) * 100}%` }}
                />
            ))}
            {timeMarkers && timeMarkers.map((time, index) => (
                <div
                key={index}
                className="time-marker"
                style={{ ...time.style, 
                    left: `${(time?.time - startTime) / (endTime - startTime) * 100}%` }}
                />
            ))}
            
            </div>
        )
    };

    const previousTime = () => {
        // Move current time back to the previous time marker
        
        if (!timeMarkers) return;

        const timeMarkersFiltered = timeMarkers.filter((time) => time.time < currentTime);
        if (timeMarkersFiltered.length === 0) return;

        setCurrentTime(timeMarkersFiltered[timeMarkersFiltered.length - 1].time);

    }

    const toLive = () => {
        // Move current time to now in UTC in milliseconds

        setCurrentTime(Date.now());
    };

    const nextTime = () => {
        // Find the next time marker after the current time

        if (!timeMarkers) return;

        const timeMarkersFiltered = timeMarkers.filter((time) => time.time > currentTime);
        if (timeMarkersFiltered.length === 0) return;

        setCurrentTime(timeMarkersFiltered[0].time);
    }

    return (
        <div className="time-player container">
            <div className="controls">
                {/* previous lap button */}
                <button className="button-round" style={{fontSize: '40px'}} onClick={previousTime}>
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="button-icon">
                        <rect fill="none" height="256" width="256"/>
                        <path d="M195.9,195.9a96.1,96.1,0,0,1-135.8,0,8,8,0,0,1,0-11.3,7.9,7.9,0,0,1,11.3,0,80,80,0,1,0,0-113.2l-4.3,4.3L85.5,94.1a8,8,0,0,1-5.7,13.6h-48a8,8,0,0,1-8-8v-48a8.2,8.2,0,0,1,5-7.4,8,8,0,0,1,8.7,1.8L55.8,64.4l4.3-4.3A96,96,0,0,1,195.9,195.9Z"/>
                    </svg>
                </button>
                {/* play/pause button */}
                <button className="button-round" onClick={togglePlayPause}>
                    
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="button-icon">
                        <rect fill="none" height="256" width="256"/>
                        
                        {isPlaying ? 
                            // pause
                            <path d="M216,48V208a16,16,0,0,1-16,16H164a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h36A16,16,0,0,1,216,48ZM92,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H92a16,16,0,0,0,16-16V48A16,16,0,0,0,92,32Z"/>
                        :
                            // play
                            <path d="M232.3,114.3,88.3,26.4a15.5,15.5,0,0,0-16.1-.3A15.8,15.8,0,0,0,64,40V216a15.8,15.8,0,0,0,8.2,13.9,15.5,15.5,0,0,0,16.1-.3l144-87.9a16,16,0,0,0,0-27.4Z"/>
                        }
                    </svg>
                </button>
                {/* next lap button */}
                <button className="button-round" style={{fontSize: '40px'}} onClick={nextTime}>
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="button-icon">
                        <rect fill="none" height="256" width="256"/>
                        <path d="M232.2,51.7v48a8,8,0,0,1-8,8h-48a8,8,0,0,1-5.7-13.6l18.4-18.4-4.3-4.3a80,80,0,1,0,0,113.2,7.9,7.9,0,0,1,11.3,0,8,8,0,0,1,0,11.3,96,96,0,1,1,0-135.8l4.3,4.3,18.3-18.3a8,8,0,0,1,8.7-1.8A8.2,8.2,0,0,1,232.2,51.7Z"/>
                    </svg>
                </button>
                {/* to now button */}
                <button className="button-round" onClick={toLive}>
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="button-icon">
                        <rect fill="none" height="256" width="256"/>
                        <path d="M208,40V216a8,8,0,0,1-16,0V142.3L72.3,215.4a16.2,16.2,0,0,1-8.3,2.3,15.4,15.4,0,0,1-7.8-2,15.9,15.9,0,0,1-8.2-14V54.3A16,16,0,0,1,72.3,40.6L192,113.7V40a8,8,0,0,1,16,0Z"/>
                    </svg>
                </button>
                <div className="time-display">{formatTime(currentTime)}</div>
            </div>
            <div className="time-slider-container">
                <input
                    type="range"
                    min={startTime}
                    max={endTime}
                    value={currentTime}
                    onChange={handleSliderChange}
                    onMouseDown={handleSliderMouseDown}
                    onMouseUp={handleSliderMouseUp}
                    className="time-slider"
                />
                {generateTimeMarkers()}
            </div>  
        </div>
    );
};

export default TimePlayer;
