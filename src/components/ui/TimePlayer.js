import React, { useState, useEffect, useRef } from "react";
import './TimePlayer.css';

const TimePlayer = ({ startTime, endTime, value, timeMarkers, sectionMarkers, onTimeUpdate, onPlayUpdate }) => {
    const [currentTime, setCurrentTime] = useState(value); // Tracks the current time
    const [isPlaying, setIsPlaying] = useState(false); // Playback state
    const [playbackSpeed, setPlaybackSpeed] = useState(1); // Normal speed
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
                    const newTime = prevTime + 20 * playbackSpeed;
                    return newTime >= endTime ? endTime : newTime;
                });
            }, 20);
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
                <button className="button-round" style={{fontSize: '40px'}} onClick={previousTime}>
                    ⥀
                </button>
                <button className="button-round" onClick={togglePlayPause}>
                    {isPlaying ? "❚❚" : "▶"}
                </button>
                <button className="button-round" style={{fontSize: '40px'}} onClick={nextTime}>
                    ⥁
                </button>
                <button className="button-round" onClick={toLive}>
                    ⏭
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
                    className="time-slider"
                />
                {generateTimeMarkers()}
            </div>  
        </div>
    );
};

export default TimePlayer;
