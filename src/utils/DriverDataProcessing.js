import { transform2DCoords, applyTransformationMatrix } from "./MathFunctions";

export const GetCurrentLocation = (drivers, locations, currentTime, trackData) => {
    if (!drivers || !locations || !currentTime || !trackData) {
        return null;
    }

    const timeWindow = 1000; // milliseconds around currentTime ± 1s

    return drivers.map(driver => {
        const driverNumber = driver.driver_number;

        // Filter locations for this driver to within ± 1 seconds of the currentTime
        const driverLocationsFiltered = locations
            .filter(location => 
                location.driver_number === driverNumber &&
                Math.abs(new Date(location.date).getTime() - currentTime) <= timeWindow
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort in ascending order
        

        // Get the two closest locations around the currentTime if available
        const latestLocation = driverLocationsFiltered.find(loc => new Date(loc.date).getTime() >= currentTime);
        const previousLocation = driverLocationsFiltered.reverse().find(loc => new Date(loc.date).getTime() <= currentTime);
        
        // Check if previous and latest locations are the same
        const isSameLocation = previousLocation && latestLocation &&
        new Date(previousLocation.date).getTime() === new Date(latestLocation.date).getTime();

        // Interpolate x and y values if both locations are available and different
        const x_interp = previousLocation && latestLocation && !isSameLocation
        ? interpolate(
            previousLocation.x,
            latestLocation.x,
            new Date(previousLocation.date).getTime(),
            new Date(latestLocation.date).getTime(),
            currentTime
        )
        : (latestLocation ? latestLocation.x : null);

        const y_interp = previousLocation && latestLocation && !isSameLocation
        ? interpolate(
            previousLocation.y,
            latestLocation.y,
            new Date(previousLocation.date).getTime(),
            new Date(latestLocation.date).getTime(),
            currentTime
        )
        : (latestLocation ? latestLocation.y : null);
        
        // Transform coordinates
        // const [x_final, y_final] = transform2DCoords([x_interp, y_interp], trackData.translation, trackData.scale, trackData.rotation);
        const [x_final, y_final] = applyTransformationMatrix([x_interp, y_interp], trackData.scale, trackData.transformation);

        
        return {
            ...driver,
            x: x_final,
            y: y_final
        };
    });
};


// Interpolation function for reference
const interpolate = (start, end, startTime, endTime, currentTime) => {
    if (start === null || end === null) return null;
    const progress = (currentTime - startTime) / (endTime - startTime);
    return start + progress * (end - start);
};


// const interpolate = (x1, x2, t1, t2, t) => {
//     return (x1 + (x2-x1)*(t-t1)/(t2-t1));
// };

// export const GetCurrentLocation = (drivers, locations, currentTime) => {
//     const driverLocations = {};

//     if (!drivers || !locations || !currentTime){
//         return null;
//     }

//     drivers.forEach(driver => {
//         const driverNumber = driver.driver_number;

//         // Filter locations for this driver and sort by date in descending order
//         const driverLocationsSorted = locations
//             .filter(location => location.driver_number === driverNumber && (new Date(location.date).getTime()) < currentTime)
//             .sort((a, b) => new Date(b.date) - new Date(a.date));


//         // Get the latest location if available
//         if (driverLocationsSorted.length > 0) {
//             const latestLocation = driverLocationsSorted[0];
//             const previousLocation = driverLocationsSorted[1];
//             const x_interp = interpolate(previousLocation.x, latestLocation.x, new Date(previousLocation.date).getTime(), new Date(latestLocation.date).getTime(), currentTime);
//             const y_interp = interpolate(previousLocation.y, latestLocation.y, new Date(previousLocation.date).getTime(), new Date(latestLocation.date).getTime(), currentTime);
//             driverLocations[driverNumber] = { x: x_interp/100, y: y_interp/100 };
//         } else {
//             // Optional: Set default location if no valid location is found for the currentTime
//             driverLocations[driverNumber] = { x: null, y: null };
//         }
//     });

//     return driverLocations;
// };
/**
 * Generalized function to process a dataset and update a target object with specific data
 * based on a comparison property and a time constraint.
 *
 * @param {Object} targetObject - The target object to update (e.g., drivers).
 * @param {Array} dataset - The dataset to process (e.g., laps, intervals).
 * @param {String} comparisonProperty - The property to compare (e.g., 'lap_duration', 'gap_to_leader').
 * @param {String} action - The action to perform: 'smallest', 'largest', 'latest'.
 * @param {Number} currentTime - The current time for filtering (optional).
 * @param {String} dateProperty - The property name that contains the date (e.g., 'date', 'date_start').
 * @param {Function} filterFn - An optional filter function for dataset entries.
 * @param {Function} transformFn - An optional function to transform the dataset entry before adding it.
 */
export const updateTargetObject = (
    targetObject,
    dataset,
    comparisonProperty,
    action,
    currentTime = null,
    dateProperty = 'date',
    filterFn = () => true,
    transformFn = (item) => item,
    log = false
  ) => {
    const comparisonMap = {};
    
    // Do nothing if targetObject is empty
    if (!targetObject) return;

    dataset.forEach((item) => {
        const { driver_number } = item;
        const comparisonValue = item[comparisonProperty];
        const itemTime = new Date(item[dateProperty]).getTime();

        // Skip items that don't pass the filter function or the time constraint
        if (!filterFn(item) || (currentTime && itemTime > currentTime)) return;
  
        // Determine if the item should replace the current entry in comparisonMap
        if (!comparisonMap[driver_number]) {
            comparisonMap[driver_number] = item;
        } else {
            const existingValue = comparisonMap[driver_number][comparisonProperty];
            const replace = {
            smallest: comparisonValue < existingValue,
            largest: comparisonValue > existingValue,
            latest: itemTime > new Date(comparisonMap[driver_number][dateProperty]).getTime()
            }[action];
    
            if (replace) {
            comparisonMap[driver_number] = item;
            }
        }
    });

    // Update the targetObject with the comparisonMap
    targetObject.forEach((item, index) => {
        if (comparisonMap[item['driver_number']]) {
            const updatedItem = transformFn(comparisonMap[item['driver_number']]);
            targetObject[index] = { 
                ...item,  // Retain existing properties of the item
                ...updatedItem // Override with properties from updatedItem
            };
        }
    });

    // Object.keys(comparisonMap).forEach((driverNumber) => {
    //   if (targetObject[driverNumber]) {
    //     const updatedItem = transformFn(comparisonMap[driverNumber]);
    //     targetObject[driverNumber] = {
    //       ...targetObject[driverNumber],
    //       ...updatedItem,
    //     };
    //   }
    // });
  
    return targetObject;
  };

  /**
 * Add the overall fastest lap to each driver.
 * @param {Array} updatedDrivers - Array of driver objects.
 * @returns {Array} The updated array of drivers with the fastest lap highlighted.
 */
export const addFastestLapToDrivers = (updatedDrivers) => {
    if (!Array.isArray(updatedDrivers) || updatedDrivers.length === 0) {
        console.warn("No drivers data provided.");
        return updatedDrivers;
    }

    // Find the driver with the fastest lap
    let fastestLapTime = Infinity;
    // let fastestDriverNumber = null;
    let overall_fastest_lap = null;

    updatedDrivers.forEach(driver => {
        if (driver.fastest_lap?.lap_duration < fastestLapTime) {
            fastestLapTime = driver.fastest_lap.lap_duration;
            // fastestDriverNumber = driver.driver_number;
            overall_fastest_lap = driver.fastest_lap;
        }
    });

    // Add the fastest lap property to each driver
    return updatedDrivers.map(driver => ({
        ...driver,
        overall_fastest_lap: overall_fastest_lap
    }));
};

  