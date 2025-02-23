import { useEffect } from "react";
import "./RaceControl.css";

const RaceControlCard = ({control, className=""}) => {

    const categoryColour = () => {
        switch (control.category) {
            case "SafetyCar":
                return {
                    backgroundColor: "#ff800080",
                    borderTopColor: "#ff8000",
                    borderLeftColor: "#ff8000",
                    borderTightColor: "#ff80001A",
                    borderBottomColor: "#ff80001A"
                }
            default:
                return {
                    backgroundColor: "#0f2d5c80",
                    borderTopColor: "#0f2d5c",
                    borderLeftColor: "#0f2d5c",
                    borderBottomColor: "#0f2d5c1A",
                    borderRightColor: "#0f2d5c1A"
                }
            }
    };

    const categoryIcon = () => {
        switch (control.category) {
            case "SafetyCar":
                return (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="icon-safety-car"
                    >
                        <path d="M447.68,220.78a16,16,0,0,0-1-3.08l-37.78-88.16C400.19,109.17,379,96,354.89,96H157.11c-24.09,0-45.3,13.17-54,33.54L65.29,217.7A15.72,15.72,0,0,0,64,224V400a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V384H384v16a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V224A16.15,16.15,0,0,0,447.68,220.78ZM144,320a32,32,0,1,1,32-32A32,32,0,0,1,144,320Zm224,0a32,32,0,1,1,32-32A32,32,0,0,1,368,320ZM104.26,208l28.23-65.85C136.11,133.69,146,128,157.11,128H354.89c11.1,0,21,5.69,24.62,14.15L407.74,208Z"/>
                    </svg>
                );
            default:
                return (
                    <img src="./img/fia-footer-logo.png" alt="FIA Logo" className="img-fia"/>
                );
            }

    };

    return (
        <div className={`race-control-card ${className}`} >
            <div className="race-control-icon container" style={categoryColour()}>
                <span>{categoryIcon()}</span>
            </div>
            <div className="race-control-details container">
                <span className="title">{control.category === "SafetyCar" ? "Safety Car" : "Race Control"}</span>
                <span className="message">{control.message}</span>
            </div>
        </div>
    );

};

export default RaceControlCard;

