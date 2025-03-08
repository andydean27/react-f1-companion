/** 
 * 
*/
export const generateTimeMarkers = (session, laps, raceControl) => {
    // Generate time markers depending on session type

    let markers = null;
    // Return null is any of the required data is missing
    if (!session || !laps || !raceControl) {
        return null;
    }

    // Filter race control data to get only the session time
    const raceControlFiltered = raceControl.filter((item) => item.date >= session.date_start && item.date <= session.date_end);

    // If session type is "Race"
    if (session.session_type === "Race"){
        // Get the first occurence of each lap_number, regardless of driver number
        if (laps) {
            // Sort laps by date_start
            laps.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
            
            // Get the first occurence of each lap_number, regardless of driver number
            markers = laps.filter((lap, index, self) => 
                index === self.findIndex((t) => (
                    t.lap_number === lap.lap_number
                ))
            ).map((lap) => {
                return {
                    time: new Date(lap.date_start).getTime(),
                    lap_number: lap.lap_number,
                    style: {
                        height: lap.lap_number % 5 === 0 ? '10px' : '5px',
                    }
                };
            });

            // Append first green flag time to markers as start of lap 1
            markers.push({
                time: new Date(raceControlFiltered.find((item) => item.flag === "GREEN")?.date).getTime(),
                lap_number: 1,
                style: {
                    height: '10px',
                }
            });

            // Append last chequered flag time to markers as end of last lap
            markers.push({
                time: new Date(raceControlFiltered.find((item) => item.flag === "CHEQUERED")?.date).getTime(),
                lap_number: 0,
                style: {
                    height: '10px',
                }
            });

            // Sort markers by time
            markers.sort((a, b) => a.time - b.time);

            return markers;
        }
    } else {
        // all other sessions mark green and checkered flags from race control
        if (raceControl){
            markers = raceControlFiltered.filter((item) => item.flag === "GREEN" || item.flag === "CHEQUERED").map((item) => {
                return {
                    time: new Date(item.date).getTime(),
                    hover_label: item.flag,
                    style: {
                        height: '10px',
                    }
                };
            });

            // Sort markers by time
            markers.sort((a, b) => a.time - b.time);

            return markers;
        }
    }
}

export const generateSectionMarkers = (session, laps, raceControl) => {
    // Generate section markers depending on session type
    let markers = null;
    // Return null is any of the required data is missing
    if (!session || !laps || !raceControl) {
        return null;
    }

    // Get last chequered flag time (there could be multiple in a qualifying session)
    const lastChequeredFlagTime = new Date(Math.max(...raceControl.filter((item) => item.flag === "CHEQUERED").map((item) => new Date(item.date).getTime())));

    // Filter race control data to only flags
    const raceControlFiltered = raceControl.filter((item) => item.category==="Flag" && 
                                                             item.date >= session.date_start && 
                                                             new Date(item.date).getTime() <= lastChequeredFlagTime &&
                                                             item.driver_number === null); //Ignore driver specific flags

    // For each flag get the time of the flag, the next flag and the colour
    markers = raceControlFiltered.map((item, index, self) => {
        if (index === self.length - 1) { 
            return {
                start_time: new Date(item.date).getTime(),
                end_time: new Date(session.date_end).getTime(),
                style: flagColourMap[item.flag] || {backgroundColor: "black"},
            }
        };

        const nextItem = self[index + 1];
        return {
            start_time: new Date(item.date).getTime(),
            end_time: new Date(nextItem.date).getTime(),
            style: flagColourMap[item.flag] || {backgroundColor: "transparent"},
        };
    });

    return markers;
}

const flagColourMap = {
    "GREEN": {background: "linear-gradient(to bottom, green, transparent)"},
    "YELLOW": {background: "linear-gradient(to bottom, yellow, transparent)"},
    "RED": {background: "linear-gradient(to bottom, red, transparent)"},
    "DOUBLE YELLOW": {background: "linear-gradient(to bottom, yellow, transparent)"},
    "CLEAR": {background: "linear-gradient(to bottom, green, transparent)"},
    "CHEQUERED": {background: "linear-gradient(to bottom, transparent, transparent)"},
};