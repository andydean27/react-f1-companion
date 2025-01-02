import { useState } from "react";

const DriverCard = (driver) => {

    return (
        <div className="">
            <span>{driver.position}</span>
            <span>{driver.name_acronym}</span>
            <span>{driver.interval}</span>
            <span>{driver.gap_to_leader}</span>
        </div>
    );
};

export default DriverCard