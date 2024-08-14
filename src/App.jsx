import React, { useRef, useState, useEffect } from 'react';
import './App.css'; // Tailwind CSS가 포함된 스타일 시트를 import

function App() {
    // 상태 변수 초기화
    const [isPlaying, setIsPlaying] = useState(false); // 오디오가 재생 중인지 여부를 저장
    const [playbackRate, setPlaybackRate] = useState(1); // 오디오의 재생 속도 (기본값은 1배속)
    const [volume, setVolume] = useState(1); // 오디오의 음량 (기본값은 1, 최대값)
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // 현재 시간을 저장
    const audioRef = useRef(null); // audio 요소에 대한 참조를 저장

    // 컴포넌트가 마운트되면 현재 시간을 1초마다 업데이트하는 타이머 설정
    useEffect(() => {
        // 1초마다 현재 시간을 업데이트하는 타이머 설정
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        // 컴포넌트가 언마운트될 때 타이머 클리어
        return () => clearInterval(interval);
    }, []);

    // 오디오 재생 함수
    const handlePlay = () => {
        if (audioRef.current) { // audioRef가 현재 유효한지 확인
            audioRef.current.play(); // 오디오 재생
            setIsPlaying(true); // 재생 상태 업데이트
        }
    };

    // 오디오 정지 함수
    const handleStop = () => {
        if (audioRef.current) { // audioRef가 현재 유효한지 확인
            audioRef.current.pause(); // 오디오 정지
            audioRef.current.currentTime = 0; // 오디오를 처음으로 되돌림
            setIsPlaying(false); // 재생 상태 업데이트
        }
    };

    // 재생 속도 변경 핸들러
    const handlePlaybackRateChange = (event) => {
        const newRate = parseFloat(event.target.value); // 슬라이더에서 새로운 속도 값 가져오기
        setPlaybackRate(newRate); // 속도 상태 업데이트
        if (audioRef.current) { // audioRef가 현재 유효한지 확인
            audioRef.current.playbackRate = newRate; // 오디오의 재생 속도 설정
        }
    };

    // 음량 변경 핸들러
    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value); // 슬라이더에서 새로운 음량 값 가져오기
        setVolume(newVolume); // 음량 상태 업데이트
        if (audioRef.current) { // audioRef가 현재 유효한지 확인
            audioRef.current.volume = newVolume; // 오디오의 음량 설정
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">MP3 Player</h1>
            {/* 오디오 요소 */}
            <audio
                ref={audioRef} // audio 요소에 대한 참조 설정
                src="/audio.mp3" // 오디오 파일의 경로
                loop // 오디오가 끝나면 자동으로 다시 재생
            ></audio>
            {/* 버튼 그룹: 시작 및 정지 버튼 */}
            <div className="mb-4">
                <button
                    onClick={handlePlay} // 버튼 클릭 시 오디오 재생
                    className={`px-4 py-2 text-white rounded mr-2 ${isPlaying ? 'bg-gray-500' : 'bg-green-500'}`} // 재생 상태에 따라 버튼 색상 변경
                >
                    Start
                </button>
                <button
                    onClick={handleStop} // 버튼 클릭 시 오디오 정지
                    className={`px-4 py-2 text-white rounded ${isPlaying ? 'bg-red-500' : 'bg-gray-300'}`} // 재생 상태에 따라 버튼 색상 변경
                >
                    Stop
                </button>
            </div>
            {/* 재생 속도 조절 슬라이더 */}
            <div className="mb-4">
                <label htmlFor="playbackRate" className="block text-lg mb-2">
                    Playback Speed: {playbackRate.toFixed(1)}x
                </label>
                <input
                    id="playbackRate" // 슬라이더의 ID
                    type="range" // 슬라이더 입력 유형
                    min="0.5" // 슬라이더의 최소값
                    max="3" // 슬라이더의 최대값
                    step="0.1" // 슬라이더의 값 변경 단위
                    value={playbackRate} // 현재 재생 속도 값을 슬라이더에 설정
                    onChange={handlePlaybackRateChange} // 슬라이더 값 변경 시 호출되는 핸들러
                    className="w-64" // 슬라이더의 너비
                />
            </div>
            {/* 음량 조절 슬라이더 */}
            <div className="mb-4">
                <label htmlFor="volume" className="block text-lg mb-2">
                    Volume: {(volume * 100).toFixed(0)}%
                </label>
                <input
                    id="volume" // 슬라이더의 ID
                    type="range" // 슬라이더 입력 유형
                    min="0" // 슬라이더의 최소값
                    max="1" // 슬라이더의 최대값
                    step="0.01" // 슬라이더의 값 변경 단위
                    value={volume} // 현재 음량 값을 슬라이더에 설정
                    onChange={handleVolumeChange} // 슬라이더 값 변경 시 호출되는 핸들러
                    className="w-64" // 슬라이더의 너비
                />
            </div>
            {/* 재생 상태 메시지 */}
            <div className="text-xl font-medium mb-4">
                {isPlaying ? 'Currently Playing' : 'Not Playing'}
            </div>
            {/* 현재 시간 표시 */}
            <div className="text-xl font-medium">
                Current Time: {currentTime}
            </div>
        </div>
    );
}

export default App;
