import React, { useRef, useState } from 'react'
import Header from '../Components/Header'
import FileInput from '../Components/Input/FileInput';
import { toast } from 'react-toastify';
import {auth,db} from '../Firebase'
import cld from '../config';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';
import InputRef from '../Components/Input/InputRef';

const CreateEpisodePage = () => {
    const {id} = useParams();
    const titleRef = useRef('')
    const descriptionRef = useRef('')
    const [audioFile,setAudioFile] = useState(null);
    const [loading,setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmission(){
      const title = titleRef.current.value;
      const description = descriptionRef.current.value;

       setLoading(true)
       if( !title || !description || !audioFile){
        toast.error('Please fill all the fields')
        setLoading(false);
       }
       else{
         try {
            const formData = new FormData()
            formData.append('file', audioFile)
            formData.append('upload_preset', 'ml_default')
            formData.append('folder', `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`);
            const audioRes = await fetch( `https://api.cloudinary.com/v1_1/${cld.cloudinaryConfig.cloud_name}/auto/upload`,
              {
                method: 'POST',
                body: formData
              })
            const audioData = await audioRes.json()
            const audioUrl = audioData.secure_url;
            
            const episodeData = {
                title, description,audioFile : audioUrl
            }
            await addDoc(collection(db,'podcasts',id,'episodes'),episodeData)
            setLoading(false);
            toast.success('Episode created successfully')
            titleRef.current.value = ''
            descriptionRef.current.value = ''
            setAudioFile(null);
            navigate(`/podcast/${id}`)
        
          }
          catch(error){
              toast.error(error.message)
              setLoading(false);
          }
       }
    }

  return (
    <div>
      <Header/>
      <form onSubmit={(e) => e.preventDefault()}>
       <h1>Create Episode</h1>
       <InputRef placeholder='Title' inputRef={titleRef}/>
       <InputRef placeholder='Description' inputRef={descriptionRef}/>
       <FileInput text='Upload audio file' id='audio-file' accept='audio/*' handleFile={setAudioFile}/>
       <button className='custom-btn' onClick={handleSubmission}>
        {loading ? <Bars color='white' height='24'/> : 'Create Episode'}</button>
      </form>
    </div>
  )
}

export default CreateEpisodePage
