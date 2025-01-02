import React from "react";
import { useContext, useEffect, useState } from "react";
import { SelectedYearContext, SelectedTrackContext } from "../../../contexts/Contexts";
import Dropdown from "../../../components/ui/Dropdown";
import RaceMap from "./RaceMap";
import { fetchSessionData } from "../../../services/fetchSessionData";

import "./SelectionForm.css"


const SelectionForm = () => {
    // const [selectedYear, setSelectedYear] = useState("2023");
    // const [selectedTrack, setSelectedTrack] = useState("");
    const { selectedYear, setSelectedYear } = useContext(SelectedYearContext);
    const { selectedTrack, setSelectedTrack } = useContext(SelectedTrackContext);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);

    // Load sessions from API
    useEffect(() => {
        const loadSessionData = async () => {
            const data = await fetchSessionData();
            setSessions(data);

            // Extract unique years for the dropdown
            const years = Array.from(new Set(data.map(session => session.year)));
            setAvailableYears(years);

            // Set default year to the latest year available
            if (years.length > 0) setSelectedYear(years[0]);
        };

        loadSessionData();
    }, []);

    // Filter sessions based on selected year
    useEffect(() => {
        if (selectedYear) {
            const sessionsByYear = sessions.filter(session => session.year === selectedYear);
            setFilteredSessions(sessionsByYear);
        }
    }, [selectedYear]);

    // Handle year change
    const handleYearChange = (value) => {
        setSelectedYear(parseInt(value, 10));
    };

    // Handle track selection
    const handleTrackSelect = (track) => {
        setSelectedTrack(track);
        console.log("Selected Track:", track);
    };

    return (
        <div className="selectionform-container">
            <div className="dropdown-container">
                <Dropdown
                    options = {availableYears}
                    label = ""
                    onChange = {handleYearChange}
                />
            </div>
            <div className="race-map-container">
                <RaceMap
                    sessions = {filteredSessions}
                    onTrackSelect={handleTrackSelect}
                />
            </div>
        </div>
    );
};

export default SelectionForm