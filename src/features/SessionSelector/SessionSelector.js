import React, { useContext, useEffect, useState } from "react";
import { IsLiveContext, SelectedSessionContext, useIsLive } from "../../contexts/Contexts";
import { fetchSessionData } from "../../services/fetchSessionData";
import Dropdown from "../../components/ui/Dropdown";
import './SessionSelector.css'

const SessionSelector = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCircuit, setSelectedCircuit] = useState('');
    const [selectedSessionType, setSelectedSessionType] = useState('');

    const [circuits, setCircuits] = useState([]);
    const [sessionTypes, setSessionTypes] = useState([]);
    
    // const [filteredSessions, setFilteredSessions] = useState(null);

    const { selectedSession, setSelectedSession } = useContext(SelectedSessionContext);
    const { isLive, setIsLive } = useIsLive();

    // Load sessions from API on component mount
    useEffect(() => {
        const loadSessionData = async () => {
            const sessionData = await fetchSessionData();
            setSessions(sessionData);
        };

        loadSessionData();
    }, []);

    // Years dropdown options
    const years = [...new Set(sessions.map(session => session.year))];

    // Handle year change
    const handleYearChange = (event) => {
        const year = parseInt(event.target.value);
        setSelectedYear(year);
        setSelectedCircuit('');
        setSelectedSessionType('');
        // Circuits dropdown options, filtered by selectedYear
        const circuitsFiltered = 
            [...new Set(sessions.filter(session => session.year === year).map(session => session.circuit_short_name))]
        setCircuits(circuitsFiltered);
        setSelectedSession(null);
    };

    // Handle circuit change
    const handleCircuitChange = (event) => {
        const circuit = event.target.value;
        setSelectedCircuit(circuit);
        setSelectedSessionType('');
        // Session types dropdown options, filtered by selectedYear and selectedCircuit
        const sessionTypesFiltered = (selectedYear && circuit) 
            ? sessions
                .filter(session => session.year === selectedYear && session.circuit_short_name === circuit)
                .map(session => session.session_name)
            : [];
        setSessionTypes(sessionTypesFiltered);
        setSelectedSession(null);
    };

    // Handle session type change
    const handleSessionTypeChange = (event) => {
        const sessionType = event.target.value;
        setSelectedSessionType(sessionType);

        // Find and set the selected session
        const selected = sessions.find(session =>
            session.year === selectedYear &&
            session.circuit_short_name === selectedCircuit &&
            session.session_name === sessionType
        );
        setSelectedSession(selected || null);
        console.log(selected)
        setIsLive(false);
    };

    // Handle live button click
    const handleLiveButtonClick = () => {
        if (sessions.length) {
            const latestSession = sessions[sessions.length - 1];
            setSelectedYear(latestSession.year);
            setSelectedCircuit(latestSession.circuit_short_name);
            setSelectedSessionType(latestSession.session_name);
            setSelectedSession(latestSession);
            setIsLive(true);
        }
    };

    return (
        <div className="session-selector">
            <div className="session-selector-dropdowns container">
                <Dropdown // Year selector
                    className="dropdown-year"
                    options={years}
                    value={selectedYear}
                    placeholder="Year"
                    onChange={handleYearChange}
                />
                <Dropdown // Circuit selector
                    className="dropdown-circuit"
                    options={circuits}
                    value={selectedCircuit}
                    placeholder="Circuit"
                    onChange={handleCircuitChange}
                    disabled={!selectedYear}
                />
                <Dropdown // Session type selector
                    className="dropdown-session"
                    options={sessionTypes}
                    value={selectedSessionType}
                    placeholder="Session"
                    onChange={handleSessionTypeChange}
                    disabled={!selectedCircuit}
                />
            </div>
            <button onClick={handleLiveButtonClick} disabled={false}>
                Live
            </button>
        </div>
    );
};

export default SessionSelector;
