import React from 'react'
import { connect } from 'react-redux'
// import { serializeProspectLists } from '../../../redux/store'
import BasicButton from '../../../components/controls/BasicButton'
import './DashboardProspectsSection.scss'

const DashboardProspectsSection = (props) => {
  const { prospectLists, addProspect } = props

  function getProspectListRows(prospectLists) {
    const prospectListRows = !prospectLists ||
      prospectLists.length === 0 ? null : prospectLists.map(prospectList => {
        let total = 0
        let contacted = 0
        if (prospectList.prospects) {
          total += prospectList.prospects.length
          prospectList.prospects.forEach(prospect => {
            if (prospect && prospect.status === 'Contacted') {
              contacted++
            }
          })
        }
        return <div className='section-section-data-row' id={prospectList.id}>
          <div className='data-item list-data'>{prospectList.name}</div>
          <div className='data-item total-data'>{total}</div>
          <div className='data-item contacted-data'>{contacted}</div>
        </div>
      })
    return <div className='section-section-data'>{prospectListRows}</div>
  }

  const prospectRows = getProspectListRows(prospectLists)

  return (
    <div className='dashboard-prospects'>
      <BasicButton title='Add Prospects' additionalClass='dashboard-add-prospects-button' enabled={true}
        buttonPushed={addProspect} />
      <div className='g-page-section'>
        <div className='g-section-header'>
          <div className='g-section-title'>Prospects</div>
        </div>
        <div className='section-section'>
          <div className='section-section-header'>
            <div className='section-section-caption list-caption'>List</div>
            <div className='section-section-caption total-caption'>Total</div>
            <div className='section-section-caption contacted-caption'>Contacted</div>
          </div>
          {prospectRows}
        </div>
      </div>
    </div>
  )
}

export default DashboardProspectsSection