import { API, Auth, graphqlOperation } from 'aws-amplify';
import React, { useState } from 'react';
import { AUTH_USER_TOKEN_KEY } from '../../../helpers/constants';
import './AccountCreated.scss';
import { connect, useDispatch } from 'react-redux'
import { listUsers } from '../../../graphql/queries';
import { useHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import { ACTIONS } from '../../../redux/actionTypes';
import { APP_URLS } from '../../../helpers/routers';

const AccountCreated = ({ email, password }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const login = async () => {
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      const userInfo = await API.graphql(graphqlOperation(listUsers, { filter: { cognitoUserName: { eq: user.username } } }));
      if (userInfo?.data?.listUsers?.items[0]) {
        dispatch({ type: ACTIONS.SET_USER, user: userInfo?.data?.listUsers?.items[0] });
        history.replace(APP_URLS.PROSPECTS);
      }
    } catch (err) {
      setLoading(false);
    }

  }

  return <div className="account-created">
    <div className="title">
      Account Created
    </div>
    <div className="description">
      Your account has been created, a confirmation email has been sent to your linked address.
    </div>
    <Button variant="primary" disabled={loading} className="w-100"
      onClick={(e) => login()}
    >Go To Dashboard</Button>
  </div>
}

export default AccountCreated