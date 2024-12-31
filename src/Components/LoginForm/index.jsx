import React,{useState} from 'react'
import InputComponent from '../Input'
import ButtonComponent from '../Button';
const LoginForm = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
  return (
    <>
      <InputComponent type='email' placeholder='Email' value={email} setValue={setEmail}/>
      <InputComponent type='password' placeholder='Password' value={password} setValue={setPassword}/>
      <ButtonComponent text='Login' email={email} password={password}/>
    </>
  )
}

export default LoginForm
