import React, { useMemo } from "react";
import "./Waveform.css";

// UI component that animates a random waveform
const Waveform = ({ n, className = "" }) => {
    // Memoize the frequency value to ensure it remains consistent across re-renders
    const frequency = useMemo(() => (Math.random() * 6) + 3, []);

    // Memoize the animation delays to ensure they remain consistent across re-renders
    const animationDelays = useMemo(() => Array(n).fill(0).map(() => Math.random() * 1), [n]);

    const barHeight = (i) => {
        // determine bar height from random sine waves
        // normalise i to [0, 2pi]
        const x = i / n * 2 * Math.PI;

        return (
            `${(Math.sin(x / 2)) * ((Math.cos(x * frequency) + 1) / 2) * 100}%`
        );
    };

    return (
        <div className={`waveform`}>
            {Array(n).fill(0).map((_, i) => (
                <div
                    className={`waveform-bar ${className}`}
                    key={i}
                    style={{
                        animationDelay: `${animationDelays[i]}s`,
                        '--bar-height': barHeight(i),
                        height: barHeight(i)
                    }}
                />
            ))}
        </div>
    );
}

export default Waveform;