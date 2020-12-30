import React from 'react'
import { connect } from 'react-redux'
import { API, graphqlOperation } from 'aws-amplify';
import { serializeProspectLists, serializeProspects } from '../../redux/store'
import { AUTH_USER_TOKEN_KEY } from '../../helpers/constants';
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
import { listProspects, listProspectLists } from '../../graphql/queries';
import { createProspect, createProspectList } from '../../graphql/mutations';

const prospectsTableDescriptor = [
  { width: '24px', fieldName: 'selectCheckbox', headerCellTitle: '', isCheckBox: true, checked: false },
  { sortDirection: 'none', width: '94px', fieldName: 'status', headerCellTitle: 'Status', isFramed: true },
  { sortDirection: 'none', width: 'calc(19.2% - 68px)', fieldName: 'firstName', headerCellTitle: 'First Name' },
  { sortDirection: 'none', width: 'calc(19.2% - 68px)', fieldName: 'lastName', headerCellTitle: 'Last Name' },
  { sortDirection: 'none', width: 'calc(19.2% - 68px)', fieldName: 'company', headerCellTitle: 'Company' },
  { sortDirection: 'none', width: 'calc(19.2% - 68px)', fieldName: 'address1', headerCellTitle: 'Street' },
  { sortDirection: 'none', width: 'calc(19.2% - 68px)', fieldName: 'city', headerCellTitle: 'City' },
  { sortDirection: 'none', width: '52px', fieldName: 'state', headerCellTitle: 'State' },
  { sortDirection: 'none', width: '48px', fieldName: 'zip', headerCellTitle: 'Zip' },
  { sortDirection: 'none', width: '106px', fieldName: 'contactInfo', headerCellTitle: 'Contact Info', isContactInfo: true },
]

export class Prospects extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      prospectsTableDescriptor: prospectsTableDescriptor.filter(desc => { return desc }),
      filteredProspects: [],
      searchString: ''
    }

    this.filterProspects = this.filterProspects.bind(this)
    this.handleTableSort = this.handleTableSort.bind(this)
    this.handleHeaderChecked = this.handleHeaderChecked.bind(this)
    this.handleRowChecked = this.handleRowChecked.bind(this)
    this.handleEditProspect = this.handleEditProspect.bind(this)
    this.handleAddProspectButtonPushed = this.handleAddProspectButtonPushed.bind(this)
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this)
    this.handleCreateProspectList = this.handleCreateProspectList.bind(this)
    this.handleCreateProspect = this.handleCreateProspect.bind(this)
    this.fetchProspects = this.fetchProspects.bind(this)
    this.fetchProspectsList = this.fetchProspectsList.bind(this)
  }

  componentDidMount() {
    this.fetchProspectsList()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.prospectLists !== this.props.prospectLists || prevProps.prospects !== this.props.prospects) {
      this.filterProspects()
    }
  }

  async fetchProspects() {
    API.graphql({
      query: listProspects, auth: {
        type: 'AMAZON_COGNITO_USER_POOLS',
        jwtToken: localStorage.getItem(AUTH_USER_TOKEN_KEY)
      }
    }).then(listProspectsResults => {
      const fetchedProspects = []
      if (listProspectsResults.data.listProspects.items && listProspectsResults.data.listProspects.items.length > 0) {
        listProspectsResults.data.listProspects.items.forEach(prospect => {
          this.props.onAddProspectToStore(prospect)
          fetchedProspects.push(prospect)
        })
        this.setState({ filteredProspects: fetchedProspects })
      }
    }).catch(err => {
      alert(err.message? err.message : 'Error in fetchProspects')
    })
  }

  async fetchProspectsList() {
    API.graphql({
      query: listProspectLists, auth: {
        type: 'AMAZON_COGNITO_USER_POOLS',
        jwtToken: localStorage.getItem(AUTH_USER_TOKEN_KEY)
      }
    }).then(listProspectListsResults => {
      if (listProspectListsResults.data.listProspectLists.items && listProspectListsResults.data.listProspectLists.items.length > 0) {
        listProspectListsResults.data.listProspectLists.items.forEach(pl => {
          this.props.onAddProspectListToStore(pl)
        })

        this.fetchProspects()
      }
  
    }).catch(err => {
      alert(err.message? err.message : 'Error in fetchProspectsList')
    })
  }

  handleEditProspect(prospect) {
    
  }

  handleAddProspectButtonPushed() {
    this.setState({ showAddProspect: true })
  }

  handleTableSort(sortField, sortDirection) {
    const { filteredProspects, prospectsTableDescriptor } = this.state

    prospectsTableDescriptor.forEach(ptd => { 
      if (ptd.fieldName === sortField) {
        ptd.sortDirection = sortDirection
      }
      else {
        ptd.sortDirection = 'none'
      }
    })

    filteredProspects.sort((row1, row2) => {
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
    this.setState({filteredProspects, prospectsTableDescriptor})
  }

  handleHeaderChecked(checked) {
    const { prospectsTableDescriptor, filteredProspects } = this.state
    if (prospectsTableDescriptor[0].checked !== checked) {
      prospectsTableDescriptor[0].checked = checked
      const checkedProspects = filteredProspects.map(p => {
        p.checked = checked
        return p
      })
      this.setState({ prospectsTableDescriptor, filteredProspects: checkedProspects })
    }
  }

  handleRowChecked(id, checked) {
    const { filteredProspects } = this.state
    const prospect = filteredProspects.find(p => {
      return p.id === id
    })
    if (prospect) {
      prospect.checked = checked
      this.setState({ filteredProspects })
    }
  }

  filterProspects(searchString) {
    const prospects = !this.props.prospects? [] : this.props.prospects.filter(prospect => {
      if (searchString) {
        const nameConcat = (prospect && prospect.firstName ? prospect.firstName : '') + ' '
          + (prospect && prospect.lastName ? prospect.lastName : '')
        if (nameConcat.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ||
          (prospect.company && prospect.company.toLowerCase().indexOf(searchString.toLowerCase()) >= 0)) {
          return true
        }
        else {
          return false
        }
      }
      else {
        return true
      }
    })
    this.setState({ filteredProspects: prospects })
  }

  handleSearchInput(e) {
    this.setState({ searchString: e.target.value })
  }

  handleSearchKeyDown(e) {
    if (e.keyCode === 27) {
      this.setState({ searchString: '' })
      this.filterProspects()
    }
    else if (e.keyCode === 13) {
      this.filterProspects(this.state.searchString)
    }
  }

  handleCreateProspect(newProspect) {
    const { onAddProspectToStore } = this.props
    if (newProspect.prospectList || newProspect.prospectListId) {
      if (newProspect.prospectList) {
        newProspect.prospectListId = newProspect.prospectList.id
      }
      API.graphql(graphqlOperation(createProspect, {input: newProspect})).then(createdProspect => {
        onAddProspectToStore(createdProspect.data.createProspect)
        this.setState({ prospectToUpdate: null, showAddProspect: false })
      }).catch(err => {
        alert(err.message? err.message : 'Error in create prospect')
      })
    }
    else {
      alert('Prospect List Required')
    }
  }

  handleCreateProspectList(newProspectList) {
    newProspectList.owningUserId = 555
    API.graphql(createProspectList, {input: newProspectList}).then(createdProspectList => {
      const { onCreateProspectList } = this.props
      onCreateProspectList(createdProspectList.data.createProspectList)
    }).catch(err => {
      alert(err.message? err.message : 'Error in create prospect list')
    })
  }

  render() {
    const { filteredProspects, prospectsTableDescriptor, prospectToUpdate } = this.state
    const { prospectLists } = this.props
    const numberSelected = filteredProspects.filter(prospect => {
      return prospect.checked
    }).length
    const totalProspectsShowing = filteredProspects.length
    return (
      <div className='sixty-creek-prospects'>
        <Menu />
        <div className='g-page-background-with-nav'>
          <div className='g-page-header'>
            <div className='g-page-title'>Prospect Lists</div>
          </div>

          <BasicButton title='Add Prospects' enabled={true} buttonPushed={this.handleAddProspectButtonPushed}/>
          {this.state.showAddProspect ?
            <AddProspectForm prospectLists={prospectLists}
              createProspectList={this.handleCreateProspectList}
              createProspect={this.handleCreateProspect}
              prospectToUpdate={prospectToUpdate}
            /> : null}
          <div className="g-page-content" onClick={() => {this.setState({showAddProspect: false})}}>
            <div className='g-page-content-standard'>
              <div className='search-control'>
                <img className='search-icon' src={searchIcon} alt='search' />
                <input className='search-input' value={this.state.searchString} placeholder='Search List...' onChange={this.handleSearchInput} onKeyDown={this.handleSearchKeyDown}/>
              </div>
              <img className='menu-dots' src={menuDots} alt='more-menu'/>
              <div className='number-selected'>{numberSelected > 0 ? numberSelected + ' selected' : 'None selected'}</div>
              <div className='filter'>
                <span className='filter-text'>Filter</span>
                <img className='arrow-icon' src={downArrowIcon} alt='select-filter'/>
              </div>
              <div className='showing-prospects'>
                <span className='showing-text not-bold'>{'Showing '}</span><span className='showing-text bold'>{totalProspectsShowing}</span>
                <span className='showing-text not-bold'>{' of '}</span><span className='showing-text bold'>{filteredProspects.length}</span>
                <span className='showing-text not-bold'>{' prospects'}</span>
              </div>
              <div className='prospects-list'>
                <DataTableHeader tableColumnsDescriptor={prospectsTableDescriptor}
                  handleTableSort={this.handleTableSort} handleCheck={this.handleHeaderChecked} />
                <DataTableContents tableColumnsDescriptor={prospectsTableDescriptor}
                  tableTitle={'Prospects'}
                  data={filteredProspects}
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

const mapDispatchToProps = dispatch => ({
  onAddProspectToStore: prospect => dispatch(createProspectInStore(prospect)),
  onAddProspectListToStore: prospectList => dispatch(createProspectListInStore(prospectList))
})

const mapStateToProps = (state) => ({
  prospectLists: serializeProspectLists(state.prospectLists), 
  prospects: serializeProspects(state.prospects)
})

export default connect(mapStateToProps, mapDispatchToProps)(Prospects)