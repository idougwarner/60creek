import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { API, Auth, graphqlOperation } from 'aws-amplify'
import './Login.scss'

import Header from '../../components/Header'
import { Button } from 'react-bootstrap'
import { listUsers } from '../../graphql/queries'
import { useDispatch } from 'react-redux'
import { ACTIONS } from '../../redux/actionTypes'
import { APP_URLS } from '../../helpers/routers'

//******************************************************************
//*
//* Login: class component
//*
//******************************************************************

const validateEmail = (email) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return (true)
  }
  return (false)
}

export const Login = () => {

  const [enbled, setEnabled] = useState(false);
  const [email, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [userNameError, setUserNameError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (email) {
      setUserNameError(!validateEmail(email));
    } else {
      setUserNameError(false);
    }
    if (email && password) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [email, password]);
  const patchUserInfo = async (username) => {
    try {
      const user = await API.graphql(graphqlOperation(listUsers, { filter: { cognitoUserName: { eq: username } } }));
      if (user?.data?.listUsers?.items[0]) {
        dispatch({ type: ACTIONS.SET_USER, user: user?.data?.listUsers?.items[0] });
        history.replace(APP_URLS.PROSPECTS);
      }
    } catch (err) {

    }
    setLoading(false);
  }
  const login = async () => {
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password)
      patchUserInfo(user.username);
    } catch (err) {
      setLoading(false);
    }
  }
  useEffect(() => {
    const f = async () => {
      try {
        let rt = await Auth.currentUserInfo();
        if (rt) {
          patchUserInfo(rt.username)
        }
      } catch (err) {
      }
    }
    f();
  }, [])
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
              value={email}
              onChange={(e) => {
                setUserName(e.target.value);
              }} />
            {userNameError ? <div className='g-error-label smallest'>Invalid Email Address</div> : null}
          </div>
          <div className={'g-input-box' + (userNameError || loginError ? ' error' : '')}>
            <div className='g-input-label'>Password</div>
            <div className={'eye-icon' + (showPassword ? ' showing-password' : '')}
              onClick={(e) => setShowPassword(!showPassword)} />
            <input className='g-input-container'
              type={!showPassword ? 'password' : 'text'}
              placeholder='Enter yout password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            {loginError ? <div className='g-error-label smallest'>{loginError}</div> : null}
          </div>
          <Link className='g-link-item small' to="/password-reset">Forgot your Password?</Link>
          <Button disabled={!enbled || loading} className="w-100"
            onClick={(e) => { login() }}
          >LOG IN</Button>
        </div>
      </div>
    </div>
  </div>

}

export default Login