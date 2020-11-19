import React, { useState } from 'react'
import './AddProspectForm.scss'
import 'react-widgets/lib/scss/react-widgets.scss'
import {Combobox} from 'react-widgets';

const AddProspectForm = (props) => {
  const { prospectToUpdate } = props
  const [changedValue, setChangedValue] = useState(false)
  const [idValue, setIdValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [firstNameValue, setFirstNameValue] = useState('')
  const [lastNameValue, setLastNameValue] = useState('')
  const [companyNameValue, setCompanyNameValue] = useState('')
  const [detailsValue, setDetailsValue] = useState('')
  if (prospectToUpdate && !statusValue) {
    setIdValue(prospectToUpdate.id)
    setStatusValue(prospectToUpdate.status)
    setFirstNameValue(prospectToUpdate.firstName)
    setLastNameValue(prospectToUpdate.lastName)
    setCompanyNameValue(prospectToUpdate.companyName)
    setDetailsValue(prospectToUpdate.details)
    setChangedValue(false)
  }
  else if (!idValue) {
    setChangedValue(false)
    setIdValue(Math.ceil(Math.random() * 100000000))
  }

  return (
    <div className='add-prospect-form'>
      <div className='title-box'>
        Add a Prospect
      </div>
      <div className='sides-container'>
        <div className="left-side">
          <div className='input-box'>
            <div className='label'>Status</div>
            <div className='input-container'>
              <Combobox
                value={statusValue}
                onChange={(value) => {
                  setStatusValue(value)
                  setChangedValue(true)
                }}
                data={['raw', 'contacting', 'ready', 'customer']}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>First Name</div>
            <div className='input-container'>
              <input
                value={firstNameValue}
                onChange={(e) => {
                  setFirstNameValue(e.target.value)
                  setChangedValue(true)
                }}
                type='text'
                name='firstName'
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Last Name</div>
            <div className='input-container'>
              <input
                value={lastNameValue}
                onChange={(e) => {
                  setLastNameValue(e.target.value)
                  setChangedValue(true)
                }}
                type='text'
                name='firstName'
              />
            </div>
          </div>
        </div>
        <div className='right-side'>
          <div className='input-box'>
            <div className='label'>Company Name</div>
            <div className='input-container'>
              <input
                value={companyNameValue}
                onChange={(e) => {
                  setCompanyNameValue(e.target.value)
                  setChangedValue(true)
                }}
                type='text'
                name='firstName'
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Details</div>
            <div className='input-container'>
              <textarea
                value={detailsValue}
                onChange={(e) => {
                  setDetailsValue(e.target.value)
                  setChangedValue(true)
                }}
                type='text'
                name='details'
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'add-button' + (changedValue ? ' enabled' : '')} onClick={changedValue ? (e) => {
        props.addProspect({
          id: prospectToUpdate ? prospectToUpdate.id : idValue,
          status: statusValue,
          firstName: firstNameValue,
          lastName: lastNameValue,
          companyName: companyNameValue,
          details: detailsValue,
        })
        setChangedValue(false)
        setIdValue('')
        setStatusValue('')
        setFirstNameValue('')
        setLastNameValue('')
        setCompanyNameValue('')
        setDetailsValue('')
    
      } : null}>{prospectToUpdate ? 'Update Prospect' : 'Add Prospect'}</div>
    </div>
  )
}

export default AddProspectForm