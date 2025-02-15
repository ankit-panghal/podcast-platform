import './style.css'
import React, { useEffect, useRef, useState } from 'react'
import {FaPlay,FaPause,FaVolumeUp,FaVolumeMute} from 'react-icons/fa'
import back10secs from '../../assets/back10secs.png'
import next10secs from '../../assets/next10secs.png'

const AudioPlayer = ({audioSrc,image}) => {
    const [duration,setDuration] = useState(0);
    const [volume,setVolume] = useState(1);
    const [isPlaying,setIsPlaying] = useState(true);
    const [isMute,setIsMute] = useState(false);
    const [currentTime,setCurrentTime] = useState(0);

    const audioRef = useRef(); 

useEffect(() => {
    if(!isMute){ 
        audioRef.current.volume = 1;
        setVolume(1);
    }
    else{
         audioRef.current.volume = 0;
         setVolume(0);
        }
},[isMute])
      
useEffect(() => {
  if(isPlaying) audioRef.current.play();
  else audioRef.current.pause();
    const audio = audioRef.current;

    function handleMetaData(){
      setDuration(audio.duration)
    }
      function handleTimeUpdate(){
          setCurrentTime(audio.currentTime);
      }
      
      function handleTimeEnded(){
        setIsPlaying(false)
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    audio.addEventListener("loadedmetadata", handleMetaData)
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener('ended',handleTimeEnded);
  
    return () => {
      audio.removeEventListener("loadmetadata", handleMetaData)
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener('ended',handleTimeEnded);
    };
  }, [audioSrc,isPlaying]);

  
    function handleSeek(e){
        setCurrentTime(e.target.value);
       audioRef.current.currentTime = e.target.value;
    }

    function handleVolume(e){
        setVolume(e.target.value)
        audioRef.current.volume = e.target.value;
    }

    function formatTime(time){
      const totalSecs = Math.floor(time);
      const minutes = Math.floor(totalSecs/60);
      const seconds = totalSecs%60;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return formattedMinutes+':'+formattedSeconds;
    }

    function handleReplay(){
      if(currentTime > 10){
        setCurrentTime(prev => prev-10)
        audioRef.current.currentTime = currentTime-10;
      }
      else {
        setCurrentTime(0)
         audioRef.current.currentTime = 0;
      };
    }
    function handleForward(){
      if(duration-currentTime > 10){
        setCurrentTime(prev => prev+10)
        audioRef.current.currentTime = currentTime+10;
      }
      else {
        setCurrentTime(duration)
         audioRef.current.currentTime = duration;
      };
    }

  return (
    <div className='custom-audio-player'>
      <div style={{width : '60%',display : 'inherit',gap : '20px'}}>
      <img src={image} alt='episode-img'/>
      <audio src={audioSrc} ref={audioRef}></audio>
      <span onClick={() => setIsPlaying(prev => !prev)}>{isPlaying ? <FaPause/> : <FaPlay/>}</span>
      <div className='duration-box'>
  
        <span>{formatTime(currentTime)}</span>
        <input type='range' value={currentTime} max={duration} min='0' onChange={handleSeek}/>
        <span>{formatTime(duration)}</span>
        <span onClick={handleReplay}><img src={back10secs} alt='back10secs'/></span>
        <span onClick={handleForward}><img src={next10secs} alt='next10secs'/></span>

      </div>
      </div>
      <div>
      <div className='vol-box'>
      <span onClick={() => setIsMute(prev => !prev)}>{isMute ? <FaVolumeMute/> : <FaVolumeUp/>}</span>
      <input type='range' value={volume} min={0} max={1} step={0.01} onChange={handleVolume} className='vol-range'/>
      </div>
      </div>
    </div>
  )
}

export default AudioPlayer
