import React from 'react'
import { connect } from 'react-redux'
import { serializeProspectLists } from '../../redux/store'
import './ProspectList.scss'

const ProspectList = (props) => {
  const { prospectLists, updateProspectInStore } = props
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
            <div className='detail-item'>{prospect.status}</div>
            <div className='detail-item'>{prospect.prospectList ? prospect.prospectList.name : 'None'}</div>
            <div className='detail-item'>{prospect.firstName}</div>
            <div className='detail-item'>{prospect.lastName}</div>
            <div className='detail-item'>{prospect.companyName}</div>
            <div className='detail-item'>{prospect.enhancedEmailAddress}</div>
            <div className='detail-item'>{prospect.enhancedFacebookHandle}</div>
            <div className='detail-item allow-hover'>{prospect.details}</div>
          </div>
        )
      }
      )
    }
  }
  return (
    <div className='prospect-list'>
      <div className="prospect-list-header">
        <div className='header-item'><span>Status</span></div>
        <div className='header-item'><span>Prospect List</span></div>
        <div className='header-item'><span>First Name</span></div>
        <div className='header-item'><span>Last Name</span></div>
        <div className='header-item'><span>Company Name</span></div>
        <div className='header-item'><span>Enhanced Email Address</span></div>
        <div className='header-item'><span>Enhanded Facebook Handle</span></div>
        <div className='header-item'><span>Details</span></div>
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