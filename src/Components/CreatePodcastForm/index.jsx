import React, { useEffect, useState } from 'react'
import InputComponent from '../Input'
import FileInput from '../Input/FileInput';
import { toast } from 'react-toastify';
import { auth, db } from '../../Firebase';
import { addDoc, setDoc,doc,collection,getDoc} from 'firebase/firestore';
import cld from '../../config';
import { Bars } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { setCurrPodcast } from '../../redux/Slices/currentPodcastSlice';
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';

const CreatePodcastForm = () => {
  const {id} = useParams()
  const data = useSelector(state => state.currentPodcast);
  const [title,setTitle] = useState(data?.title ? data.title :'');
  const [description,setDescription] = useState(data?.description ? data.description : '');
  const [displayImg,setDisplayImg] = useState(data?.displayImage ? data.displayImage : null);
  const [bannerImg,setBannerImg] = useState(data?.bannerImage ? data.bannerImage : null);
  const [loading,setLoading] = useState(false);
  
  const path = window.location.pathname.split('/')[3];
   
    const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      if(path === 'edit-podcast' && !data){
         getDoc(doc(db,'podcasts',id))
         .then((docSnap) => {
              if(docSnap.exists()){
                setTitle(docSnap.data().title)
                setDescription(docSnap.data().description)
                setBannerImg(docSnap.data().bannerImage)
                setDisplayImg(docSnap.data().displayImage)
              }
              else{
                navigate('/podcasts')
              }
        })
          .catch((error) => {
            console.log(error.message);
          })
      }
   },[])

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
                if(path === 'edit-podcast'){
                  await setDoc(doc(db,'podcasts',id),podcastData);
                  dispatch(setCurrPodcast(null))
                  setLoading(false)
                  setTitle('');
                  setDescription('');
                  setBannerImg(null);
                  setDisplayImg(null);
                  toast.success('Podcast edited successfully')
                  navigate(`/podcast/${id}`)
                }
                else {
                  await addDoc(collection(db,'podcasts'),podcastData)
                        setTitle('');
                        setDescription('');
                        setBannerImg(null);
                        setDisplayImg(null);
                        setLoading(false)
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
      <FileInput text='Import Banner Image' accept='image/*' id='banner-img' value={bannerImg} handleFile={setBannerImg} />
      <FileInput text='Import Display Image' accept='image/*' id='display-img' value={displayImg} handleFile={setDisplayImg}/>
      {
        path === 'edit-podcast' ? <button className='custom-btn' onClick={handleSubmission}>
          {loading ? <Bars color='white' height='24'/> : 'Edit Podcast'}</button>
        :
        <button className='custom-btn' onClick={handleSubmission}>
          {loading ? <Bars color='white' height='24'/> : 'Create Podcast'}
          </button>
      }
    </form>
  )
}

export default CreatePodcastForm
