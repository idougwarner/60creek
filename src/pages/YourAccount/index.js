import React from 'react'
import { withRouter } from 'react-router-dom'
import Menu from '../../components/Menu'
import BasicButton from '../../components/controls/BasicButton'
import './YourAccount.scss'
import { Auth } from 'aws-amplify'

const YourAccount = (props) => {
  const logout = async () => {
    await Auth.signOut();
    props.history.replace('/login');
  }
  return (
    <div className="your-account">
      <Menu />
      <div className='g-page-background-with-nav'>
        <h1>This is Your Account</h1>
        <BasicButton title='Logout' enabled={true} buttonPushed={() => logout()} />
      </div>
    </div>
  )
}

export default withRouter(YourAccount);