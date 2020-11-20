import React from 'react'
import { connect } from 'react-redux'
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Menu from '../../components/Menu'
import './Marketing.scss'
import MarketingCampaignList from '../../components/MarketingCampaignList'
import { createMarketingCampaign } from '../../redux/actions'
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
    wrapper.classList.toggle('is-add-market-open')
    this.setState({ addingMarket: false, marketingCampaignToUpdate: null }, () => {
      setTimeout(() => {
        this.setState({addingMarketOpened: false})
      }, 600)
    })
  }
  
  openAddMarket() {
    const wrapper = this.wrapperRef.current
    this.setState({ addingMarketOpened: true }, () => {
      wrapper.classList.toggle('is-add-market-open')
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

  handleUpdatingMarketingCampaign(market) {
    if (!this.state.addingMarketOpened) {
      this.setState({ marketingCampaignToUpdate: market }, () => {
        this.openAddMarket()
      })
    }
  }

  render() {

    const { addingMarket, addingMarketOpened, marketingCampaignToUpdate } = this.state
    let addingMarketForm = null
    if (addingMarketOpened) {
      addingMarketForm = <AddMarketingCampaignForm
        addMarketingCampaign={this.handleAddMarketingCampaign} marketingCampaignToUpdate={marketingCampaignToUpdate} />
    }
    return (
      <Elements stripe={stripePromise}>
        <div className="markets">
          <Menu />
          <div className='g-page-background-with-nav'>
          
            <div className='markets-header'>
              <div className='markets-title'>Marketing</div>
              <div className='add-button' onClick={this.handleAddClick}>{addingMarket ? '-' : '+'}</div>
            </div>

            <div className='add-market-wrapper' ref={this.wrapperRef}>
              {addingMarketForm}
            </div>

            <MarketingCampaignList markets={this.props.markets} updateMarketingCampaign={this.handleUpdatingMarketingCampaign}
              short={addingMarket} />
          </div>
        </div>
      </Elements>
    )
  }
}

const mapStateToProps = state => ({
  markets:  state.markets,
})

const mapDispatchToProps = dispatch => ({
  onCreatePressed: market => dispatch(createMarketingCampaign(market))
})

export default connect(mapStateToProps, mapDispatchToProps)(Marketing)