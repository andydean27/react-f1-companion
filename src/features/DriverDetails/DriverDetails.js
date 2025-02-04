import { useState } from "react";
import {Rnd} from 'react-rnd';
import './DriverDetails.css';

const DriverDetails = ({ driver }) => {
    // States
    const [currentCarData, setCurrentCarData] = useState(null);

    return (
        <Rnd
            default={{
                x: 0,
                y: 0}}
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
                <div className="car-drs">
                    DRS
                </div>
                <div className="car-speed">
                    {currentCarData?.speed || 0}
                </div>
                <div className="car-pedals">
                    <span>Throttle</span>
                    <div className="car-throttle-shadow">
                        <div className="car-throttle">
                        </div>
                    </div>
                    <div className="car-brake-shadow">
                        <div className="car-brake">
                        </div>
                    </div>
                    <span>Brake</span>
                </div>
            </div>
        </div>
};