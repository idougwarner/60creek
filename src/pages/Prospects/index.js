import React from 'react'
import { connect } from 'react-redux'
import { serializeProspectLists } from '../../redux/store'
import './Prospects.scss'
import Menu from '../../components/Menu'
import ProspectList from '../../components/ProspectList'
import AddProspectForm from '../../components/AddProspectForm'
import { createProspectInStore, createProspectListInStore } from '../../redux/actions'

//******************************************************************
//*
//* Prospects (also known as targets) (NEEDS NEW SKINNING)
//*   This is a class object-- candidate for becoming a function component
//*
//******************************************************************

export class Prospects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addingProspect: false
    }

    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleAddProspect = this.handleAddProspect.bind(this)
    this.handleCreateProspectList = this.handleCreateProspectList.bind(this)
    this.closeOpenAddProspect = this.closeOpenAddProspect.bind(this)
    this.handleUpdatingProspect = this.handleUpdatingProspect.bind(this)

    this.wrapperRef = React.createRef()
  }

  closeOpenAddProspect() {
    const wrapper = this.wrapperRef.current
    wrapper.classList.toggle('is-add-prospect-open')
    this.setState({ addingProspect: !this.state.addingProspect })
  }
  
  handleAddClick() {
    this.closeOpenAddProspect()
  }

  handleAddProspect(newProspect) {
    const { onCreatePressed } = this.props
    this.closeOpenAddProspect()
    onCreatePressed(newProspect)
    this.setState({ prospectToUpdate: null })
  }

  handleCreateProspectList(newProspectList) {
    const { onCreateProspectList } = this.props
    onCreateProspectList(newProspectList)
  }

  handleUpdatingProspect(prospect) {
    this.setState({ prospectToUpdate: prospect }, () => {
      this.closeOpenAddProspect()
    })
  }

  render() {

    const { addingProspect, prospectToUpdate } = this.state
    const { prospectLists } = this.props
    return (
      <div className="prospects">
        <Menu />
        <div className='g-page-background-with-nav'>
          <div className='prospects-header'>
            <div className='prospects-title'>Prospects</div>
            <div className='add-button' onClick={this.handleAddClick}>{addingProspect ? '-' : '+'}</div>
          </div>

          <div className='add-prospect-wrapper' ref={this.wrapperRef}>
            <AddProspectForm prospectLists={prospectLists}
              createProspectListInStore={this.handleCreateProspectList} addProspect={this.handleAddProspect} prospectToUpdate={prospectToUpdate} />
          </div>

          <ProspectList prospectLists={prospectLists} updateProspectInStore={this.handleUpdatingProspect} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  prospectLists: serializeProspectLists(state.prospectLists), 
})

const mapDispatchToProps = dispatch => ({
  onCreatePressed: prospect => dispatch(createProspectInStore(prospect)),
  onCreateProspectList: prospectList => dispatch(createProspectListInStore(prospectList))
})

export default connect(mapStateToProps, mapDispatchToProps)(Prospects)