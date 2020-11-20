import React, { useState } from 'react'
import './Login.scss'

import Header from '../../components/Header'

const Login = (props) => {

  const [buttonEnabledValue, setButtonEnabled] = useState(false)
  const [userNameValue, setUserNameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [displayPasswordValue, setDisplayPasswordValue] = useState(false)

  return <div className='sixty-creek-login g-page-background'>
    <Header />
    <div className='g-centered-form'>
      <div className='g-form-container'>
        <div className='g-caption'>Log On</div>
        <div className='g-input-box'>
          <div className='g-input-label'>Username</div>
          <input className='g-input-container'
            type='text'
            placeholder='Enter the Email Address'
            value={userNameValue}
            onChange={(e) => {
              setUserNameValue(e.target.value)
              if (passwordValue && e.target.value) {
                setButtonEnabled(true)
              }
              else {
                setButtonEnabled(false)
              }
            }} />
        </div>
        <div className='g-input-box'>
          <div className='g-input-label'>Password</div>
          <div className='eye-icon' onClick={(e) => {
            setDisplayPasswordValue(!displayPasswordValue)
          }}/>
          <input className='g-input-container'
            type={!displayPasswordValue ? 'password' : 'text'}
            placeholder='Enter the Password'
            value={passwordValue}
            onChange={(e) => {
              setPasswordValue(e.target.value)
              if (userNameValue && e.target.value) {
                setButtonEnabled(true)
              }
              else {
                setButtonEnabled(false)
              }
            }} />
        </div>
        <div className='g-clickable-label small'>Forgot your Password?</div>
        <div className={'g-basic-button' + (buttonEnabledValue ? ' enabled' : '')}>Log In</div>
      </div>
    </div>
  </div>
}

export default Login;