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
  const { markets, updateMarketingCampaign } = props
  let marketingList = <div className='none-found'>No Campaigns Created Yet</div>
  if (markets && markets.length) {
    marketingList = markets.map((market, key) => {
      return (
        <div className='marketing-list-row' key={key} onClick={(e) => updateMarketingCampaign(market)}>
          <div className='detail-item'>{market.title}</div>
          <div className='detail-item'>{market.targetList ? market.targetList.name : null}</div>
          <div className='detail-item'>{market.automatedEmail ? 'Yes - $.25 a Target' : 'No'}</div>
          <div className='detail-item'>{market.automatedText ? 'Yes - $.25 a Target' : 'No'}</div>
          <div className='detail-item'>{market.automatedRinglessVoicemail ? 'Yes - $.25 a Target' : 'No'}</div>
          <div className='detail-item'>{market.automatedPostCard ? 'Yes - $1.25 a Target' : 'No'}</div>
          <div className='detail-item'>{formatDateTime(market.startDateTime)}</div>
          <div className='detail-item'>{market.consent ? 'Yes' : 'No'}</div>
          <div className='detail-item'>{market.total ? '$' + market.total.toFixed(2) : '$0.00'}</div>
        </div>
      )
    }
    )
  }
  return (
    <div className={'marketing-list'}>
      <div className="marketing-list-header">
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
      <div className={'marketing-list-items' + (props.short ? ' short' : '')}>
        {marketingList}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  marketing: state.marketing,
})
  

export default connect(mapStateToProps)(MarketingCampaignList)