import React from 'react'
import { Link } from 'react-router-dom'
import './Header.scss'

const Header = (props) => {
  const { signUp } = props
  return <div className='sixty-creek-login-header'>
    <img src="/logo.png" className='sixty-creek-icon' />
    <div className='not-a-member-box'>
      <Link className='g-link-item' to={'/signup'}>Sign Up</Link>
      <div className='header-label g-basic-label'>Not a Member?</div>
    </div>
  </div>
}

export default Header