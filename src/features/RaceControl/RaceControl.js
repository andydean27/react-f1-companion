import { useEffect, useState, useRef } from "react";
import { useCurrentTime } from "../../contexts/Contexts";
import RaceControlCard from "./RaceControlCard";
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
                (new Date(control.date).getTime() >= currentTimeRef.current - 30000)
            );

            setFilteredRaceControl(filtered);
        }, 3000);

        return () => clearInterval(interval);
    }, [raceControl]);

    return (
        <div className="race-control-container">
            {filteredRaceControl.map((control, index) => (
                <RaceControlCard control={control} />
            ))}
        </div>
    );
};

export default RaceControl;