import './style.css'

const InputComponent = ({type,placeholder,value,setValue,readOnly,display}) => {

   
  return (
    <input
     className='custom-input'
       type={type}
       placeholder={placeholder}
       value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={readOnly}
        style={{display : display}}
    />
      
  )
}

export default InputComponent
