import './TimingBoard.css';
import { segmentColourMap } from "../../config/colourMaps";

const DriverCard = ({ driver, expanded, sessionType }) => {
    return (
        <div className={`driver-card ${expanded ? 'expanded' : ''}`}>
            <span className="position">{driver.latest_position || '-'}</span>
            <span className="name_acronym">{driver.name_acronym || '-'}</span>
            <span className="interval">{formatTimeInterval("+"+driver.latest_interval?.interval) || '-'}</span>
            <span className="gap_to_leader">{formatTimeInterval("+"+driver.latest_interval?.gap_to_leader) || '-'}</span>

            {expanded && (
                <>
                    <span className="fastest_lap">{formatTimeLap(driver.fastest_lap?.lap_duration) || '-'}</span>
                    <SectorDisplay
                        sectorTime={formatTimeInterval(driver.current_lap?.duration_sector_1) || '-'}
                        sectorSegments={driver.current_lap?.segments_sector_1 || []}
                        className="sector-1"
                    />
                    <SectorDisplay
                        sectorTime={formatTimeInterval(driver.current_lap?.duration_sector_2) || '-'}
                        sectorSegments={driver.current_lap?.segments_sector_2 || []}
                        className="sector-2"
                    />
                    <SectorDisplay
                        sectorTime={formatTimeInterval(driver.current_lap?.duration_sector_3) || '-'}
                        sectorSegments={driver.current_lap?.segments_sector_3 || []}
                        className="sector-3"
                    />
                </>
            )}
        </div>
    );
};

export default DriverCard;

const SectorDisplay = ({ sectorTime, sectorSegments, className = "" }) => {
    return (
        <div className={`sector-display ${className}`}>
            <span className="sector-time">{sectorTime}</span>
            <div className="segment-box-container">
                {sectorSegments.map((segment, index) => (
                    <div
                        key={index}
                        className="segment-box"
                        style={{ backgroundColor: segmentColourMap[segment] || '#ccc' }}
                    />
                ))}
            </div>
        </div>
    );
};

const formatTimeLap = (timeInSeconds) => {
    if (timeInSeconds == null || isNaN(timeInSeconds)) return '-';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds % 1) * 1000);

    return `${String(minutes).padStart(2, '')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
};

const formatTimeInterval = (timeInSeconds) => {
    if (timeInSeconds == null || isNaN(timeInSeconds)) return '-';

    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds % 1) * 1000);

    return `${String(seconds).padStart(2, '')}.${String(milliseconds).padStart(3, '0')}`;
};
