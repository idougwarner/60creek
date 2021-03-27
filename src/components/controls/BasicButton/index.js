import React from 'react'
import './BasicButton.scss'

const BasicButton = (props) => {
  const { title, enabled, additionalClass, buttonPushed } = props

  return <div className={'g-basic-button ' + (additionalClass ? additionalClass : '') + (enabled ? ' enabled' : '')} onClick={enabled ? (e) => {
    e.stopPropagation()
    buttonPushed(e)
  }: null}>{title}</div>
}

export default BasicButton