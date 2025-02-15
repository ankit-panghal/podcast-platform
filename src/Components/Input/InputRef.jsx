import React from 'react'
import './style.css'

const InputRef = ({type,placeholder,inputRef,readOnly,display}) => {

   
  return (
    <input
     className='custom-input'
       type={type}
       placeholder={placeholder}
        readOnly={readOnly}
        style={{display : display}}
        ref={inputRef}
    />
      
  )
}

export default InputRef
