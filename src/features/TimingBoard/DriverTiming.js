import './TimingBoard.css';
import { compoundColourmap, segmentColourMap } from "../../config/colourMaps";
import { useState } from 'react';

const DriverTiming = ({ driver, expanded, sessionType, onClick, selected }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(false);
    };

    const handleMouseMove = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        if (!isDragging) {
            onClick(driver);
        }
    };

    return (sessionType === "Race" ?
        <tr className={`driver-timing ${sessionType === 'Race' ? 'race' : 'quali'} 
                                    ${expanded ? 'expanded' : ''}
                                    ${driver.fastest_lap?.lap_duration === driver.overall_fastest_lap?.lap_duration && !isNaN(driver.overall_fastest_lap?.lap_duration) ? 'overall-fastest-lap' : ''}
                                    ${selected ? 'selected' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            <td className="position">{driver.latest_position || '—'}</td>
            <DriverNameDisplay driver={driver}/>
            <PositionChangeDisplay driver={driver}/>
            <td className="interval">{driver.latest_interval?.interval || '—'}</td>
            <td className="gap_to_leader">{driver.latest_interval?.gap_to_leader || '—'}</td>
            {expanded && <>
                <td className="fastest_lap">{formatTimeLap(driver.fastest_lap?.lap_duration) || '—'}</td>
                <SectorDisplay sectorTime={driver.current_lap?.duration_sector_1} sectorSegments={driver.current_lap?.segments_sector_1} expanded={expanded}/>
                <SectorDisplay sectorTime={driver.current_lap?.duration_sector_2} sectorSegments={driver.current_lap?.segments_sector_2} expanded={expanded}/>
                <SectorDisplay sectorTime={driver.current_lap?.duration_sector_3} sectorSegments={driver.current_lap?.segments_sector_3} expanded={expanded}/>
            </>}
            
            <TyreDisplay driver={driver}/>            
        </tr>
        :
        <tr className={`driver-timing ${sessionType === 'Race' ? 'race' : 'quali'} 
                                    ${expanded ? 'expanded' : ''}
                                    ${driver.fastest_lap?.lap_duration === driver.overall_fastest_lap?.lap_duration ? 'overall-fastest-lap' : ''}
                                    ${selected ? 'selected' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            <td className="position">{driver.latest_position || '—'}</td>
            <td className="name_acronym">{driver.name_acronym || '—'}</td>
            <td className="fastest_lap">{formatTimeLap(driver.fastest_lap?.lap_duration) || '—'}</td>
            <SectorDisplay sectorTime={driver.current_lap?.duration_sector_1} sectorSegments={driver.current_lap?.segments_sector_1} expanded={expanded}/>
            <SectorDisplay sectorTime={driver.current_lap?.duration_sector_2} sectorSegments={driver.current_lap?.segments_sector_2} expanded={expanded}/>
            <SectorDisplay sectorTime={driver.current_lap?.duration_sector_3} sectorSegments={driver.current_lap?.segments_sector_3} expanded={expanded}/>
            <TyreDisplay driver={driver}/>     
            <td className="is_pit_out_lap">{driver.current_lap?.is_pit_out_lap ? 'Out' : '—'}</td>
        </tr>
    );
};

export default DriverTiming;

const DriverNameDisplay = ({driver}) => {
    return (
        <td>
            <div className="driver-name">
                <div 
                    className="team-icon"
                    style={{ backgroundColor: `#${driver.team_colour}` || '#ccc' }}
                />
                <span className="name_acronym">
                    {driver.name_acronym || '—'}
                </span>
            </div>
        </td>
    )
}

const PositionChangeDisplay = ({driver}) => {
    return (
        <td 
            className="position_change" 
            style={{ 
                color: driver.position_change > 0 
                    ? '#4bdd49' 
                    : driver.position_change < 0 
                    ? 'red' 
                    : 'grey' 
            }}
        >
            {driver.position_change > 0 && (
                <>
                    &#9650; {Math.abs(driver.position_change)}
                </>
            )}
            {driver.position_change < 0 && (
                <>
                    &#9660; {Math.abs(driver.position_change)}
                </>
            )}
            {driver.position_change === 0 && <>&#8212;</>}
        </td>
    )
};

const SectorDisplay = ({ sectorTime, sectorSegments, expanded, className = "" }) => {
    return (
        <td>
            <div className={`sector-display ${className}`}>
                <div className="segment-box-container">
                    {expanded && 
                    sectorSegments?.map((segment, index) => (
                        <div
                            key={index}
                            className="segment-box"
                            style={{ backgroundColor: segmentColourMap[segment] || '#ccc' }}
                        />
                    ))}
                </div>
                <span className="sector-time">{sectorTime || "0.000"}</span>
            </div>
        </td>
    );
};

const TyreDisplay = ({driver}) => {
    return (
    <td>
        <div className="tyre">
            <span 
                className="compound" 
                style={{
                    color: compoundColourmap[driver.current_stint?.compound] || '#ccc'
                }}
            >
                {driver.current_stint?.compound?.[0] || '—'}
            </span>
            <span className="tyre_age">
                {(driver.current_stint?.tyre_age_at_start + (driver.current_lap?.lap_number - driver.current_stint?.lap_start)) || '0'}
            </span>
        </div>
    </td>
    )
};

const formatTimeLap = (timeInSeconds) => {
    if (timeInSeconds == null || isNaN(timeInSeconds)) return '—';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds % 1) * 1000);

    return `${String(minutes).padStart(2, '')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
};

const formatTimeInterval = (timeInSeconds) => {
    if (timeInSeconds == null || isNaN(timeInSeconds)) return '—';

    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds % 1) * 1000);

    return `${String(seconds).padStart(3, '')}.${String(milliseconds).padStart(3, '0')}`;
};
