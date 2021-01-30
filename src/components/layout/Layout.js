import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.scss'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { APP_URLS } from '../../helpers/routers';
import { ACTIONS } from '../../redux/actionTypes';
import { listUsers } from '../../graphql/queries';
import { API, Auth, graphqlOperation } from 'aws-amplify';

const Layout = ({ children }) => {
  const history = useHistory();
  const user = useSelector(state => state.userStore);
  const dispatch = useDispatch();
  useEffect(async () => {
    console.log(user);
    if (!user) {
      let rt = await Auth.currentUserInfo();
      if (rt) {
        const rtUser = await API.graphql(graphqlOperation(listUsers, { filter: { cognitoUserName: { eq: rt.username } } }));
        if (rtUser?.data?.listUsers?.items[0]) {
          dispatch({ type: ACTIONS.SET_USER, user: rtUser?.data?.listUsers?.items[0] });
        }
      } else {
        history.replace(APP_URLS.LOGIN);
      }
    }
  }, [user])
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-body">
        {children}
      </main>
    </div>
  )
}

export default Layout