

const FlagCard = ({ control, className = "" }) => {

    return (
        <div className={`race-control-card flag ${className}`} >
            <div className="flag-card-top container" style={flagColourMap[control.flag]}>
                <svg 
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-flag"
                >
                    { control.flag === "CHEQUERED" ?
                    <path d="M219.6,40.8a8.2,8.2,0,0,0-8.4.8c-28.3,21.2-52.3,11-80-.9s-60.3-25.9-96,.9A8,8,0,0,0,32,48h0V216a8,8,0,0,0,16,0V172.1c26.9-18.1,50.1-8.2,76.8,3.3,16.3,6.9,33.8,14.4,52.6,14.4,13.8,0,28.3-4,43.4-15.4A8.1,8.1,0,0,0,224,168V48A8.2,8.2,0,0,0,219.6,40.8ZM156,170.3V116.8c-18.9-5.4-37.1-15.9-56-21.3v53.6c-16.3-4.2-33.6-4.8-52,4.5V100.8c18.3-10.6,35.4-10,52-5.3V45.7a243.3,243.3,0,0,1,24.8,9.7c10,4.2,20.4,8.7,31.2,11.5v49.9c16.6,4.7,33.7,5.3,52-5.3v52.4C189.7,176.2,173.1,175.6,156,170.3Z"/>
                    :
                    <path d="M219.6,40.8a8.2,8.2,0,0,0-8.4.8c-28.3,21.2-52.3,11-80-.9s-60.3-25.9-96,.9h-.1l-.4.3-.2.2-.3.3-.3.3-.2.3-.3.3c0,.1-.1.2-.2.3l-.2.4c0,.1-.1.2-.1.3a.8.8,0,0,0-.2.4c-.1.1-.1.2-.2.4s-.1.2-.1.3-.1.3-.1.4-.1.2-.1.3-.1.3-.1.4V47c0,.1-.1.3-.1.4V216a8,8,0,0,0,16,0V172.1c26.9-18.1,50.1-8.2,76.8,3.3,16.3,6.9,33.8,14.4,52.6,14.4,13.8,0,28.3-4,43.4-15.4A8.1,8.1,0,0,0,224,168V48A8.2,8.2,0,0,0,219.6,40.8Z"/>
                    }
                </svg>
                <span className="title">{flagTitleMap[control.flag]}</span>
            </div>
            <div className="flag-card-bottom container">
                <span className="message">{control.message}</span>
            </div>
        </div>
    );
};

export default FlagCard;

const flagTitleMap = {
    "GREEN": "Clear",
    "YELLOW": "Incident",
    "RED": "Session Stopped",
    "DOUBLE YELLOW": "Incident",
    "BLUE": "Blue Flag",
    "CLEAR": "Clear",
    "CHEQUERED": "Session Ended",
    null : ""
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