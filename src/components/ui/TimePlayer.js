import React, { useState, useEffect, useRef } from "react";
import './TimePlayer.css';

const TimePlayer = ({ startTime, endTime, value, onTimeUpdate, onPlayUpdate }) => {
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
    const fastForward = () => {
        if (isPlaying) {
            setPlaybackSpeed((prevSpeed) => prevSpeed * 2); // Double the speed
        }
    };

    // Format time (in milliseconds) as HH:MM:SS
    const formatTime = (time) => {
        const date = new Date(time);
        return date.toISOString().substr(11, 8);
    };

    return (
        <div className="time-player">
            <input
                type="range"
                min={startTime}
                max={endTime}
                value={currentTime}
                onChange={handleSliderChange}
                className="time-slider"
            />

            <div className="controls">
                <button onClick={togglePlayPause}>
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={fastForward} disabled={!isPlaying}>
                    Fast Forward
                </button>
                <div className="time-display">{formatTime(currentTime)}</div>
            </div>
        </div>
    );
};

export default TimePlayer;
