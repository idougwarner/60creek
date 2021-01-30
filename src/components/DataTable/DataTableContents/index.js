import React from 'react'
import CheckBox from '../../../components/controls/CheckBox'
import facebookIcon from '../../../assets/images/face-book.svg'
import emailIcon from '../../../assets/images/email.svg'
import phoneIcon from '../../../assets/images/phone.svg'
import './DataTableContents.scss'

//******************************************************************
//*
//* Prospect List: Handles display of data-table list (NEEDS NEW SKINNING)
//*   This is a function component
//*
//******************************************************************

const DataTableContents = (props) => {
  const { tableColumnsDescriptor, data, handleCheck, tableTitle, editData } = props

  // Set not found in case there are none.
  let tableContents = null
  if (!data || data.length === 0) {
    tableContents = <div className='none-found'>{`No ${tableTitle} Created Yet`}</div>
  }
  else {
    tableContents = !data ? null : data.map((dataRow) => {
      const dataItems = !tableColumnsDescriptor ? null : tableColumnsDescriptor.map(desc => {
        if (desc.isCheckBox) {
          return <div className='detail-item item-checkbox' key={`table-item-${desc.fieldName}`} style={{ width: desc.width }}>
            <CheckBox width={desc.width} checked={dataRow.checked} onSelectCheckBox={(checked) => {
              handleCheck(dataRow.id, checked)
            }} />
          </div>
        }
        else if (desc.isContactInfo) {
          return <div key={`table-item-${desc.fieldName}`} className='detail-item contact-info'>
            <img className='facebook' src={facebookIcon} alt='facebook' />
            <img className='email' src={emailIcon} alt='email' />
            <img className='phone' src={phoneIcon} alt='phone' />
          </div>
        }
        else {
          return <div className='detail-item' key={`table-item-${desc.fieldName}`} style={{ width: desc.width }}>
            <span className={'detail-item-text' + (desc.isFramed ? ' framed' : '')}>{dataRow[desc.fieldName]}</span>
          </div>
        }
      })
      return (
        <div className='data-table-list-row' key={`table-row-${dataRow.id}`} onClick={(e) => editData(dataRow.id)}>
          {dataItems}
        </div>
      )
    }
    )
  }
  return (
    <div className='data-table-list'>
      <div className='data-table-list-items'>
        {tableContents}
      </div>
    </div>
  )
}

export default DataTableContents