import React, { useEffect, useState } from 'react'
import './style.css'

const FileInput = ({text,accept,id,value,handleFile}) => {
    const [fileSelected,setFileSelected] = useState('');
    const [imageUrl,setImageUrl] = useState('');
    
    useEffect(() => {
      if(typeof value === 'string' && value.startsWith('https://res.cloudinary.com')){
        const myArr = value?.split('/');
        const fileName = myArr[myArr.length - 1].split('_')[0];
        setFileSelected(fileName)
        setImageUrl(value)
      }
    },[value])

  function handleChange(e){ 
    const file = e.target.files[0];
    setFileSelected(file.name)
    handleFile(file)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result)
    }

  }

  return (
    <label htmlFor={id} className= {`custom-input ${!fileSelected ? 'label-input' : ''}`}>
       {imageUrl &&  <img src={imageUrl} alt='uploded-img'/>}
        { !fileSelected ? text : fileSelected}
      <input type='file' accept={accept} id={id} style={{display : 'none'}} onChange={handleChange}/>
    </label>
  )
}

export default FileInput
