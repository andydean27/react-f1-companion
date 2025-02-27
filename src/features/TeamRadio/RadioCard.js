import React, { useState, useEffect } from 'react';
import Waveform from '../../components/ui/Waveform';

const RadioCard = ({ radioMessage, driver, className = "" }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        const audioElement = new Audio(radioMessage.recording_url);
        setAudio(audioElement);

        // Listen for the loadedmetadata event to get the duration
        audioElement.addEventListener('loadedmetadata', () => {
            setDuration(audioElement.duration);
        });

        // Clean up the event listener
        return () => {
            audioElement.removeEventListener('loadedmetadata', () => {
                setDuration(audioElement.duration);
            });
        };
    }, [radioMessage.recording_url]);

    useEffect(() => {
        if (audio) {
            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
        }
    }, [audio]);

    const handlePlayClick = () => {
        audio.play();
    };

    // Format the duration to mm:ss
    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Format date to HH:mm:ss
    const formatdate = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    return (
        <div 
            className={`radio-card container ${className}`}
            style={{
                backgroundColor: `#${driver.team_colour}80`, // alpha 0.5
                borderTopColor: `#${driver.team_colour}`,
                borderLeftColor: `#${driver.team_colour}`,
                borderRightColor: `#${driver.team_colour}1A`,
                borderBottomColor: `#${driver.team_colour}1A`
            }}>
            <div className='radio-card-info'>
                <span>{driver.driver_number}</span>
                <span>{driver.last_name}</span>
                <span>{formatdate(radioMessage.date)}</span>
                
            </div>
            <div className='radio-card-controls'>
                <button onClick={handlePlayClick} disabled={isPlaying}>
                    ▶
                </button>
                <div className='waveform-container'>
                    <Waveform n={30} className={isPlaying ? "active" : ""}/>
                </div>
                {duration && <span>{formatDuration(duration)}</span>}
            </div>
        </div>
    );
};

export default RadioCard;