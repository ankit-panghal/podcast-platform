import React, { useState } from 'react'
import Header from '../Components/Header'
import InputComponent from '../Components/Input';
import FileInput from '../Components/Input/FileInput';
import { toast } from 'react-toastify';
import {auth,db} from '../Firebase'
import cld from '../config';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';

const CreateEpisodePage = () => {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [audioFile,setAudioFile] = useState(null);
    const [loading,setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmission(){
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
            setTitle('');
            setDescription('');
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
       <InputComponent value={title} setValue={setTitle} placeholder='Title'/>
       <InputComponent  value={description} setValue={setDescription} placeholder='Description'/>
       <FileInput text='Upload audio file' id='audio-file' accept='audio/*' handleFile={setAudioFile}/>
       <button className='custom-btn' onClick={handleSubmission}>
        {loading ? <Bars color='white' height='24'/> : 'Create Episode'}</button>
      </form>
    </div>
  )
}

export default CreateEpisodePage
