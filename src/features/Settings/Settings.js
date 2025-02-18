import React, { useState, useCallback } from 'react';
import './Settings.css';
import { useSettings } from '../../contexts/Contexts';
import InputSlider from '../../components/ui/InputSlider';


const Settings = () => {
    const [isHovered, setIsHovered] = useState(false);
    const {settings, setSettings} = useSettings();

    const updateSettings = useCallback((newSettings) => {
        setSettings((prevSettings) => {
            const updatedSettings = { ...prevSettings, ...newSettings };
            localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
            setSettings(updatedSettings);
            return updatedSettings;
        });
    }, []);

    const defaultSettings = {
        theme: 'dark',
        broadcastDelay: 5000,
        locationFrequency: 5000,
        locationBuffer: 10000,
        carDataFrequency: 5500,
        carDataBuffer: 10000,
        intervalFrequency: 2000,
        positionFrequency: 2500,
        lapFrequency: 3000,
        stintFrequency: 5000,
        raceControlFrequency: 2000,
        teamRadioFrequency: 5000,
        weatherFrequency: 30000,
    };


    return (
        <div 
            className="settings-container container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!isHovered ? (
                "Settings"
            ) : (
                <div className="settings-content">
                    <h3>Settings</h3>
                    <span className="settings-text">Note: Session will need to be refreshed for settings change to take effect</span>
                    <div className="settings-top">
                        <select 
                            value={settings.theme}
                            onChange={(e) => updateSettings({theme: e.target.value})}
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                        <button onClick={() => updateSettings(defaultSettings)}>Reset</button>
                    </div>
                    <span>Broadcast Delay</span>
                    <InputSlider
                        value={settings.broadcastDelay/1000}
                        label="Broadcast Delay"
                        onChange={(e) => updateSettings({broadcastDelay: e.target.value*1000})}
                        min={0}
                        max={60}
                        step={0.1}
                        unit='s'
                        toolTipText='Delay of live broadcast, use this to align data to broadcast feed if wanted. API is typically around 3 second delay, any less than that may cause stuttering. Only applied if live session is selected'
                    />
                    <span className="settings-section-header">Location API Call</span>
                    <InputSlider
                        value={settings.locationFrequency/1000}
                        label="Location Frequency"
                        onChange={(e) => updateSettings({locationFrequency: e.target.value*1000})}
                        min={1}
                        max={30}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of location data API calls'
                    />
                    <InputSlider
                        value={settings.locationBuffer/1000}
                        label="Location Buffer"
                        onChange={(e) => updateSettings({locationBuffer: e.target.value*1000})}
                        min={1}
                        max={40}
                        step={0.1}
                        unit='s'
                        toolTipText='Buffer time range for location data API calls'
                    />
                    <span>Car Data API Call</span>
                    <InputSlider
                        value={settings.carDataFrequency/1000}
                        label="Car Data Frequency"
                        onChange={(e) => updateSettings({carDataFrequency: e.target.value*1000})}
                        min={1}
                        max={30}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of car data API calls'
                    />
                    <InputSlider
                        value={settings.carDataBuffer/1000}
                        label="Car Data Buffer"
                        onChange={(e) => updateSettings({carDataBuffer: e.target.value*1000})}
                        min={1}
                        max={40}
                        step={0.1}
                        unit='s'
                        toolTipText='Buffer time range for car data API calls'
                    />
                    
                    <span>Other Data Live Frequency</span>
                    {/* for interval, position, lap, stint, race control, team radio, weather */}
                    <InputSlider
                        value={settings.intervalFrequency/1000}
                        label="Interval Frequency"
                        onChange={(e) => updateSettings({intervalFrequency: e.target.value*1000})}
                        min={1}
                        max={20}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of interval data updates when live session is being viewed'
                    />
                    <InputSlider
                        value={settings.positionFrequency/1000}
                        label="Position Frequency"
                        onChange={(e) => updateSettings({positionFrequency: e.target.value*1000})}
                        min={1}
                        max={20}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of position data updates when live session is being viewed'
                    />
                    <InputSlider
                        value={settings.lapFrequency/1000}
                        label="Lap Frequency"
                        onChange={(e) => updateSettings({lapFrequency: e.target.value*1000})}
                        min={1}
                        max={20}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of lap data updates when live session is being viewed'
                    />
                    <InputSlider
                        value={settings.stintFrequency/1000}
                        label="Stint Frequency"
                        onChange={(e) => updateSettings({stintFrequency: e.target.value*1000})}
                        min={1}
                        max={20}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of stint data updates when live session is being viewed'
                    />
                    <InputSlider
                        value={settings.raceControlFrequency/1000}
                        label="Race Control Frequency"
                        onChange={(e) => updateSettings({raceControlFrequency: e.target.value*1000})}
                        min={1}
                        max={20}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of race control data updates when live session is being viewed'
                    />
                    <InputSlider
                        value={settings.teamRadioFrequency/1000}
                        label="Team Radio Frequency"
                        onChange={(e) => updateSettings({teamRadioFrequency: e.target.value*1000})}
                        min={1}
                        max={20}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of team radio data updates when live session is being viewed'
                    />
                    <InputSlider
                        value={settings.weatherFrequency/1000}
                        label="Weather Frequency"
                        onChange={(e) => updateSettings({weatherFrequency: e.target.value*1000})}
                        min={1}
                        max={60}
                        step={0.1}
                        unit='s'
                        toolTipText='Frequency of weather data updates when live session is being viewed'
                    />
                    
                </div>
            )}
        </div>
    );
};

export default Settings;
