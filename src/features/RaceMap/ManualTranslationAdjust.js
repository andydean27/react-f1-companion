import { useState, useEffect } from "react";

const ManualTranslationAdjust = () => {
    const [translation, setTranslation] = useState({
        translation: [0, 0],
        scale: 1,
        rotation: 0
    });



    const handleLonChange = (e) => {
        const newTranslation = translation;
        translation.translation = [Number(e.target.value)/1000, translation.translation[1]];
        setTranslation(newTranslation);
    }
    const handleLatChange = (e) => {
        const newTranslation = translation;
        translation.translation = [translation.translation[0], Number(e.target.value)/1000];
        setTranslation(newTranslation);
    }
    const handleScaleChange = (e) => {
        const newTranslation = translation;
        translation.scale = Number(e.target.value)/1000;
        setTranslation(newTranslation);
    }
    const handleRotationChange = (e) => {
        const newTranslation = translation;
        translation.rotation = Number(e.target.value)/1000;
        setTranslation(newTranslation);
    }

    return (
        <div style={{"position":"absolute", "right":"0px", "top": "0px"}}>
            <div>
                <span>lon</span>
                <input
                    type="range"
                    min={-90000}
                    max={90000}
                    value={translation.translation[0]}
                    onChange={handleLonChange}
                />
            </div>
            <div>
                <span>lat</span>
                <input
                    type="range"
                    min={-90000}
                    max={90000}
                    value={translation.translation[1]}
                    onChange={handleLatChange}
                />
            </div>
            <div>
                <span>scale</span>
                <input
                    type="range"
                    min={0}
                    max={2000}
                    value={translation.translation.scale}
                    onChange={handleScaleChange}
                />
            </div>
            <div>
                <span>rotation</span>
                <input
                    type="range"
                    min={0}
                    max={360000}
                    value={translation.translation.rotation}
                    onChange={handleRotationChange}
                />
            </div>
        </div>
    )

};

export default ManualTranslationAdjust