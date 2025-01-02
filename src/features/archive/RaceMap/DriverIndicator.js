import React from "react";
import "./DriverIndicator.css";

const DriverIndicator = ({ driver }) => {
    return (
        <div 
            className="driver_indicator"
            style={{
                top: `${-driver.y/10}px`,
                left: `${-driver.x/10}px`,
                backgroundColor: `#${driver.team_colour}`, // assumes team_colour is a hex color string
            }}
        />
    );
};

export default DriverIndicator;
