import React from 'react'
import { connect } from 'react-redux'
import { serializeProspectLists, serializeMarketingCampaigns } from '../../redux/store'
import './Marketing.scss'
import Menu from '../../components/Menu'
import DataTableHeader from '../../components/DataTable/DataTableHeader'
import DataTableContents from '../../components/DataTable/DataTableContents'
import searchIcon from '../../assets/images/search-icon.svg'
import downArrowIcon from '../../assets/images/sort-down.svg'
import menuDots from '../../assets/images/more-dots.svg'
import BasicButton from '../../components/controls/BasicButton'

const marketingTableDescriptor = [
  { width: '24px', fieldName: 'selectCheckbox', headerCellTitle: '', isCheckBox: true, checked: false },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'title', headerCellTitle: 'Title' },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'prospectListName', headerCellTitle: 'Target List' },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'automatedEmailText', headerCellTitle: 'Automated Email' },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'automatedTextText', headerCellTitle: 'Automated Text' },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'automatedRinglessVoicemailText', headerCellTitle: 'Automated Ringless Voicemail' },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'automatedPostCardText', headerCellTitle: 'Automated Postcard' },
  { sortDirection: 'none', width: 'calc(15% - 47px)', fieldName: 'startDateTimeText', headerCellTitle: 'Start Date/Time' },
  { sortDirection: 'none', width: '85px', fieldName: 'consentText', headerCellTitle: 'Consent' },
  { sortDirection: 'none', width: '80px', fieldName: 'totalText', headerCellTitle: 'Total' },
]

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

export class Marketing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      marketingTableDescriptor: marketingTableDescriptor.filter(desc => { return desc }),
      flattenedMarkets: []
    }

    this.flattenMarkets = this.flattenMarkets.bind(this)
    this.handleTableSort = this.handleTableSort.bind(this)
    this.handleHeaderChecked = this.handleHeaderChecked.bind(this)
    this.handleRowChecked = this.handleRowChecked.bind(this)
    this.handleEditMarket = this.handleEditMarket.bind(this)
    this.handleAddMarketButtonPushed = this.handleAddMarketButtonPushed.bind(this)
  }

  componentDidMount() {
    const { marketingCampaigns } = this.props
    if (marketingCampaigns) {
      this.flattenMarkets()
    }
  }

  handleEditMarket(market) {
    
  }

  handleAddMarketButtonPushed() {
    
  }

  handleTableSort(sortField, sortDirection) {
    const { flattenedMarkets } = this.state
    flattenedMarkets.sort((row1, row2) => {
      if (row1[sortField] < row2[sortField]) {
        return sortDirection === 'asc' ? -1 : 1
      }
      else if (row1[sortField] > row2[sortField]) {
        return sortDirection === 'desc' ? -1 : 1
      }
      else {
        return 0
      }
    })
  }

  handleHeaderChecked(checked) {
    const { marketingTableDescriptor, flattenedMarkets } = this.state
    if (marketingTableDescriptor[0].checked !== checked) {
      marketingTableDescriptor[0].checked = checked
      const checkedMarkets = flattenedMarkets.map(p => {
        p.checked = checked
        return p
      })
      this.setState({ marketingTableDescriptor, flattenedMarkets: checkedMarkets })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.marketingCampaigns !== this.props.marketingCampaigns) {
      this.flattenMarkets()
    }
  }

  handleRowChecked(id, checked) {
    const { flattenedMarkets } = this.state
    const market = flattenedMarkets.find(p => {
      return p.id === id
    })
    if (market) {
      market.checked = checked
      this.setState({ flattenedMarkets })
    }
  }

  flattenMarkets() {
    const { marketingCampaigns } = this.props
    const flattenedMarkets = marketingCampaigns.map(mc => {
      if (mc.prospectList) {
        mc.prospectListName = mc.prospectList.name
      }
      mc.automatedEmailText = mc.automatedEmail ? 'Yes - $.25 a Target' : 'No'
      mc.automatedTextText = mc.automatedText ? 'Yes - $.25 a Target' : 'No'
      mc.automatedRinglessVoicemailText = mc.automatedRinglessVoicemail ? 'Yes - $.25 a Target' : 'No'
      mc.automatedPostCardText = mc.automatedPostCard ? 'Yes - $1.25 a Target' : 'No'
      mc.startDateTimeText = formatDateTime(mc.startDateTime)
      mc.consentText = mc.consent ? 'Yes' : 'No'
      mc.totalText = mc.total ? '$' + mc.total.toFixed(2) : '$0.00'

      return mc
    })
    this.setState({flattenedMarkets })
  }

  render() {
    const { flattenedMarkets, marketingTableDescriptor } = this.state
    const numberSelected = flattenedMarkets.filter(market => {
      return market.checked
    }).length
    const totalMarketsShowing = flattenedMarkets.length
    return (
      <div className='sixty-creek-markets'>
        <Menu />
        <div className='g-page-background-with-nav'>
          <div className='g-page-header'>
            <div className='g-page-title'>Marketing</div>
          </div>

          <BasicButton title='Add Marketing' enabled={true} buttonPushed={this.handleAddMarketButtonPushed}/>

          <div className="g-page-content">
            <div className='g-page-content-standard'>
              <div className='search-control'>
                <img className='search-icon' src={searchIcon} alt='search' />
                <input className='search-input' defaultValue='Search List...'/>
              </div>
              <img className='menu-dots' src={menuDots} alt='more-menu'/>
              <div className='number-selected'>{numberSelected > 0 ? numberSelected + ' selected' : 'None selected'}</div>
              <div className='filter'>
                <span className='filter-text'>Filter</span>
                <img className='arrow-icon' src={downArrowIcon} alt='select-filter'/>
              </div>
              <div className='showing-markets'>
                <span className='showing-text not-bold'>{'Showing '}</span><span className='showing-text bold'>{totalMarketsShowing}</span>
                <span className='showing-text not-bold'>{' of '}</span><span className='showing-text bold'>{flattenedMarkets.length}</span>
                <span className='showing-text not-bold'>{' markets'}</span>
              </div>
              <div className='markets-list'>
                <DataTableHeader tableColumnsDescriptor={marketingTableDescriptor}
                  handleTableSort={this.handleTableSort} handleCheck={this.handleHeaderChecked} />
                <DataTableContents tableColumnsDescriptor={marketingTableDescriptor}
                  tableTitle={'Marketing'}
                  data={flattenedMarkets}
                  editData={this.handleEditMarket}
                  handleCheck={this.handleRowChecked}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  marketingCampaigns: serializeMarketingCampaigns(state.marketingCampaigns),
  prospectLists: serializeProspectLists(state.prospectLists), 
})

const mapDispatchToProps = dispatch => ({
  // onCreatePressed: marketingCampaign => dispatch(createMarketingCampaignInStore(marketingCampaign))
})

export default connect(mapStateToProps, mapDispatchToProps)(Marketing)