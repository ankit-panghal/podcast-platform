import React, { useState } from 'react'
import InputComponent from '../Input'
import FileInput from '../Input/FileInput';
import { toast } from 'react-toastify';
import { auth, db } from '../../Firebase';
import { addDoc, setDoc,doc,collection} from 'firebase/firestore';
import cld from '../../config';
import { Bars } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { setCurrPodcast } from '../../redux/Slices/currentPodcastSlice';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const CreatePodcastForm = () => {
  const data = useSelector(state => state.currentPodcast);
  console.log(data);
  
   const path = window.location.pathname.split('/')[1];
   
    const [title,setTitle] = useState(data?.title ? data.title :'');
    const [description,setDescription] = useState(data?.description ? data.description : '');
    const [displayImg,setDisplayImg] = useState(data?.displayImage ? data.displayImage : null);
    const [bannerImg,setBannerImg] = useState(data?.bannerImage ? data.bannerImage : null);
    const [loading,setLoading] = useState(false);
    const [isCreated,setIsCreated] = useState(false);

    const dispatch = useDispatch();
   const navigate = useNavigate();

   async function handleSubmission(){
    setLoading(true)
        if(!title || !description || !displayImg || !bannerImg ){
            toast.error('Please fill all the fields')
            setLoading(false)
        }
        else if(description.length <= 15){
            toast.error('Description must contain more than 15 letters')
            setLoading(false)
        }
        else {
            try{
            const formData = new FormData()
            formData.append('file', bannerImg)
            formData.append('upload_preset', 'ml_default')
            formData.append('folder', `podcasts/${auth.currentUser.uid}/${Date.now()}`);
            const bannerRes = await fetch(
              `https://api.cloudinary.com/v1_1/${cld.cloudinaryConfig.cloud_name}/image/upload`,
              {
                method: 'POST',
                body: formData
              }
            )
            const bannerData = await bannerRes.json()
            const bannerImgUrl = bannerData.secure_url
            formData.delete('file'); // Clear the form data for the next image upload
            formData.append('file', displayImg);
            formData.append('upload_preset', 'ml_default')
            formData.append('folder', `podcasts/${auth.currentUser.uid}/${Date.now()}`);
        
            const displayRes = await fetch(
              `https://api.cloudinary.com/v1_1/${cld.cloudinaryConfig.cloud_name}/image/upload`,
              {
                method: 'POST',
                body: formData,
              }
            );
            const displayData = await displayRes.json();
            const displayImgUrl = displayData.secure_url;
            

            const podcastData = {
              title,
              description,
              bannerImage : bannerImgUrl,
              displayImage : displayImgUrl,
              createdBy : auth.currentUser.uid
            }
            if(data){
              await setDoc(doc(db,'podcasts',data.id),podcastData);
              dispatch(setCurrPodcast(null))
              toast.success('Podcast edited successfully')
              setLoading(false)
              setTitle('');
              setDescription('');
              setBannerImg(null);
              setDisplayImg(null);
              setIsCreated(true);
              navigate('/create-podcast')
            }
            else {
              await addDoc(collection(db,'podcasts'),podcastData)
                    setTitle('');
                    setDescription('');
                    setBannerImg(null);
                    setDisplayImg(null);
                    setLoading(false)
                    setIsCreated(true);
                    toast.success('Podcast Created Successfully')
          }
        }
              catch(error){
                toast.error(error.message);
              } 
        }
    }


  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h1>{path === 'edit-podcast' ? 'Edit Podcast' : 'Create Podcast'}</h1>
      <InputComponent type='text' placeholder='Podcast Title' value={title} setValue={setTitle}/>
      <InputComponent type='text'placeholder='Podcast Description' value={description} setValue={setDescription}/>
      <FileInput text='Import Banner Image' accept='images/*' id='banner-img' value={bannerImg} handleFile={setBannerImg} isCreated={isCreated} />
      <FileInput text='Import Display Image' accept='images/*' id='display-img' value={displayImg} handleFile={setDisplayImg} isCreated={isCreated}/>
      {
      path === 'edit-podcast' ? <button className='custom-btn' onClick={handleSubmission}>
        {loading ? <Bars color='white' height='24'/> : 'Edit Podcast'}</button>
      :
      <button style={data ? {display : 'none'} : {display :'flex'}} className='custom-btn' onClick={handleSubmission}>
        {loading ? <Bars color='white' height='24'/> : 'Create Podcast'}
        </button>}
    </form>
  )
}

export default CreatePodcastForm
