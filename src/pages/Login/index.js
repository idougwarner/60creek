import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import './Login.scss'

import Header from '../../components/Header'
import BasicButton from '../../components/controls/BasicButton'

//******************************************************************
//*
//* Login: function component
//*
//******************************************************************

var inputElement = null
const Login = (props) => {

  const { history } = props
  const validateEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    return (false)
  }

  const [buttonEnabledValue, setButtonEnabledValue] = useState(false)
  const [userNameValue, setUserNameValue] = useState(null)
  const [passwordValue, setPasswordValue] = useState(null)
  const [userNameErrorValue, setUserNameErrorValue] = useState(false)
  const [loginErrorValue, setLoginErrorValue] = useState(false)
  const [displayPasswordValue, setDisplayPasswordValue] = useState(false)

  return <div className='sixty-creek-login g-page-background'>
    <Header />
    <div className='sixty-creek-login'>
      <div className='g-centered-form-with-header'>
        <div className='g-form-container'>
          <div className='g-caption'>Log On</div>
          <div className='g-input-box'>
            <div className='g-input-label'>Username</div>
            <input className='g-input-container'
              type='text'
              placeholder='Enter your email address'
              value={userNameValue}
              onChange={(e) => {
                setUserNameErrorValue(false)
                setUserNameValue(e.target.value)
                if (passwordValue && e.target.value) {
                  setButtonEnabledValue(true)
                }
                else {
                  setButtonEnabledValue(false)
                }
              }} />
          </div>
          <div className={'g-input-box' + (userNameErrorValue ? ' error' : '')}>
            <div className='g-input-label'>Password</div>
            <div className={'eye-icon' + (displayPasswordValue ? ' showing-password' : '')} onClick={(e) => {
              setDisplayPasswordValue(!displayPasswordValue)
            }} />
            <input className='g-input-container'
              type={!displayPasswordValue ? 'password' : 'text'}
              placeholder='Enter yout password'
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.target.value)
                if (userNameValue && e.target.value) {
                  setButtonEnabledValue(true)
                }
                else {
                  setButtonEnabledValue(false)
                }
              }} />
            {userNameErrorValue ? <div className='g-error-label smallest'>Invalid Email Address</div> : null}
          </div>
          <Link className='g-link-item small' to="/password-reset">Forgot your Password?</Link>
          <BasicButton title='Log In' enabled={buttonEnabledValue} buttonPushed={(e) => {
            if (!validateEmail(userNameValue)) {
              setUserNameErrorValue(true)
            }
            else {
              history.replace('/dashboard')
            }
          }} />
        </div>
      </div>
    </div>
  </div>
}

export default withRouter(Login);