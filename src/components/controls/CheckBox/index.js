import React from 'react'
import checkMark from '../../../assets/images/checkmark.svg'
import './CheckBox.scss'

const CheckBox = (props) => {
  const { checked, onSelectCheckBox, width, marginTop } = props

  return <div className={'checkbox' + (checked ? ' checked' : '')} onClick={(e) => {
    e.stopPropagation()
    onSelectCheckBox(!checked)
  }
  }
    style={{ width: width ? width : 24, marginTop: marginTop ? marginTop : 0 }}>
    {checked ? <img src={checkMark} alt='CheckMe' /> : null}
  </div>
}

export default CheckBox