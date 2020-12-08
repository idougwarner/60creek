import React from 'react'
import { connect } from 'react-redux'
import { serializeProspectLists, serializeMarketingCampaigns } from '../../redux/store'
import DashboardMarketingSection from '../../components/DashboardSections/DashboardMarketingSection'
import DashboardProspectsSection from '../../components/DashboardSections/DashboardPropsectsSection'
import DashboardMessagesSection from '../../components/DashboardSections/DashboardMessagesSection'
import './Dashboard.scss'
import Menu from '../../components/Menu'

export class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { marketingCampaigns, prospectLists } = this.props
    return (
      <div className='sixty-creek-dashboard'>
        <Menu />
        <div className='g-page-background-with-nav'>
          <div className='g-page-header'>
            <div className='g-page-title'>Dashboard</div>
          </div>

          <div className="g-page-content">
            <div className='g-page-content-column'>
              <DashboardMarketingSection marketingCampaigns={marketingCampaigns} />
              <DashboardProspectsSection prospectLists={prospectLists} />
            </div>
            <div className='g-page-content-column'>
              <DashboardMessagesSection />
            </div>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  marketingCampaigns: serializeMarketingCampaigns(state.marketingCampaigns),
  prospectLists: serializeProspectLists(state.prospectLists), 
})
  


export default connect(mapStateToProps)(Dashboard)