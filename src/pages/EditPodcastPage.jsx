import React from 'react'
import CreatePodcastForm from '../Components/CreatePodcastForm'
import Header from '../Components/Header'
import { useSelector } from 'react-redux'
const EditPodcastPage = () => {
  return (
    <div>
      <Header/>
      <CreatePodcastForm/>
    </div>
  )
}

export default EditPodcastPage
