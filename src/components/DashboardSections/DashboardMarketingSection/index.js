import React, { useState } from 'react'
import './DashboardMarketingSection.scss'

const DashboardMarketingSection = (props) => {
  function formatDateTime(dateTime) {
    const realDate = new Date(dateTime)
    return (realDate.getMonth() + 1) + '/' + realDate.getDate()
  }

  function getMarketRows(marketList, displayAll, upComing) {
    let marketingCampaignsToDisplay = []
    let overflow = false
    if (marketList && marketList.length) {
      const today = new Date()
      for (let i = 0; i < marketList.length; i++) {
        if (marketingCampaignsToDisplay.length >= 2) {
          overflow = true
          if (!displayAll) {
            break
          }
        }
        const startDate = new Date(marketList[i].startDateTime)
        if ((!upComing && startDate <= today) || (upComing && startDate > today)) {
          marketingCampaignsToDisplay.push(marketList[i])
        }
      }
    }
    const marketRows = !marketingCampaignsToDisplay ||
      marketingCampaignsToDisplay.length === 0 ? null : marketingCampaignsToDisplay.map(marketingCampaign => {
        let prospects = 0
        if (marketingCampaign.prospectList && marketingCampaign.prospectList.prospects) {
          prospects += marketingCampaign.prospectList.prospects.length
        }
        return <div className='section-section-data-row' id={marketingCampaign.id}>
          <div className='data-item campaign-data'>{marketingCampaign.title}</div>
          <div className='data-item prospects-data'>{prospects}</div>
          <div className='data-item responses-data'>{upComing ? '' : marketingCampaign.responses ? marketingCampaign.responses.length : 0}</div>
          <div className='data-item date-data'>{formatDateTime(marketingCampaign.startDateTime)}</div>
        </div>
      })
    return { overflow, marketingCampaigns: <div className='section-section-data'>{marketRows}</div> }
  }

  const [displayAllCurrent, setDisplayAllCurrentValue] = useState(false)
  const [displayAllUpcoming, setDisplayAllUpcomingValue] = useState(false)

  const { marketingCampaigns } = props
  let marketingInfo = <div className='none-found'>No Campaigns Created Yet</div>
  const currentMarketRows = getMarketRows(marketingCampaigns, displayAllCurrent)
  const upcomingMarketRows = getMarketRows(marketingCampaigns, displayAllUpcoming, true)

  return (
    <div className='dashboard-marketing-campaigns'>
      <div className='g-page-section'>
        <div className='g-section-header'>
          <div className='g-section-title'>Marketing Campaigns</div>
        </div>
        <div className='section-section'>
          <div className='section-section-label g-basic-label medium'>Current</div>
          <div className='section-section-header'>
            <div className='section-section-caption campaign-caption'>campaign</div>
            <div className='section-section-caption prospects-caption'>prospects</div>
            <div className='section-section-caption responses-caption'>responses</div>
            <div className='section-section-caption date-caption'>date</div>
          </div>
          {currentMarketRows.marketingCampaigns}
          {currentMarketRows && currentMarketRows.overflow ?
            <div className='g-link-item small' onClick={(e) => setDisplayAllCurrentValue(!displayAllCurrent)}>{!displayAllCurrent ? 'SEE ALL >' : 'SEE ALL <'}</div>
            :
            null
          }
        </div>
        <div className='section-section'>
          <div className='section-label g-basic-label medium'>Upcoming</div>
          <div className='section-section-header'>
            <div className='section-section-caption campaign-caption'>campaign</div>
            <div className='section-section-caption prospects-caption'>prospects</div>
            <div className='section-section-caption responses-caption'></div>
            <div className='section-section-caption date-caption'>date</div>
          </div>
          {upcomingMarketRows.marketingCampaigns}
          {upcomingMarketRows && upcomingMarketRows.overflow ?
            <div className='g-link-item small' onClick={(e) => setDisplayAllUpcomingValue(!displayAllUpcoming)}>{!displayAllUpcoming ? 'SEE ALL >' : 'SEE ALL <'}</div>
            :
            null
          }
        </div>
      </div>
    </div>
  )
}

export default DashboardMarketingSection