import React, { useState } from 'react'
import InputComponent from '../Input'
import FileInput from '../Input/FileInput';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../Firebase';
import { addDoc, setDoc,doc,collection} from 'firebase/firestore';
import { Bars } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { setCurrPodcast } from '../../redux/Slices/currentPodcastSlice';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
const CreatePodcastForm = () => {
  const data = useSelector(state => state.currentPodcast);
    const [title,setTitle] = useState(data?.title ? data.title :'');
    const [description,setDescription] = useState(data?.description ? data.description : '');
    const [displayImg,setDisplayImg] = useState(null);
    const [bannerImg,setBannerImg] = useState(null);
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
            const bannerImgRef = ref(storage,`podcasts/${auth.currentUser.uid}/${Date.now()}`)
            await uploadBytes(bannerImgRef,bannerImg);
              const bannerImgUrl = await getDownloadURL(bannerImgRef);
          
              const displayImgRef = ref(storage,`podcasts/${auth.currentUser.uid}/${Date.now()}`)
              await uploadBytes(displayImgRef,displayImg);
             const displayImgUrl = await getDownloadURL(displayImgRef);
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
      <h1>{data ? 'Edit Podcast' : 'Create Podcast'}</h1>
      <InputComponent type='text' placeholder='Podcast Title' value={title} setValue={setTitle}/>
      <InputComponent type='text'placeholder='Podcast Description' value={description} setValue={setDescription}/>
      <FileInput text='Import Banner Image' accept='images/*' id='banner-img' handleFile={setBannerImg} isCreated={isCreated} />
      <FileInput text='Import Display Image' accept='images/*' id='display-img' handleFile={setDisplayImg} isCreated={isCreated}/>
      {
      data && <button className='custom-btn' onClick={handleSubmission}>
        {loading ? <Bars color='white' height='24'/> : 'Edit Podcast'}</button>
      }
      <button style={data ? {display : 'none'} : {display :'unset'}}               className='custom-btn' onClick={handleSubmission}>
        {loading ? <Bars color='white' height='24'/> : 'Create Podcast'}
        </button>
    </form>
  )
}

export default CreatePodcastForm
