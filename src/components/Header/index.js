import React from 'react'

import './Header.scss'

const Header = (props) => {
  const { signUp } = props
  return <div className='sixty-creek-login-header'>
    <div className='sixty-creek-icon' />
    <div className='not-a-member-box'>
      <div className='header-label g-clickable-label' onClick={signUp}>Sign Up</div>
      <div className='header-label g-basic-label'>Not a Member?</div>
    </div>
  </div>
}

export default Header