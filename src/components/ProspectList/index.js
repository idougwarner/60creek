import React from 'react'
import { connect } from 'react-redux'
import './ProspectList.scss'

const ProspectList = (props) => {
  const { prospects, updateProspect } = props
  let prospectList = <div className='none-found'>No Prospects Created Yet</div>
  if (prospects && prospects.length) {
    prospectList = prospects.map((prospect, key) => {
      return (
        <div className='prospect-list-row' key={key} onClick={(e) => updateProspect(prospect)}>
          <div className='detail-item'>{prospect.status}</div>
          <div className='detail-item'>{prospect.prospectList}</div>
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
  prospects: state.prospects,
})
  

export default connect(mapStateToProps)(ProspectList)