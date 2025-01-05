import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'

const PodcastCard = ({id,title,displayImg}) => {
  
  return (
    <Link to={`/podcast/${id}`}>
    <div className='podcast-card'>
      <img src={displayImg} alt={title}/>
      <p>{title}</p>
    </div>
    </Link>
  )
}

export default PodcastCard
