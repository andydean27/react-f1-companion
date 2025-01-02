import React from 'react';
import Plot from 'react-plotly.js';
import { getTrackCoordinates } from '../../../config/trackCoordinates';

import './RaceMap.css'

const RaceMap = ({ onTrackSelect, sessions }) => {
    // Generate map data with coordinates lookup
    const mapData = sessions.reduce((acc, session) => {
        if (!acc.some(loc => loc.location === session.location)) {
            const coordinates = getTrackCoordinates(session.location);
            acc.push({
                location: session.location,
                lat: coordinates.lat,
                lon: coordinates.lon,
                sessionType: session.session_type,
            });
        }
        return acc;
    }, []);

    const handleMarkerClick = (track) => {
        onTrackSelect(track);
    };

    return (
        // <div className='map-container'>
            <Plot
                className='plotly-map'
                data={[{
                    type: 'scattermap',
                    lat: mapData.map(loc => loc.lat),
                    lon: mapData.map(loc => loc.lon),
                    mode: 'markers',
                    marker: {
                        size: 14,
                        color: 'blue'
                    },
                    text: mapData.map(loc => loc.location),
                    hoverinfo: 'text'
                }]}
                layout={{
                    map: {
                        // style: 'open-street-map',
                        center: { lat: 0, lon: 0 },
                        zoom: 0.5
                    },
                    autosize: true,
                    // width: 800, // Set the width of the map plot
                    width: '100%',
                    // height: 500, // Set the height of the map plot
                    margin: { l: 0, r: 0, t: 0, b: 0 }, // Remove margins to maximize map area
                }}
                useResizeHandler={true} // Resizes the map to fit within container dimensions
                style={{ width: "100%", height: "100%" }} // Makes Plotly responsive to parent container size
                onClick={(event) => handleMarkerClick(event.points[0].text)}
            />
        // </div>
    );
};

export default RaceMap;
