import React from 'react'
import { withRouter } from 'react-router-dom'
import Menu from '../../components/Menu'
import BasicButton from '../../components/controls/BasicButton'
import './YourAccount.scss'

const YourAccount = (props) => {
  return (
    <div className="your-account">
      <Menu />
      <div className='g-page-background-with-nav'>
        <h1>This is Your Account</h1>
        <BasicButton title='Logout' enabled={true} buttonPushed={(e) => {
          props.history.replace('/login')
        }}/>
      </div>
    </div>
  )
}

export default withRouter(YourAccount);