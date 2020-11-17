import react from 'react'
import { connect } from 'react-redux'
import './Prospects.scss'
import ProspectList from '../../components/ProspectList'
import AddProspectForm from '../../components/AddProspectForm'
import { createProspect } from '../../redux/actions'

export class Prospects extends react.Component {
  constructor(props) {
    super(props)
    this.state = {
      addingProspect: false
    }

    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleAddProspect = this.handleAddProspect.bind(this)
    this.closeOpenAddProspect = this.closeOpenAddProspect.bind(this)
    this.handleUpdatingProspect = this.handleUpdatingProspect.bind(this)

    this.wrapperRef = react.createRef()
  }

  closeOpenAddProspect() {
    const wrapper = this.wrapperRef.current
    wrapper.classList.toggle('is-add-prospect-open')
    this.setState({addingProspect: !this.state.addingProspect})
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

  handleUpdatingProspect(prospect) {
    this.setState({ prospectToUpdate: prospect }, () => {
      this.closeOpenAddProspect()
    })
  }

  render() {

    const { addingProspect, prospectToUpdate } = this.state
    return (
      <div className="prospects">
        <div className='prospects-header'>
          <div className='prospects-title'>Prospects</div>
          <div className='add-button' onClick={this.handleAddClick}>{addingProspect ? '-' : '+'}</div>
        </div>

        <div className='add-prospect-wrapper' ref={this.wrapperRef}>
          <AddProspectForm addProspect={this.handleAddProspect} prospectToUpdate={ prospectToUpdate }/>
        </div>

        <ProspectList prospects={this.props.prospects} updateProspect={ this.handleUpdatingProspect}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  prospects:  state.prospects,
})

const mapDispatchToProps = dispatch => ({
  onCreatePressed: prospect => dispatch(createProspect(prospect))
})

export default connect(mapStateToProps, mapDispatchToProps)(Prospects)