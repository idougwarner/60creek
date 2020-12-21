import React, { useState } from 'react'
import './AddProspectForm.scss'
import 'react-widgets/lib/scss/react-widgets.scss'
import {Combobox, DropdownList} from 'react-widgets';

const AddProspectForm = (props) => {
  const { prospectToUpdate, prospectLists, createProspectListInStore } = props
  const [changedValue, setChangedValue] = useState(false)
  const [idValue, setIdValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [firstNameValue, setFirstNameValue] = useState('')
  const [lastNameValue, setLastNameValue] = useState('')
  const [companyNameValue, setCompanyNameValue] = useState('')
  const [prospectListValue, setProspectListValue] = useState(null)
  const [detailsValue, setDetailsValue] = useState('')

  function resetValues() {
    setChangedValue(false)
    setIdValue(Math.ceil(Math.random() * 100000000))
    setStatusValue('')
    setFirstNameValue('')
    setLastNameValue('')
    setCompanyNameValue('')
    setDetailsValue('')
    setProspectListValue(null)
  }
  if (prospectToUpdate && statusValue !== prospectToUpdate.status) {
    setIdValue(prospectToUpdate.id)
    setStatusValue(prospectToUpdate.status)
    setFirstNameValue(prospectToUpdate.firstName)
    setLastNameValue(prospectToUpdate.lastName)
    setCompanyNameValue(prospectToUpdate.companyName)
    setDetailsValue(prospectToUpdate.details)
    setProspectListValue(prospectToUpdate.prospectList)
    setChangedValue(false)
  }
  else if (!idValue) {
    resetValues()
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
                data={['Prospect', 'Contacted', 'Responded', 'Cold', 'Warm', 'Do Not Contact']}
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
          <div className='input-box'>
            <div className='label'>Prospect List</div>
            <div className='input-container'>
              <DropdownList
                allowCreate={true}
                value={prospectListValue ? prospectListValue.name : null}
                onCreate={(value) => {
                  if (prospectLists) {
                    let newName = 'Prospect List 1'
                    if (prospectLists.length) {
                      const lastName = prospectLists[prospectLists.length - 1].name
                      const splitName = lastName.split(' ')
                      newName = splitName[0] + ' ' + splitName[1] + ' ' + (parseInt(splitName[2], 10) + 1)
                    }
                    const prospectList = { id: Math.ceil(Math.random() * 100000000), name: newName }
                    createProspectListInStore(prospectList)
                  }
                }
                }
                onSelect={(value) => {
                  if (prospectLists) {
                    let prospectList = prospectLists.find(pl => {
                      return pl.name === value
                    })
                    if (prospectList) {
                      setProspectListValue(prospectList)
                      setChangedValue(true)
                    }
                  }
                }
                }
                data={prospectLists && prospectLists.length ? prospectLists.map(pl => { return pl.name }) : []}
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
          prospectListId: prospectListValue ? prospectListValue.id : null,
        })
        resetValues()
    
      } : null}>{prospectToUpdate ? 'Update Prospect' : 'Add Prospect'}</div>
    </div>
  )
}

export default AddProspectForm