import React,{ useState} from 'react'
import InputComponent from '../Input'
import ButtonComponent from '../Button'

const SignupForm = () => {
    const [fullName,setFullName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPass,setConfirmPass] = useState('');


  return (
    <>
       <InputComponent type='text' placeholder= 'Full Name' value={fullName} setValue={setFullName}/>
       <InputComponent type='email' placeholder='Email' value={email} setValue={setEmail}/>
       <InputComponent type='password' placeholder='Password' value={password} setValue={setPassword}/>
       <InputComponent type='password' placeholder='Confirm Password' value={confirmPass} setValue={setConfirmPass}/>
       <ButtonComponent text='Signup' name={fullName} email={email} password={password} confirmPass={confirmPass} />
      
    </>
  )
}

export default SignupForm
