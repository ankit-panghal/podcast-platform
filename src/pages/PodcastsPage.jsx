import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../Firebase';
import { setPodcast } from '../redux/Slices/podcastSlice';
import PodcastCard from '../Components/Podcast/PodcastCard';
import InputComponent from '../Components/Input'

const PodcastsPage = () => {
    const podcasts = useSelector(state => state.podcasts.podcasts);
    const dispatch = useDispatch();
     const [search,setSearch] = useState('');
    useEffect(() => {
        onSnapshot(
        query(collection(db,'podcasts')),
        (querySnapshot) => {
             const podcastsData = [];
             querySnapshot.forEach((doc) => {
                podcastsData.push({id : doc.id , ...doc.data()})
             })
             dispatch(setPodcast(podcastsData))
        }
       )
    },[dispatch])

    const searchTerm = search.trim().toLowerCase();
    const filteredData = podcasts.filter(item => item.title.toLowerCase().includes(searchTerm));
  return (
    <div>
      <Header/>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Discover Podcasts</h1>
        <InputComponent type='text' placeholder='Search Podcast' value={search} setValue={setSearch}/>
      </form>
      
      {
      filteredData.length > 0 ? <div className='podcasts-container'>
         { 
         filteredData.map(item => {
          return <PodcastCard key={item.id} id={item.id} title={item.title} displayImg={item.displayImage}/>
      }) } 
      </div>: <p style={{textAlign : 'center', marginTop :'30px'}}>
        { search ? 'Podcasts not found' : 'No current podcast on the platform'}</p>
     
      }
      
    </div>
  )
}

export default PodcastsPage
