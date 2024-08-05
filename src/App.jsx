// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Tailwind CSS를 포함합니다.

const App = () => {
    const [startTime, setStartTime] = useState('07:00:00');
    const [endTime, setEndTime] = useState('01:00:00');
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [filePath, setFilePath] = useState('footsteps.mp3');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        let interval;

        const getCurrentTime = () => new Date();

        const parseTime = (timeStr) => {
            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
            const now = new Date();
            now.setHours(hours, minutes, seconds, 0);
            return now;
        };

        const waitUntil = (targetTime) => {
            return new Promise(resolve => {
                const check = () => {
                    if (getCurrentTime() >= targetTime) {
                        resolve();
                    } else {
                        setTimeout(check, 1000);
                    }
                };
                check();
            });
        };

        const playAudio = () => {
            if (audioRef.current) {
                audioRef.current.playbackRate = playbackSpeed;
                audioRef.current.play();
            }
        };

        const startPlayback = async () => {
            const today = new Date();
            const start = parseTime(startTime);
            const end = parseTime(endTime);

            if (end <= start) end.setDate(end.getDate() + 1);

            while (true) {
                console.log(`Starting playback at ${start.toLocaleTimeString()}`);
                await waitUntil(start);

                while (getCurrentTime() < end) {
                    const playCount = Math.floor(Math.random() * 5) + 1;
                    console.log(`Playing audio ${playCount} times.`);

                    for (let i = 0; i < playCount; i++) {
                        playAudio();
                        await new Promise(resolve => audioRef.current.onended = resolve);
                    }

                    const delay = Math.floor(Math.random() * 60) + 1;
                    console.log(`Waiting for ${delay} seconds before replaying.`);
                    await new Promise(resolve => setTimeout(resolve, delay * 1000));
                }

                console.log(`Stopping playback. Next start at ${start.toLocaleTimeString()}`);
                start.setDate(start.getDate() + 1);
                end.setDate(end.getDate() + 1);
                await waitUntil(start);
            }
        };

        if (isPlaying) {
            startPlayback();
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying, startTime, endTime, playbackSpeed]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Audio Player</h1>
            <div className="mb-4">
                <label className="block mb-2">
                    MP3 File Path:
                    <input
                        type="text"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </label>
                <label className="block mb-2">
                    Start Time (HH:MM:SS):
                    <input
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </label>
                <label className="block mb-2">
                    End Time (HH:MM:SS):
                    <input
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </label>
                <label className="block mb-2">
                    Playback Speed:
                    <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </label>
            </div>
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {isPlaying ? 'Stop' : 'Start'}
            </button>
            <audio ref={audioRef} src={filePath} />
        </div>
    );
};

export default App;
