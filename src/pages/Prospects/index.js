import React from 'react'
import { connect } from 'react-redux'
import { serializeProspectLists } from '../../redux/store'
import './Prospects.scss'
import Menu from '../../components/Menu'
import DataTableHeader from '../../components/DataTable/DataTableHeader'
import DataTableContents from '../../components/DataTable/DataTableContents'
import searchIcon from '../../assets/images/search-icon.svg'
import downArrowIcon from '../../assets/images/sort-down.svg'
import menuDots from '../../assets/images/more-dots.svg'
import BasicButton from '../../components/controls/BasicButton'
import AddProspectForm from '../../components/AddProspectForm'
import { createProspectInStore, createProspectListInStore } from '../../redux/actions'

const prospectsTableDescriptor = [
  { width: '24px', fieldName: 'selectCheckbox', headerCellTitle: '', isCheckBox: true, checked: false },
  { sortDirection: 'none', width: '94px', fieldName: 'status', headerCellTitle: 'Status', isFramed: true },
  { sortDirection: 'none', width: 'calc(19.2% - 70px)', fieldName: 'firstName', headerCellTitle: 'First Name' },
  { sortDirection: 'none', width: 'calc(19.2% - 70px)', fieldName: 'lastName', headerCellTitle: 'Last Name' },
  { sortDirection: 'none', width: 'calc(19.2% - 70px)', fieldName: 'company', headerCellTitle: 'Company' },
  { sortDirection: 'none', width: 'calc(19.2% - 70px)', fieldName: 'street', headerCellTitle: 'Street' },
  { sortDirection: 'none', width: 'calc(19.2% - 70px)', fieldName: 'city', headerCellTitle: 'City' },
  { sortDirection: 'none', width: '48px', fieldName: 'state', headerCellTitle: 'State' },
  { sortDirection: 'none', width: '44px', fieldName: 'zip', headerCellTitle: 'Zip' },
  { sortDirection: 'none', width: '104px', fieldName: 'contactInfo', headerCellTitle: 'Contact Info', isContactInfo: true },
]

export class Prospects extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      prospectsTableDescriptor: prospectsTableDescriptor.filter(desc => { return desc }),
      flattenedProspects: []
    }

    this.flattenProspects = this.flattenProspects.bind(this)
    this.handleTableSort = this.handleTableSort.bind(this)
    this.handleHeaderChecked = this.handleHeaderChecked.bind(this)
    this.handleRowChecked = this.handleRowChecked.bind(this)
    this.handleEditProspect = this.handleEditProspect.bind(this)
    this.handleAddProspectButtonPushed = this.handleAddProspectButtonPushed.bind(this)
  }

  componentDidMount() {
    const { prospectLists } = this.props
    if (prospectLists) {
      this.flattenProspects()
    }
  }

  handleEditProspect(prospect) {
    
  }

  handleAddProspectButtonPushed() {
    
  }

  handleTableSort(sortField, sortDirection) {
    const { flattenedProspects } = this.state
    flattenedProspects.sort((row1, row2) => {
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
    const { prospectsTableDescriptor, flattenedProspects } = this.state
    if (prospectsTableDescriptor[0].checked !== checked) {
      prospectsTableDescriptor[0].checked = checked
      const checkedProspects = flattenedProspects.map(p => {
        p.checked = checked
        return p
      })
      this.setState({ prospectsTableDescriptor, flattenedProspects: checkedProspects })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.prospectLists !== this.props.prospectLists) {
      this.flattenProspects()
    }
  }

  handleRowChecked(id, checked) {
    const { flattenedProspects } = this.state
    const prospect = flattenedProspects.find(p => {
      return p.id === id
    })
    if (prospect) {
      prospect.checked = checked
      this.setState({ flattenedProspects })
    }
  }

  flattenProspects() {
    const prospects = []
    const { prospectLists } = this.props
    if (prospectLists) {
      prospectLists.forEach(prospectList => {
        if (prospectList && prospectList.prospects) {
          prospectList.prospects.forEach(prospect => { 
            if (!prospects.find(p => { return prospect.id === p.id })) {
              prospects.push({ ...prospect })
            }
          })
        }
      })
    }
    this.setState({flattenedProspects: prospects})
  }

  render() {
    const { flattenedProspects, prospectsTableDescriptor } = this.state
    const numberSelected = flattenedProspects.filter(prospect => {
      return prospect.checked
    }).length
    const totalProspectsShowing = flattenedProspects.length
    return (
      <div className='sixty-creek-prospects'>
        <Menu />
        <div className='g-page-background-with-nav'>
          <div className='g-page-header'>
            <div className='g-page-title'>Prospect Lists</div>
          </div>

          <BasicButton title='Add Prospects' enabled={true} buttonPushed={this.handleAddProspectButtonPushed}/>

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
              <div className='showing-prospects'>
                <span className='showing-text not-bold'>{'Showing '}</span><span className='showing-text bold'>{totalProspectsShowing}</span>
                <span className='showing-text not-bold'>{' of '}</span><span className='showing-text bold'>{flattenedProspects.length}</span>
                <span className='showing-text not-bold'>{' prospects'}</span>
              </div>
              <div className='prospects-list'>
                <DataTableHeader tableColumnsDescriptor={prospectsTableDescriptor}
                  handleTableSort={this.handleTableSort} handleCheck={this.handleHeaderChecked} />
                <DataTableContents tableColumnsDescriptor={prospectsTableDescriptor}
                  tableTitle={'Prospects'}
                  data={flattenedProspects}
                  editData={this.handleEditProspect}
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

const mapStateToProps = (state) => ({
  prospectLists: serializeProspectLists(state.prospectLists), 
})
  


export default connect(mapStateToProps)(Prospects)