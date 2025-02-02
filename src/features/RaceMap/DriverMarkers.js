import { Source, Layer, Popup } from "react-map-gl";
import useDriverMarkerSource from "../../hooks/useDriverMarkerSource";
import { useEffect } from "react";
import "./DriverMarkers.css";


// Function to get CSS variable value
const getCSSVariable = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

const DriverMarkers = ({ drivers }) => {
    
    const driverMarkerSourceData = useDriverMarkerSource(drivers);

    const colorTextPrimary = getCSSVariable('--color-text-primary');

    // Log driverMarkerSourceData whenever it changes
    // useEffect(() => {
    //     console.log('Driver Marker Source Data:', driverMarkerSourceData);
    // }, [driverMarkerSourceData]);

    return <Source id="drivers" type="geojson" data={driverMarkerSourceData}>
        <Layer
            id="driver-markers"
            type="circle"
            paint={{
                'circle-radius': 10,
                'circle-color': ['get', 'teamColour'],
                'circle-opacity': 1,
            }}
        />
        {driverMarkerSourceData?.features?.map(driver => (
            driver.properties.isSelected && (
                <Popup
                    // key={driver.id}
                    longitude={driver.geometry.coordinates[0]}
                    latitude={driver.geometry.coordinates[1]}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="bottom"
                >
                    <div style={{ color: colorTextPrimary }}>
                        {driver.properties.driverNameAcronym}
                    </div>
                </Popup>
            )
        ))}
    </Source>

};

export default DriverMarkers;