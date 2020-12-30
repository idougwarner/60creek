import React, { useState } from 'react'
import { connect } from 'react-redux'
import { API, graphqlOperation } from 'aws-amplify';
import { withRouter, Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { AUTH_USER_TOKEN_KEY } from '../../helpers/constants';
import { listUsers, getUser } from '../../graphql/queries';
import { createUserInStore } from '../../redux/actions'

import './Login.scss'

import Header from '../../components/Header'
import BasicButton from '../../components/controls/BasicButton'

//******************************************************************
//*
//* Login: class component
//*
//******************************************************************

const validateEmail = (email) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return (true)
  }
  return (true)
}

export class Login extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      buttonEnabledValue: false,
      userNameValue: null,
      passwordValue: null,
      userNameErrorValue: false,
      loginErrorValue: '',
      displayPasswordValue: false
    }
    this.handleGetUser = this.handleGetUser.bind(this)
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps) {
    
  }

  handleGetUser(cognitoUserName) {
    API.graphql(graphqlOperation(listUsers, { filter: { cognitoUserName: { eq: cognitoUserName } } })).then(userResults => {

      if (userResults && userResults.data && userResults.data.listUsers && userResults.data.listUsers.items && userResults.data.listUsers.items.length > 0) {
          this.props.onAddUserToStore(userResults.data.listUsers.items[0])
      }  
    }).catch(err => {
      alert(err.message ? err.message : 'Could not get user')
    })
  }

  render() {
    const { buttonEnabledValue, userNameValue, passwordValue, userNameErrorValue, loginErrorValue, displayPasswordValue } = this.state

    return <div className='sixty-creek-login g-page-background'>
      <Header />
      <div className='sixty-creek-login'>
        <div className='g-centered-form-with-header'>
          <div className='g-form-container'>
            <div className='g-caption'>Log On</div>
            <div className='g-input-box'>
              <div className='g-input-label'>Username</div>
              <input className='g-input-container'
                type='text'
                placeholder='Enter your email address'
                value={userNameValue}
                onChange={(e) => {
                  this.setState({ userNameErrorValue: false })
                  this.setState({ userNameValue: e.target.value })
                  if (passwordValue && e.target.value) {
                    this.setState({ buttonEnabledValue: true })
                  }
                  else {
                    this.setState({ buttonEnabledValue: false })
                  }
                }} />
            </div>
            <div className={'g-input-box' + (userNameErrorValue || loginErrorValue ? ' error' : '')}>
              <div className='g-input-label'>Password</div>
              <div className={'eye-icon' + (displayPasswordValue ? ' showing-password' : '')} onClick={(e) => {
                this.setState({ displayPasswordValue: !displayPasswordValue })
              }} />
              <input className='g-input-container'
                type={!displayPasswordValue ? 'password' : 'text'}
                placeholder='Enter yout password'
                value={passwordValue}
                onChange={(e) => {
                  this.setState({ passwordValue: e.target.value })
                  if (userNameValue && e.target.value) {
                    this.setState({ buttonEnabledValue: true })
                  }
                  else {
                    this.setState({ buttonEnabledValue: false })
                  }
                }} />
              {userNameErrorValue ? <div className='g-error-label smallest'>Invalid Email Address</div> : null}
              {loginErrorValue ? <div className='g-error-label smallest'>{loginErrorValue}</div> : null}
            </div>
            <Link className='g-link-item small' to="/password-reset">Forgot your Password?</Link>
            <BasicButton title='Log In' enabled={buttonEnabledValue} buttonPushed={(e) => {
              if (!validateEmail(userNameValue)) {
                this.setState({ userNameErrorValue: true })
              }
              else {
                Auth.signIn(userNameValue, passwordValue).then(user => {
                  this.handleGetUser(user.username)
                  localStorage.setItem(AUTH_USER_TOKEN_KEY, user.signInUserSession.accessToken.jwtToken);
                  this.props.history.replace('/dashboard')
                }).catch(err => {
                  this.setState({ setLoginErrorValue: err.message })
                }
                )
              }
            }}
            />
          </div>
        </div>
      </div>
    </div>
  }
}

const mapDispatchToProps = dispatch => ({
  onAddUserToStore: user => dispatch(createUserInStore(user))
})

export default connect(null, mapDispatchToProps)(Login)