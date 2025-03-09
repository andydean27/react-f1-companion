import { useTeamRadioData } from "../../hooks/useTeamRadio";
import { useCurrentTime, useDrivers } from "../../contexts/Contexts";
import RadioCard from "./RadioCard";
import { useEffect, useRef, useState } from "react";
import "./TeamRadio.css";

const TeamRadio = ({ teamRadio }) => {
    // States
    const [filteredTeamRadio, setFilteredTeamRadio] = useState([]);
    
    // Contexts
    const { currentTime, setCurrentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    const { drivers } = useDrivers();
    const driversRef = useRef(drivers);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        driversRef.current = drivers;
    }, [drivers]);

    useEffect(() => {
        const interval = setInterval(() => {
            const filtered = teamRadio.filter(radioMessage => 
                (new Date(radioMessage.date).getTime() <= currentTimeRef.current) &&
                (new Date(radioMessage.date).getTime() >= currentTimeRef.current - 180000)
            );

            // get last 5
            const lastFive = filtered.slice(-5);

            setFilteredTeamRadio(lastFive);
        }, 3000);

        return () => clearInterval(interval);
    }, [teamRadio]);


    return (
        <div className="team-radio-container">
            {(teamRadio && driversRef.current) &&
            filteredTeamRadio.map((radio, index) => {
                const driver = driversRef?.current.find(driver => driver.driver_number === radio.driver_number);
                return (
                    <RadioCard 
                        radioMessage={radio} 
                        driver={driver}
                        className={index !== filteredTeamRadio.length - 1 ? "hidden" : ""}    
                    />
                );
            })}
        </div>
    );

};

export default TeamRadio;