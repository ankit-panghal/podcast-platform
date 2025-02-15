import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../Firebase';
import EpisodeDetails from '../Components/EpisodeDetails';
import AudioPlayer from '../Components/AudioPlayer';
import { getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import {setCurrPodcast} from '../redux/Slices/currentPodcastSlice'

const PodcastDetails = () => {
    const {id} = useParams();
    const [podcast,setPodcast] = useState({});
    const [episodes,setEpisodes] = useState([]);
    const [audioFile,setAudioFile] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth();

    useEffect(() => {
        
            async function getData(){
                try{
                    const docRef = doc(db,'podcasts',id);
                    const docSnap = await getDoc(docRef);
                    if(docSnap.exists()){
                        setPodcast({id,...docSnap.data()})
                    }
                    else{
                        navigate('/podcasts');
                    }
                }
                catch(error){
                    console.log(error.message)
                }
            }
            getData();
             
            async function getEpisodes(){
                try{
                    const q = query(collection(db,'podcasts',id,'episodes')); 
                    const querySnapshot = await getDocs(q)
                    const episodeData = [];
                    querySnapshot.forEach((doc) => {
                        episodeData.push({id : doc.id,...doc.data()})
                    })
                            setEpisodes(episodeData)
                }
                catch(error){
                    console.log(error.message)
                }
            }
          getEpisodes();
    },[id])

function handleEditPodcast(){
    dispatch(setCurrPodcast(podcast))
    navigate(`/podcast/${id}/edit-podcast`)
}

function handleEpisodeCreation (){
    navigate(`/podcast/${id}/create-episode`)
}
  return (
    <div>
      <Header/>
      {
        podcast && <div className='podcast-details'>
            <div className='title-bar'>
            <h1>{podcast.title}</h1>
            <div style={{display: 'flex',gap : '10px'}}>
            {podcast.createdBy === auth.currentUser.uid  && <button onClick= {handleEditPodcast}className='custom-btn'>Edit Podcast</button> }
           {podcast.createdBy === auth.currentUser.uid && <button className='custom-btn' onClick={handleEpisodeCreation}>Create Episode</button> }
           </div>
            </div>
            <div className='banner-bg'>
            <img src={podcast.bannerImage} alt={podcast.title}/>
            </div>
            <p>{podcast.description}</p>
            <h1>Episodes</h1>
            {
            episodes.length > 0 ? 
             episodes.map((episode,idx) => {
               return <EpisodeDetails key={idx} id={idx} title={episode.title} description={episode.description} audioFile={episode.audioFile} setAudioFile={setAudioFile}/>
             })
             : 
            <p>No episodes found</p>
            }
            {audioFile && <AudioPlayer audioSrc = {audioFile} image={podcast.displayImage}/>}
        </div>
      }
    </div>
  )
}

export default PodcastDetails
