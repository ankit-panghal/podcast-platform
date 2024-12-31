import React, { useState } from 'react'
import './style.css'
const FileInput = ({text,accept,id,handleFile,isCreated}) => {
    const [fileSelected,setFileSelected] = useState('')

  function handleChange(e){ 
    setFileSelected(e.target.files[0].name)
    handleFile(e.target.files[0])

  }

  return (
    <label htmlFor={id} className= {`custom-input ${!fileSelected && 'label-input'}`}>
        {fileSelected && !isCreated ? fileSelected : text}
      <input type='file' accept={accept} id={id} style={{display : 'none'}} onChange={handleChange}/>
    </label>
  )
}

export default FileInput
