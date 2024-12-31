import React, {useRef } from 'react'
import './style.css'

const InputComponent = ({type,placeholder,value,setValue,readOnly,display}) => {

   const inputRef = useRef();
  function handleChange(e){
    setValue(e.target.value);
  }

 

  return (
    <input
     className='custom-input'
       type={type}
       placeholder={placeholder}
       value={value}
        onChange={handleChange}
        readOnly={readOnly}
        style={{display : display}}
        ref={inputRef}
    />
      
  )
}

export default InputComponent
