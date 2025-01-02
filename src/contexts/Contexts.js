import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";
import { createContext, useCallback, useContext, useState } from "react";

export const SelectedSessionContext = createContext(null);
const IsLiveContext = createContext(false);

const CurrentTimeContext = createContext(null);
const PlaybackContext = createContext();

const DriversContext = createContext();

export const AppProvider = ({children}) => {
    const [selectedSession, setSelectedSession] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const [drivers, setDrivers] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(null);

    return (
        <SelectedSessionContext.Provider value={{selectedSession,setSelectedSession}}>
        <DriversContext.Provider value = {{drivers, setDrivers}}>
        <IsLiveContext.Provider value = {{isLive, setIsLive}}>
        <CurrentTimeContext.Provider value = {{currentTime, setCurrentTime}}>
        <PlaybackContext.Provider value = {{isPlaying, setIsPlaying}}>
            {children}
        </PlaybackContext.Provider>
        </CurrentTimeContext.Provider>
        </IsLiveContext.Provider>
        </DriversContext.Provider>
        </SelectedSessionContext.Provider>
    );
};

export const usePlayback = () => useContext(PlaybackContext);
export const useCurrentTime = () => useContext(CurrentTimeContext);
export const useDrivers = () => useContext(DriversContext);
export const useIsLive = () => useContext(IsLiveContext);