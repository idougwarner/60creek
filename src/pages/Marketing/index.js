import react from 'react'
import { connect } from 'react-redux'
import './Marketing.scss'
import MarketingCampaignList from '../../components/MarketingCampaignList'
import { createMarketingCampaign } from '../../redux/actions'
import AddMarketingCampaignForm from '../../components/AddMarketingCampaignForm'

export class Marketing extends react.Component {
  constructor(props) {
    super(props)
    this.state = {
      addingMarket: false
    }

    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleAddMarketingCampaign = this.handleAddMarketingCampaign.bind(this)
    this.closeOpenAddMarket = this.closeOpenAddMarket.bind(this)
    this.handleUpdatingMarketingCampaign = this.handleUpdatingMarketingCampaign.bind(this)

    this.wrapperRef = react.createRef()
  }

  closeOpenAddMarket() {
    const wrapper = this.wrapperRef.current
    wrapper.classList.toggle('is-add-market-open')
    this.setState({addingMarket: !this.state.addingMarket, marketingCampaignToUpdate: null})
  }
  
  handleAddClick() {
    this.closeOpenAddMarket()
    this.setState(this.state.visible)

  }

  handleAddMarketingCampaign(newCampaign) {
    const { onCreatePressed } = this.props
    this.closeOpenAddMarket()
    onCreatePressed(newCampaign)
  }

  handleUpdatingMarketingCampaign(market) {
    this.setState({ marketingCampaignToUpdate: market }, () => {
      this.closeOpenAddMarket()
    })
  }

  render() {

    const { addingMarket, marketingCampaignToUpdate } = this.state
    return (
      <div className="markets">
        <div className='markets-header'>
          <div className='markets-title'>Marketing</div>
          <div className='add-button' onClick={this.handleAddClick}>{addingMarket ? '-' : '+'}</div>
        </div>

        <div className='add-market-wrapper' ref={this.wrapperRef}>
          <AddMarketingCampaignForm addMarketingCampaign={this.handleAddMarketingCampaign} marketingCampaignToUpdate={ marketingCampaignToUpdate }/>
        </div>

        <MarketingCampaignList markets={this.props.markets} updateMarketingCampaign={ this.handleUpdatingMarketingCampaign}/>
      </div>
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