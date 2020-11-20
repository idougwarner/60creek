import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import './Login.scss'

import Header from '../../components/Header'
import BasicButton from '../../components/BasicButton'

const Login = (props) => {

  const { history } = props
  const validateEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    return (false)
  }

  const [buttonEnabledValue, setButtonEnabledValue] = useState(false)
  const [userNameValue, setUserNameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [userNameErrorValue, setUserNameErrorValue] = useState(false)
  const [loginErrorValue, setLoginErrorValue] = useState(false)
  const [displayPasswordValue, setDisplayPasswordValue] = useState(false)

  return <div className='sixty-creek-login g-page-background'>
    <Header />
    <div className='g-centered-form'>
      <div className='g-form-container'>
        <div className='g-caption'>Log On</div>
        <div className={'g-input-box' + (userNameErrorValue ? ' error' : '')}>
          <div className='g-input-label'>Username</div>
          <input className='g-input-container'
            type='text'
            placeholder='Enter the Email Address'
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
          {userNameErrorValue ? <div className='error-label'>Invalid Email Address</div> : null}
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
                setButtonEnabledValue(true)
              }
              else {
                setButtonEnabledValue(false)
              }
            }} />
        </div>
        <div className='g-clickable-label small'>Forgot your Password?</div>
        <BasicButton title='Log In' enabled={buttonEnabledValue} buttonPushed={(e) => {
          if (!validateEmail(userNameValue)) {
            setUserNameErrorValue(true)
          }
          else {
            history.replace('/dashboard')
          }
        }}/>
      </div>
    </div>
  </div>
}

export default withRouter(Login);