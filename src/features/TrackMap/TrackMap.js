// import React, { useContext, useEffect, useRef, useState } from 'react';
// import Plot from 'react-plotly.js';
// import { SelectedSessionContext, DriversContext, LocationsContext, CurrentTimeContext } from '../../contexts/Contexts';
// import { GetCurrentLocation } from '../../utils/DriverDataProcessing';

// const TrackMap = () => {
//     const { drivers } = useContext(DriversContext);
//     const driversRef = useRef(drivers);

//     const { locations } = useContext(LocationsContext);
//     const locationsRef = useRef(locations);
    
//     const { currentTime } = useContext(CurrentTimeContext);
//     const currentTimeRef = useRef(currentTime);

//     const { selectedSession } = useContext(SelectedSessionContext);

//     // Sync refs with context values
//     useEffect(() => {
//         driversRef.current = drivers;
//     }, [drivers]);

//     useEffect(() => {
//         locationsRef.current = locations;
//     }, [locations]);

//     useEffect(() => {
//         currentTimeRef.current = currentTime;
//     }, [currentTime]);

//     // Initialize plot data with driver markers
//     const [data, setData] = useState([
//         {
//             type: 'scattermap',
//             lat: [],
//             lon: [],
//             mode: 'markers',
//             marker: { size: 10, color: 'red' },
//             text: [], // e.g., driver names
//         },
//     ]);

//     useEffect(() => {
//         const updateMapData = () => {
//             const driverLocations = GetCurrentLocation(driversRef.current, locationsRef.current, currentTimeRef.current);

//             if (driverLocations) {
//                 const newLats = Object.values(driverLocations).map(location => location.x); // assuming x is latitude
//                 const newLons = Object.values(driverLocations).map(location => location.y); // assuming y is longitude
//                 // const driverNames = Object.keys(driverLocations); // driver names or numbers
//                 // Update the plotly data array directly with new coordinates
//                 setData(prevData => [
//                     {
//                         ...prevData[0],
//                         lat: newLats,
//                         lon: newLons,
//                         // text: driverNames,
//                     },
//                 ]);
//             }
//         };
        
//         // Set an interval to periodically update map data
//         const mapIntervalID = setInterval(updateMapData, 30);

//         // Cleanup interval on component unmount
//         return () => clearInterval(mapIntervalID);
//     }, [selectedSession]);

//     return (
//         <Plot
//             className='plotly-map'
//             data={data}
//             layout={{
//                 map: {
//                     style: 'light',
//                     center: { lat: -23.7036, lon: -46.6997 },
//                     zoom: 1,//15
//                 },
//                 // transition: {
//                 //     duration: 200,
//                 //     easing: 'linear',
//                 // },
//                 autosize: true,
//                 width: '100%',
//                 margin: { l: 0, r: 0, t: 0, b: 0 },
//             }}
//             config={{ displayModeBar: false }}
//             useResizeHandler={true}
//             style={{ width: "100%", height: "100%" }}
//         />
//     );
// };

// export default TrackMap;