import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import './PasswordReset.scss'

import Header from '../../components/Header'
import BasicButton from '../../components/BasicButton'

const PasswordReset = (props) => {

  const { history } = props

  let inputElement = null
  const validateEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    return (false)
  }

  const [buttonEnabledValue, setButtonEnabledValue] = useState(false)
  const [userNameValue, setUserNameValue] = useState(null)
  const [userNameErrorValue, setUserNameErrorValue] = useState(false)

  return <div className='sixty-creek-password-reset g-page-background'>
    <Header />
    <div className='sixty-creek-password-reset'>
      <div className='g-centered-form-with-header'>
        <div className='g-form-container'>
          <div className='g-caption'>Password Reset</div>
          <div className='g-instruction-block'>Enter your email address to receive a link to reset your password.</div>
          <div className={'g-input-box' + (userNameErrorValue ? ' error' : '')}>
            <div className='g-input-label'>Email</div>
            <input className='g-input-container'
              type='text'
              placeholder='Enter your email address'
              value={userNameValue}
              onChange={(e) => {
                setUserNameErrorValue(false)
                setUserNameValue(e.target.value)
                if (e.target.value) {
                  setButtonEnabledValue(true)
                }
                else {
                  setButtonEnabledValue(false)
                }
              }} />
            {userNameErrorValue ? <div className='g-error-label smallest'>Invalid Email Address</div> : null}
          </div>
          <BasicButton title='RESET PASSWORD' enabled={buttonEnabledValue} buttonPushed={(e) => {
            if (!validateEmail(userNameValue)) {
              setUserNameErrorValue(true)
            }
            else {
              history.replace('/link-sent')
            }
          }} />
          <Link className='g-link-item small' to="/login">Remember your Password?</Link>
        </div>
      </div>
    </div>
  </div>
}

export default withRouter(PasswordReset);