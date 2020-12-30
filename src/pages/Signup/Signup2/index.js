import React, { useState, useEffect } from 'react'
import MorePips from '../MorePips'
import './Signup2.scss'

import BasicButton from '../../../components/controls/BasicButton'
import { Combobox } from 'react-widgets';

//******************************************************************
//*
//* Signup2: function component
//*
//******************************************************************

const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY"
]

const Signup2 = (props) => {

  const validateEmail = (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    return (false)
  }

  const [companyNameValue, setCompanyNameValue] = useState(props.companyName)
  const [phoneValue, setPhoneValue] = useState(props.phone)
  const [address1Value, setAddress1Value] = useState(props.address1)
  const [address2Value, setAddress2Value] = useState(props.address2)
  const [cityValue, setCityValue] = useState(props.city)
  const [stateValue, setStateValue] = useState(props.state)
  const [zipValue, setZipValue] = useState(props.zip)
  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false)

  useEffect(() => {
    if (companyNameValue && phoneValue && address1Value && cityValue && stateValue && zipValue) {
      setNextButtonEnabledValue(true)
    }
    else {
      setNextButtonEnabledValue(false)
    }
  }, [companyNameValue, phoneValue, address1Value, address2Value, cityValue, stateValue, zipValue]);


  return <div className='sixty-creek-signup g-page-background'>
    <div className='g-form-container'>
      <div className='g-caption'>Sign Up</div>
      <div className='g-input-box'>
        <div className='g-input-label'>{`Company Name${!companyNameValue ? ' (Required)' : ''}`}</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter Company Name'
          value={companyNameValue}
          onChange={(e) => {
            setCompanyNameValue(e.target.value)
          }} />
      </div>
      <div className='g-input-box'>
        <div className='g-input-label'>{`Phone Number${!phoneValue ? ' (Required)' : ''}`}</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter Phone Number'
          value={phoneValue}
          onChange={(e) => {
            setPhoneValue(e.target.value)
          }} />
      </div>
      <div className='g-form-line'>
        <div className={'g-half-input-box'}>
        <div className='g-input-label'>{`Street Address${!address1Value ? ' (Required)' : ''}`}</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter Street Address'
          value={address1Value}
          onChange={(e) => {
            setAddress1Value(e.target.value)
            if (address2Value && cityValue && e.target.value) {
              setNextButtonEnabledValue(true)
            }
            else {
              setNextButtonEnabledValue(false)
            }
          }} />
      </div>
      <div className={'g-half-input-box'}>
        <div className='g-input-label'>{'Address Line 2'}</div>
        <input className='g-input-container'
          type='text'
          placeholder='Enter Street Address'
          value={address2Value}
          onChange={(e) => {
            setAddress2Value(e.target.value)
          }} />
      </div>
      </div>
      <div className={'g-input-box'}>
        <div className='g-input-label'>{`City${!cityValue ? ' (Required)' : ''}`}</div>
        <input className='g-input-container'
          type={'text'}
          placeholder='Enter City'
          value={cityValue}
          onChange={(e) => {
            setCityValue(e.target.value)
          }} />
      </div>
      <div className='g-form-line'>
        <div className={'g-half-input-box'}>
          <div className='g-input-label'>{`State${!stateValue ? ' (Required)' : ''}`}</div>
          <div className='g-input-container combobox'>
          <Combobox
                value={stateValue}
              onSelect={(value) => {
                  setStateValue(value)
                }
              }
              data={
                  usStates
                }
              />            
            </div>
        </div>
        <div className={'g-half-input-box'}>
          <div className='g-input-label'>{`Zip${!zipValue ? ' (Required)' : ''}`}</div>
          <input className='g-input-container'
            type={'text'}
            placeholder='Zip'
            value={zipValue}
            onChange={(e) => {
              setZipValue(e.target.value)
            }} />
        </div>
      </div>
      <BasicButton title='Previous' additionalClass='previous-button' enabled={true} buttonPushed={(e) => {
        props.previous(false, companyNameValue, phoneValue, address1Value, address2Value, cityValue, stateValue, zipValue)
      }}
      />
      <BasicButton title='next' additionalClass='next-button' enabled={nextButtonEnabledValue} buttonPushed={(e) => {
        props.next(true, companyNameValue, phoneValue, address1Value, address2Value, cityValue, stateValue, zipValue)
      }}
      />
      <MorePips pipsConfig={props.pipsConfig} />
    </div>
  </div>
}

export default Signup2