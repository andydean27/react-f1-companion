import { useEffect, useState, useRef } from "react";
import { useCurrentTime } from "../../contexts/Contexts";
import RaceControlCard from "./RaceControlCard";
import FlagCard from "./FlagCard";
import "./RaceControl.css";

const RaceControl = ({ raceControl }) => {
    const [filteredRaceControl, setFilteredRaceControl] = useState([]);
    const [visibleControls, setVisibleControls] = useState([]);
    const { currentTime } = useCurrentTime();
    const currentTimeRef = useRef(currentTime);

    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            const filtered = raceControl.filter(control => 
                (new Date(control.date).getTime() <= currentTimeRef.current) &&
                (new Date(control.date).getTime() >= currentTimeRef.current - 180000) && 
                (control.flag !== "CLEAR")
            );

            // get last 5
            const lastFive = filtered.slice(-5);

            setFilteredRaceControl(lastFive);
        }, 3000);

        return () => clearInterval(interval);
    }, [raceControl]);

    const getControlType = (control) => {
        let ControlComponent;
        
        switch (control.category) {
            case "Flag":
                ControlComponent = FlagCard;
                break;
            case "Drs":
                ControlComponent = RaceControlCard;
                break;
            default:
                ControlComponent = RaceControlCard;
        }

        return ControlComponent;
    }

    return (
        <div className="race-control-container">
            {filteredRaceControl.map((control, index) => {
                const ControlComponent = getControlType(control);
                return (
                    <ControlComponent 
                        control={control} 
                        className={index !== filteredRaceControl.length - 1 ? "hidden" : ""}    
                    />
                );
            }
        )}

        </div>
    );
};

export default RaceControl;

