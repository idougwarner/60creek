import React from 'react'
import { connect } from 'react-redux'
import './MarketingCampaignList.scss'

const MarketingCampaignList = (props) => {
  function formatDateTime(dateTime) {
    const realDate = new Date(dateTime)
    let hours = realDate.getHours()
    let amPm = ' am'
    if (hours === 0) {
      hours = 12
    }
    else if (hours > 12) {
      hours -= 12
      amPm = ' pm'
    }
    else if (hours === 12) {
      amPm = ' pm'
    }
    return realDate.getMonth() + '/' + realDate.getDate() + '/' + realDate.getFullYear() + ' ' +
      hours + ':' + (realDate.getMinutes() < 10 ? '0' : '') + realDate.getMinutes() + amPm
  }
  const { marketingCampaigns, updateMarketingCampaignInStore } = props
  let marketingList = <div className='none-found'>No Campaigns Created Yet</div>
  if (marketingCampaigns && marketingCampaigns.length) {
    marketingList = marketingCampaigns.map((marketingCampaign, key) => {
      return (
        <div className='marketing-campaign-list-row' key={key} onClick={(e) => updateMarketingCampaignInStore(marketingCampaign)}>
          <div className='detail-item'>{marketingCampaign.title}</div>
          <div className='detail-item'>{marketingCampaign.prospectList ? marketingCampaign.prospectList.name : null}</div>
          <div className='detail-item'>{marketingCampaign.automatedEmail ? 'Yes - $.25 a Target' : 'No'}</div>
          <div className='detail-item'>{marketingCampaign.automatedText ? 'Yes - $.25 a Target' : 'No'}</div>
          <div className='detail-item'>{marketingCampaign.automatedRinglessVoicemail ? 'Yes - $.25 a Target' : 'No'}</div>
          <div className='detail-item'>{marketingCampaign.automatedPostCard ? 'Yes - $1.25 a Target' : 'No'}</div>
          <div className='detail-item'>{formatDateTime(marketingCampaign.startDateTime)}</div>
          <div className='detail-item'>{marketingCampaign.consent ? 'Yes' : 'No'}</div>
          <div className='detail-item'>{marketingCampaign.total ? '$' + marketingCampaign.total.toFixed(2) : '$0.00'}</div>
        </div>
      )
    }
    )
  }
  return (
    <div className={'marketing-campaign-list'}>
      <div className="marketing-campaign-list-header">
        <div className='header-item'><span>Title</span></div>
        <div className='header-item'><span>Target List</span></div>
        <div className='header-item'><span>Automated Email</span></div>
        <div className='header-item'><span>Automated Text</span></div>
        <div className='header-item'><span>Automated Ringless Voicemail</span></div>
        <div className='header-item'><span>Automated Postcard</span></div>
        <div className='header-item'><span>Start Date/Time</span></div>
        <div className='header-item'><span>Consent</span></div>
        <div className='header-item'><span>Total</span></div>
      </div>
      <div className={'marketing-campaign-list-items' + (props.short ? ' short' : '')}>
        {marketingList}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
})


export default connect(mapStateToProps)(MarketingCampaignList)