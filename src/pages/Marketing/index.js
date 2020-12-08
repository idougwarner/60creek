import React from 'react'
import { connect } from 'react-redux'
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { serializeProspectLists, serializeMarketingCampaigns } from '../../redux/store'
import Menu from '../../components/Menu'
import './Marketing.scss'
import MarketingCampaignList from '../../components/MarketingCampaignList'
import { createMarketingCampaignInStore } from '../../redux/actions'
import AddMarketingCampaignForm from '../../components/AddMarketingCampaignForm'

const stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');

export class Marketing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addingMarket: false,
      addingMarketOpened: false
    }

    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleAddMarketingCampaign = this.handleAddMarketingCampaign.bind(this)
    this.closeAddMarket = this.closeAddMarket.bind(this)
    this.openAddMarket = this.openAddMarket.bind(this)
    this.handleUpdatingMarketingCampaign = this.handleUpdatingMarketingCampaign.bind(this)

    this.wrapperRef = React.createRef()
  }

  closeAddMarket() {
    const wrapper = this.wrapperRef.current
    wrapper.classList.toggle('is-add-marketingCampaign-open')
    this.setState({ addingMarket: false, marketingCampaignToUpdate: null }, () => {
      setTimeout(() => {
        this.setState({addingMarketOpened: false})
      }, 600)
    })
  }
  
  openAddMarket() {
    const wrapper = this.wrapperRef.current
    this.setState({ addingMarketOpened: true }, () => {
      wrapper.classList.toggle('is-add-marketingCampaign-open')
      this.setState({ addingMarket: true })
    })
  }
  
  handleAddClick() {
    if (this.state.addingMarketOpened) {
      this.closeAddMarket()
    }
    else {
      this.openAddMarket()
    }
  }

  handleAddMarketingCampaign(newCampaign) {
    const { onCreatePressed } = this.props
    this.closeAddMarket()
    onCreatePressed(newCampaign)
  }

  handleUpdatingMarketingCampaign(marketingCampaign) {
    if (!this.state.addingMarketOpened) {
      this.setState({ marketingCampaignToUpdate: marketingCampaign }, () => {
        this.openAddMarket()
      })
    }
  }

  render() {

    const { addingMarket, addingMarketOpened, marketingCampaignToUpdate } = this.state
    let addingMarketForm = null
    if (addingMarketOpened) {
      addingMarketForm = <AddMarketingCampaignForm
        prospectLists={this.props.prospectLists}
        addMarketingCampaign={this.handleAddMarketingCampaign} marketingCampaignToUpdate={marketingCampaignToUpdate} />
    }
    return (
      <Elements stripe={stripePromise}>
        <div className="marketing-campaign">
          <Menu />
          <div className='g-page-background-with-nav'>
          
            <div className='marketing-campaign-header'>
              <div className='marketing-campaign-title'>Marketing</div>
              <div className='add-button' onClick={this.handleAddClick}>{addingMarket ? '-' : '+'}</div>
            </div>

            <div className='add-marketingCampaign-wrapper' ref={this.wrapperRef}>
              {addingMarketForm}
            </div>

            <MarketingCampaignList marketingCampaigns={this.props.marketingCampaigns} updateMarketingCampaignInStore={this.handleUpdatingMarketingCampaign}
              short={addingMarket} />
          </div>
        </div>
      </Elements>
    )
  }
}

const mapStateToProps = state => ({
  marketingCampaigns: serializeMarketingCampaigns(state.marketingCampaigns),
  prospectLists: serializeProspectLists(state.prospectLists), 
})

const mapDispatchToProps = dispatch => ({
  onCreatePressed: marketingCampaign => dispatch(createMarketingCampaignInStore(marketingCampaign))
})

export default connect(mapStateToProps, mapDispatchToProps)(Marketing)