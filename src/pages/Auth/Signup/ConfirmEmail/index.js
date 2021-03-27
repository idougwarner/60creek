import React, { useState, useEffect } from 'react'
import MorePips from '../MorePips'
import './ConfirmEmail.scss'

import BasicButton from '../../../components/controls/BasicButton'

//******************************************************************
//*
//* ConfirmEmail: function component
//*
//******************************************************************

const ConfirmEmail = (props) => {

  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false)
  const [confirmationValue, setConfirmationValue] = useState(null)

  useEffect(() => {
    if (confirmationValue){
      setSubmitButtonEnabled(true)
    }
    else {
      setSubmitButtonEnabled(false)
    }
  }, [confirmationValue]);


  return <div className='sixty-creek-signup g-page-background'>
    <div className='g-form-container'>
      <div className='g-caption'>Check your email for a confirmation code</div>
      <div className='g-input-box'>
        <div className='g-input-label'>{`Confirmation Value${!confirmationValue ? ' (Required)' : ''}`}</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter The Confirmation Code'
          value={confirmationValue}
          onChange={(e) => {
            setConfirmationValue(e.target.value)
          }} />
      </div>
      <BasicButton title='submit' additionalClass='next-button' enabled={submitButtonEnabled} buttonPushed={(e) => {
          props.confirm(confirmationValue)
      }}
      />
      <MorePips pipsConfig={props.pipsConfig}/>
    </div>
  </div>
}

export default ConfirmEmail