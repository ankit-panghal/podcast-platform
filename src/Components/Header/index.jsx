import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './style.css'

const Header = () => {
    const location = useLocation();
    const currPath = location.pathname;
  return (
    <div className='navbar'>
      <div className='links gradient'>
    <Link to='/' className={currPath==='/'? 'active' : ''}>Signup</Link>
    <Link to='/podcasts' className={currPath==='/podcasts'? 'active' : ''}>Podcasts</Link>
    <Link to='/create-podcast' className={currPath==='/create-podcast'? 'active' : ''}>Create a Podast</Link>
    <Link to='/profile' className={currPath==='/profile'? 'active' : ''}>Profile</Link>
      </div>
    </div>
  )
}

export default Header
