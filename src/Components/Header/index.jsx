import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { auth } from '../../Firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import './style.css'

const Header = () => {
    const location = useLocation();
    const currPath = location.pathname;
    const [user,loading,error] = useAuthState(auth);
  return (
    <div className='navbar'>
      <div className='links gradient'>
   { !user?.emailVerified && <Link to='/' className={currPath==='/'? 'active' : ''}>Signup/Login</Link>}
    <Link to='/podcasts' className={currPath==='/podcasts'? 'active' : ''}>Podcasts</Link>
    <Link to='/create-podcast' className={currPath==='/create-podcast'? 'active' : ''}>Create a Podcast</Link>
    <Link to='/profile' className={currPath==='/profile'? 'active' : ''}>Profile</Link>
      </div>
    </div>
  )
}

export default Header
