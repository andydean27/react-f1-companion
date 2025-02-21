import { useEffect } from "react";
import "./RaceControl.css"
// import "../../assets/fia-footer-logo.png"

const RaceControlCard = ({control, className=""}) => {

    return (
        <div className={`race-control-card ${className}`} >
            <div className="race-control-icon container" style={flagColourMap[control.flag]}>
                <span>{categoryMap[control.category]}</span>
            </div>
            <div className="race-control-details container">
                <span className="control">{control.category === "Flag" ? "Flag" : "Race Control"}</span>
                <span className="time">{control.date}</span>
                <span className="message">{control.message}</span>
            </div>
        </div>
    );

};

export default RaceControlCard;

const categoryMap = {
    "Flag": (
        <svg 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="icon-flag"
        >
            <path d="M6,13.3l1.21.54A7.22,7.22,0,0,0,12.8,14a5.17,5.17,0,0,1,4.23.18l3,1.48V5.38l-2.08-1a7.18,7.18,0,0,0-5.87-.24A5.2,5.2,0,0,1,8,4L6,3.11V2H4V22H6Z"/>
        </svg>
    ),
    "Other": <img src="./img/fia-footer-logo.png" alt="FIA Logo" className="img-fia"/>,
    "Drs": <img src="./img/fia-footer-logo.png" alt="FIA Logo" className="img-fia"/>,
}

const flagColourMap = {
    "GREEN": {
        backgroundColor: "#69ca4980",
        borderTopColor: "#69ca49",
        borderLeftColor: "#69ca49",
        borderBottomColor: "#69ca491A",
        borderRightColor: "#69ca491A"
    },
    "YELLOW": {
        backgroundColor: "#fffc5880",
        borderTopColor: "#fffc58",
        borderLeftColor: "#fffc58",
        borderBottomColor: "#fffc581A",
        borderRightColor: "#fffc581A"
    },
    "RED": {
        backgroundColor: "#ea433780",
        borderTopColor: "#ea4337",
        borderLeftColor: "#ea4337",
        borderBottomColor: "#ea43371A",
        borderRightColor: "#ea43371A"
    },
    "DOUBLE YELLOW": {
        backgroundColor: "#fffc5880",
        borderTopColor: "#fffc58",
        borderLeftColor: "#fffc58",
        borderBottomColor: "#fffc581A",
        borderRightColor: "#fffc581A"
    },
    "BLUE": {
        backgroundColor: "#3e8acd80",
        borderTopColor: "#3e8acd",
        borderLeftColor: "#3e8acd",
        borderBottomColor: "#3e8acd1A",
        borderRightColor: "#3e8acd1A"
    },
    "CLEAR": {
        backgroundColor: "#69ca4980",
        borderTopColor: "#69ca49",
        borderLeftColor: "#69ca49",
        borderBottomColor: "#69ca491A",
        borderRightColor: "#69ca491A"
    },
    "CHEQUERED": {
        backgroundColor: "black",
        borderTopColor: "black",
        borderLeftColor: "black",
        borderBottomColor: "black",
        borderRightColor: "black"
    },
    null : {
        backgroundColor: "#0f2d5c80",
        borderTopColor: "#0f2d5c",
        borderLeftColor: "#0f2d5c",
        borderBottomColor: "#0f2d5c1A",
        borderRightColor: "#0f2d5c1A"
    }
};