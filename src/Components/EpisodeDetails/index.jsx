import React from 'react'
const EpisodeDetails = ({id,title,description,audioFile,setAudioFile}) => {

    function handlePlay(){
        setAudioFile(audioFile);
    }
  return (
    <div style={{display : 'flex' , flexDirection : 'column' ,gap : '10px'}}>
      <h2>{id+1}. {title}</h2>
      <p>{description}</p>
      <button className='custom-btn' style={{width : '100px',marginBottom : '50px'}} onClick={handlePlay}>Play</button>
    </div>
  )
}

export default EpisodeDetails
