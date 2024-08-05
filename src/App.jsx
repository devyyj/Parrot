import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

// Helper functions
const waitUntil = (targetTime) => {
    return new Promise((resolve) => {
        const checkTime = () => {
            if (new Date() >= targetTime) {
                resolve();
            } else {
                setTimeout(checkTime, 1000); // Check every second
            }
        };
        checkTime();
    });
};

const getRandomDelay = () => Math.floor(Math.random() * 60) + 1; // Random delay between 1 and 60 seconds

const App = () => {
    const [startTime, setStartTime] = useState("07:00:00");
    const [endTime, setEndTime] = useState("01:00:00");
    const [playbackSpeed, setPlaybackSpeed] = useState(2.0);
    const [status, setStatus] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const audio = useRef(null);

    useEffect(() => {
        audio.current = new Howl({
            src: ['/footsteps.mp3'], // 파일 경로를 public 디렉토리의 파일로 설정
            rate: playbackSpeed,
            html5: true, // Use HTML5 Audio to handle MP3
        });

        const start = async () => {
            const today = new Date();
            let startDate = new Date(today.toDateString() + ' ' + startTime);
            let endDate = new Date(today.toDateString() + ' ' + endTime);

            if (endDate <= startDate) {
                endDate.setDate(endDate.getDate() + 1); // Move end time to the next day
            }

            const playAudio = () => {
                // Random play count between 1 and 5
                const playCount = Math.floor(Math.random() * 5) + 1;
                setStatus(`Playing audio ${playCount} times.`);

                for (let i = 0; i < playCount; i++) {
                    if (isPlaying) {
                        audio.current.play();
                        audio.current.once('end', () => {
                            const delay = getRandomDelay();
                            setStatus(`Waiting ${delay} seconds before next play...`);
                            setTimeout(playAudio, delay * 1000); // Recur after delay
                        });
                    }
                }
            };

            const run = async () => {
                await waitUntil(startDate);
                setStatus(`Starting audio playback at ${startDate.toTimeString().split(' ')[0]}`);
                if (isPlaying) playAudio();

                // Continuously check and update status until end time
                const interval = setInterval(() => {
                    if (new Date() >= endDate) {
                        clearInterval(interval);
                        setStatus(`Stopped playback. Tomorrow will start at ${startDate.toTimeString().split(' ')[0]}`);
                        startDate.setDate(startDate.getDate() + 1);
                        endDate.setDate(endDate.getDate() + 1);
                        run();
                    }
                }, 1000);
            };

            run();
        };

        start();
    }, [startTime, endTime, playbackSpeed, isPlaying]);

    const handlePlay = () => {
        setIsPlaying(true);
        setStatus("Audio playback started.");
    };

    const handleStop = () => {
        setIsPlaying(false);
        audio.current.stop();
        setStatus("Audio playback stopped.");
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Audio Playback Scheduler</h1>
            <div className="mb-4">
                <label className="block mb-1">Start Time:</label>
                <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">End Time:</label>
                <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Playback Speed:</label>
                <input
                    type="number"
                    step="0.1"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                >
                    Play
                </button>
                <button
                    onClick={handleStop}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Stop
                </button>
            </div>
            <div>
                <p>Status: {status}</p>
            </div>
        </div>
    );
};

export default App;
