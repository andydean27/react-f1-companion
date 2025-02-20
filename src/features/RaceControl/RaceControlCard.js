import { useEffect } from "react";
import "./RaceControl.css"
// import "../../assets/fia-footer-logo.png"

const RaceControlCard = ({control}) => {

    return (
        <div className="race-control-card" >
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
    "Flag": "⚑",
    "Other": <img src="./img/fia-footer-logo.png" alt="FIA Logo" style={{width: "42px"}}/>,
    "Drs": <img src="./img/fia-footer-logo.png" alt="FIA Logo" style={{width: "42px"}}/>,
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