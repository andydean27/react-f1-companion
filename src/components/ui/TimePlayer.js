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

    const generateTimeMarkers = () => {
        // Takes time marker object and generates jsx to display them
        // time.time in milliseconds
        // time.hover_label as string


        if (!timeMarkers) return null;
        console.log(startTime, endTime);
        return (
            <div className="time-marker-container">
            {timeMarkers.map((time, index) => (
                <div
                key={index}
                className="time-marker"
                style={{ ...time.style, 
                    left: `${(time.time - startTime) / (endTime - startTime) * 100}%` }}
                >
                {/* <div className="time-marker-label">
                    {time.hover_label}
                </div> */}
                </div>
            ))}
            </div>
        )
    };

    const generateSectionMarkers = () => {
        // Takes section marker object and generates jsx to display them
        // section.start_time in milliseconds
        // section.end_time in milliseconds
        // section.colour as string
    };

    const previousTime = () => {
        // Move current time back to the previous time marker
        // If no time markers, do nothing
    }

    const nextTime = () => {
        // Move current time forward to the next time marker
        // If no time markers, do nothing
    }

    return (
        <div className="time-player container">
            <div className="controls">
                <button style={{fontSize: '40px'}} onClick={previousTime}>
                    ⥀
                </button>
                <button onClick={togglePlayPause}>
                    {isPlaying ? "❚❚" : "▶"}
                </button>
                <button style={{fontSize: '40px'}} onClick={nextTime}>
                    ⥁
                </button>
                <button>
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
