import React from 'react'
import { connect } from 'react-redux'
import { serializeProspectLists } from '../../redux/store'
import SortableHeaderCell from '../DataTable/DataTableHeader/SortableHeaderCell'
import CheckBox from '../../components/controls/CheckBox'
import './ProspectList.scss'

//******************************************************************
//*
//* Prospect List: Handles display of prospect list (NEEDS NEW SKINNING)
//*   This is a function component
//*
//******************************************************************

const columnWidths = [
  '24px',
  '94px',
  'calc(16% - 60px)',
  'calc(16% - 60px)',
  'calc(16% - 60px)',
  'calc(16% - 60px)',
  'calc(16% - 60px)',
  '48px',
  '44px',
  '96px',
]

const ProspectList = (props) => {
  const { prospectLists, updateProspectInStore } = props

  // Set not found in case there are none.
  let prospectList = <div className='none-found'>No Prospects Created Yet</div>
  if (prospectLists && prospectLists.length) {
    let prospects = []
    prospectLists.forEach(prospectList => {
      if (prospectList.prospects) {
        prospectList.prospects.forEach(prospect => {
          prospects.push(prospect)
        })
      }
    })
    if (prospects.length === 0) {
      prospectList = <div className='none-found'>No Prospects Created Yet</div>
    }
    else {
      prospectList = prospects.map((prospect, key) => {
        return (
          <div className='prospect-list-row' key={key} onClick={(e) => updateProspectInStore(prospect)}>
            <div className='detail-item item-checkbox' style={{ width: columnWidths[0] }}>
              <CheckBox />
            </div>
            <div className='detail-item' style={{ width: columnWidths[1] }}>
              <span className='detail-item-text framed'>{prospect.status}</span>
              </div>
            <div className='detail-item' style={{ width: columnWidths[2] }}>
              <span className='detail-item-text'>{prospect.firstName}</span>
            </div>
            <div className='detail-item' style={{ width: columnWidths[3] }}>
              <span className='detail-item-text'>{prospect.lastName}</span>
            </div>
            <div className='detail-item' style={{ width: columnWidths[4] }}>
              <span className='detail-item-text'>{prospect.companyName}</span>
            </div>
            <div className='detail-item' style={{ width: columnWidths[5] }}>
              <span className='detail-item-text'>{prospect.stree}</span>
            </div>
            <div className='detail-item' style={{ width: columnWidths[6] }}>
              <span className='detail-item-text'>{prospect.city}</span>
            </div>
            <div className='detail-item' style={{ width: columnWidths[7] }}>
              <span className='detail-item-text'>{prospect.state}</span>
            </div>
            <div className='detail-item' style={{ width: columnWidths[8] }}>
              <span className='detail-item-text'>{prospect.zip}</span>
            </div>
          </div>
        )
      }
      )
    }
  }
  return (
    <div className='prospect-list'>
      <div className="prospect-list-header">
        <SortableHeaderCell width={columnWidths[0]} headerCellTitle=''/>
        <SortableHeaderCell width={columnWidths[1]} headerCellTitle='Status' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[2]} headerCellTitle='First' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[3]} headerCellTitle='Last' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[4]} headerCellTitle='Company' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[5]} headerCellTitle='Street' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[6]} headerCellTitle='City' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[7]} headerCellTitle='State' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[8]} headerCellTitle='Zip' sortDirection='none' />
        <SortableHeaderCell width={columnWidths[9]} headerCellTitle='Contact Info' />
      </div>
      <div className='prospect-list-items'>
        {prospectList}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  prospectLists: serializeProspectLists(state.prospectLists), 
})
  

export default connect(mapStateToProps)(ProspectList)