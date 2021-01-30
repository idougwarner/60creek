import React, { useState, useEffect } from 'react'
import MorePips from '../MorePips'
import './Signup1.scss'

import BasicButton from '../../../components/controls/BasicButton'

//******************************************************************
//*
//* Signup1: function component
//*
//******************************************************************

const Signup1 = (props) => {

  const validateEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    return (false)
  }

  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false)
  const [emailAddressValue, setEmailAddressValue] = useState(props.emailAddress || '')
  const [passwordValue, setPasswordValue] = useState(props.password || '')
  const [userNameErrorValue, setUserNameErrorValue] = useState(false)
  const [displayPasswordValue, setDisplayPasswordValue] = useState(false)
  const [confirmPasswordValue, setConfirmPasswordValue] = useState(props.defaultPasswordConfirm)
  const [firstNameValue, setFirstNameValue] = useState(props.firstName)
  const [lastNameValue, setLastNameValue] = useState(props.lastName)
  const [passwordMismatchValue, setPasswordMismatchValue] = useState(false)

  useEffect(() => {
    if (confirmPasswordValue && passwordValue !== confirmPasswordValue) {
      setPasswordMismatchValue(true)
    }
    else if (firstNameValue && lastNameValue && passwordValue.length > 0 && emailAddressValue && validateEmail(emailAddressValue) &&
      passwordValue && passwordValue === confirmPasswordValue) {
      setNextButtonEnabledValue(true)
      setPasswordMismatchValue(false)
    }
    else {
      setPasswordMismatchValue(false)
      setNextButtonEnabledValue(false)
    }
  }, [firstNameValue, lastNameValue, emailAddressValue, passwordValue, confirmPasswordValue]);


  return (
    <div>
      <div className='g-input-box'>
        <div className='g-input-label required'>First Name</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter First Name'
          value={firstNameValue}
          onChange={(e) => {
            setFirstNameValue(e.target.value)
          }} />
      </div>
      <div className='g-input-box'>
        <div className='g-input-label required'>Last Name</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter Last Name'
          value={lastNameValue}
          onChange={(e) => {
            setLastNameValue(e.target.value)
          }} />
      </div>
      <div className='g-input-box'>
        <div className='g-input-label required'>Email Address</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter Email Address'
          value={emailAddressValue}
          onChange={(e) => {
            setUserNameErrorValue(false)
            setEmailAddressValue(e.target.value)
            if (passwordValue && confirmPasswordValue && e.target.value) {
              setNextButtonEnabledValue(true)
            }
            else {
              setNextButtonEnabledValue(false)
            }
          }} />
        {userNameErrorValue ? <div className='g-error-label smallest'>Invalid Email Address</div> : null}
      </div>
      <div className={'g-input-box' + (userNameErrorValue ? ' error' : '')}>
        <div className='g-input-label required'>Password</div>
        <div className={'eye-icon' + (displayPasswordValue ? ' showing-password' : '')} onClick={(e) => {
          setDisplayPasswordValue(!displayPasswordValue)
        }} />
        <input className='g-input-container'
          type={!displayPasswordValue ? 'password' : 'text'}
          placeholder='Enter Password'
          value={passwordValue}
          onChange={(e) => {
            setPasswordValue(e.target.value)
          }} />
        {passwordValue && passwordValue.length < 6 && <div className='g-error-label smallest'>Password have length greater thean or equeal to 6</div>}
      </div>
      <div className={'g-input-box' + (userNameErrorValue ? ' error' : '')}>
        <div className='g-input-label required'>Confirm Password</div>
        <div className={'eye-icon' + (displayPasswordValue ? ' showing-password' : '')} onClick={(e) => {
          setDisplayPasswordValue(!displayPasswordValue)
        }} />
        <input className='g-input-container'
          type={!displayPasswordValue ? 'password' : 'text'}
          placeholder='Confirm Password'
          value={confirmPasswordValue}
          onChange={(e) => {
            setConfirmPasswordValue(e.target.value)
          }} />
        {passwordMismatchValue ? <div className='g-error-label smallest'>You must confirm your password</div> : null}
      </div>
      <BasicButton title='next' additionalClass='next-button' enabled={nextButtonEnabledValue} buttonPushed={(e) => {
        if (!validateEmail(emailAddressValue)) {
          setUserNameErrorValue(true)
        }
        else {
          props.next(true, firstNameValue, lastNameValue, emailAddressValue, passwordValue)
        }
      }}
      />
      <MorePips pipsConfig={props.pipsConfig} />
    </div>
  )
}

export default Signup1