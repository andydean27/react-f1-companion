import { useState } from "react";
import {Rnd} from 'react-rnd';
import { useContext, useEffect, useRef } from "react";
import { SelectedSessionContext, useCurrentTime, useIsLive, usePlayback, useSettings } from "../../contexts/Contexts";
import { useCarData } from "../../hooks/useCarData";

import './DriverDetails.css';

const DriverDetails = ({ driver }) => {
    //Contexts
    const { selectedSession } = useContext(SelectedSessionContext);
    const { isPlaying, setIsPlaying } = usePlayback();
    const { currentTime, setCurrentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);
    const { settings } = useSettings();
    const { isLive } = useIsLive();

    // States
    const [currentCarData, setCurrentCarData] = useState(null);

    // Hooks
    const carData = useCarData(selectedSession?.session_key, driver);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    // Set up interval to get current car data
    useEffect(() => {
        if (!selectedSession || !carData) return;

        if (!isPlaying) return; // Skip interval creation if not playing

        const updateCarData = () => {
            // Get the last data point that is less than or equal to the current time
            const sortedCarData = carData.sort((a, b) => new Date(b.date) - new Date(a.date));
            const currentData = sortedCarData.find(data => new Date(data.date).getTime() <= currentTimeRef.current - settings.broadcastDelay*isLive);
            // console.log(currentTimeRef.current, new Date(currentData.date).getTime(), currentData, carData);
            setCurrentCarData(currentData);
        };

        updateCarData(); // fetch immediately when isPlaying is set to true

        const intervalID = setInterval(updateCarData, 200);

        return () => {
            console.log('Clearing car data interval...');
            clearInterval(intervalID);
        } // Cleanup on unmount or when dependencies change
    }, [selectedSession, carData, isPlaying, settings]);

    return (
        <Rnd
            default={{
                x: window.innerWidth/2, // Adjust 300 to the width of your component
                y: window.innerHeight/2 // Adjust 200 to the height of your component
            }}
            enableResizing={{
                top: false,
                right: false,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
            }}
            className="driver-details-container container"
            style={{
                backgroundColor: `#${driver.team_colour}80`, // alpha 0.5
                borderTopColor: `#${driver.team_colour}`,
                borderLeftColor: `#${driver.team_colour}`,
                borderRightColor: `#${driver.team_colour}1A`,
                borderBottomColor: `#${driver.team_colour}1A`
            }}
        >
            <div className="driver-details-content">
                <div className="driver-details">
                    <div className="driver-number">
                        {driver.driver_number}
                    </div>
                    <div className="driver-name">
                        <div className="first-name">
                            {driver.first_name || "-"}
                        </div>
                        <div className="last-name">
                            {driver.last_name || "-"}
                        </div>
                        <div className="team-name">
                            {driver.team_name || "-"}
                        </div>
                    </div>
                    <div className="driver-headshot">
                        <img src={driver.headshot_url?.replace("1col", "2col") || "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/"}/>
                    </div>
                </div>
                <div className="car-details">
                    <CarSpeedometer currentCarData={currentCarData}/>
                    <div style={{width: "200px"}}/> {/* place holder */}
                </div>
            </div>
        </Rnd>
    );

};

export default DriverDetails;


const CarSpeedometer = ({ currentCarData }) => {

    return <div className="car-speedometer">
            <div className="car-gear-content">
                <div className={`car-gear ${currentCarData?.n_gear === 1 ? "current-gear" : ""}`}> 1 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 2 ? "current-gear" : ""}`}> 2 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 3 ? "current-gear" : ""}`}> 3 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 4 ? "current-gear" : ""}`}> 4 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 5 ? "current-gear" : ""}`}> 5 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 6 ? "current-gear" : ""}`}> 6 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 7 ? "current-gear" : ""}`}> 7 </div>
                <div className={`car-gear ${currentCarData?.n_gear === 8 ? "current-gear" : ""}`}> 8 </div>
            </div>
            <div className="car-speed-pedal-content">
                <div className={`car-drs ${currentCarData?.drs === 8 ? "available" : currentCarData?.drs > 9 ? "active" : ""}`}>
                    DRS
                </div>
                <div className="car-speed">
                    {currentCarData?.speed || 0}
                </div>
                <div className="car-pedals">
                    <span>Throttle</span>
                    <div className="car-throttle-shadow">
                        <div className="car-throttle" style={{width: `${currentCarData?.throttle || 0}%`}}>
                        </div>
                    </div>
                    <div className="car-brake-shadow">
                        <div className="car-brake" style={{width: `${currentCarData?.brake || 0}%`}}>
                        </div>
                    </div>
                    <span>Brake</span>
                </div>
            </div>
        </div>
};