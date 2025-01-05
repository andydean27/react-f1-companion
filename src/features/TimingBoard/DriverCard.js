import { useState } from "react";
import './TimingBoard.css';

const DriverCard = ({ driver, expanded }) => {
    return (
        <div className="driver-card">
            <span className="position">{driver.latest_position || '-'}</span>
            <span className="name_acronym">{driver.name_acronym || '-'}</span>
            <span className="interval">{driver.latest_interval?.interval || '-'}</span>
            <span className="gap_to_leader">{driver.latest_interval?.gap_to_leader || '-'}</span>
            {/* Add more details as needed */}
        </div>
    );
};

export default DriverCard;
