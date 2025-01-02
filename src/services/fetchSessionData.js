
export const fetchOpenf1Data = async (
    endPoint,
    sessionKey,
    currentTime = null,
    buffer = 10000,
    dateString = 'date',
    log = false,
    maxRetries = 3,
    retryDelay = 100
) => {
    const baseURL = 'https://api.openf1.org/v1/';

    let attempts = 0;

    // if currentTime is set then generate date filtering string
    let dateAttribute = '';
    if (currentTime){
        const startTime = new Date(currentTime - buffer / 2).toISOString();
        const endTime = new Date(currentTime + buffer).toISOString();
        dateAttribute = `&${dateString}>${startTime}&${dateString}<${endTime}`
    }

    const fetchURL = baseURL + `${endPoint}?session_key=${sessionKey}` + dateAttribute

    while (attempts < maxRetries) {
        try {
            // Log attempt number
            if (log) {
                console.log(`[Attempt ${attempts + 1}] Fetching ${endPoint} data from: ${fetchURL}`);
            }

            const fetchStart = performance.now(); // Start timing the fetch
            const response = await fetch(fetchURL);
            const fetchEnd = performance.now(); // End timing the fetch
            
            const timeToFetch = (fetchEnd - fetchStart).toFixed(2); // Calculate time in milliseconds

            // Log the time taken to fetch the API
            if (log) {
                console.log(`[Attempt ${attempts + 1}] API fetch time: ${timeToFetch}ms`);
            }

            // Check for response errors
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check if data is null or empty
            if (data && data.length > 0) {
                console.log(`[Success] Retrieved ${data.length} ${endPoint} records in ${timeToFetch}ms.`);
                return data;
            } else {
                throw new Error(`Empty or null response received on attempt ${attempts + 1}.`);
            }
        }
        catch (error) {
            console.error(`[Attempt ${attempts + 1}] Error fetching ${endPoint} data:`, error.message);
            
            // Retry logic
            if (attempts < maxRetries - 1) {
                console.log(`Retrying in ${retryDelay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
                console.error(`[Failure] Max retries reached. Unable to fetch ${endPoint} data.`);
            }
        }

        attempts++;
    }
    // Return null if all retries fail
    return null;

}

export const fetchSessionData = async () => {
    try {
        const response = await fetch('https://api.openf1.org/v1/sessions');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching race data:', error);
    }
};

export const fetchDriverData = async (session_key) => {
    try {
        const response = await fetch('https://api.openf1.org/v1/drivers?session_key='+session_key);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching driver data:', error)
    }
};


