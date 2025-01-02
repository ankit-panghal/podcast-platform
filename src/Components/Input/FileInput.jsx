import React, { useEffect, useState } from 'react'
import './style.css'
const FileInput = ({text,accept,id,value,handleFile,isCreated}) => {
    const [fileSelected,setFileSelected] = useState('')
    
    useEffect(() => {
      if(value){
        const myArr = value?.split('/');
        const fileName = myArr[myArr.length - 1]
        setFileSelected(fileName)
        handleFile(value)
      }
    },[])

  function handleChange(e){ 
    setFileSelected(e.target.files[0].name)
    handleFile(e.target.files[0])
  }

  return (
    <label htmlFor={id} className= {`custom-input ${!fileSelected && 'label-input'}`}>
        {fileSelected && !isCreated ? fileSelected : text}
      <input type='file' accept={accept} id={id} style={{display : 'none'}}  onChange={handleChange}/>
    </label>
  )
}

export default FileInput
