import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.scss';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { APP_URLS } from '../../helpers/routers';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { usersByUserId } from '../../graphql/queries';
import { ACTIONS } from '../../redux/actionTypes';

import { Spinner } from 'react-bootstrap';
import { onUpdateProspectList } from '../../graphql/subscriptions';

const Layout = ({ children }) => {
  const history = useHistory();
  const user = useSelector((state) => state.userStore);
  const [completedProspectList, setCompletedProspectList] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    if (!user) {
      const f = async () => {
        setLoading(true);
        let rt = await Auth.currentUserInfo();
        if (rt) {
          const rtUser = await API.graphql(
            graphqlOperation(usersByUserId, {
              cognitoUserName: rt.username,
            })
          );
          if (rtUser?.data?.usersByUserId?.items[0]) {
            dispatch({
              type: ACTIONS.SET_USER,
              user: rtUser?.data?.usersByUserId?.items[0],
            });
          }
        } else {
          history.replace(APP_URLS.LOGIN + '?returnUrl=' + location.pathname);
        }
        setLoading(false);
      };
      f();
    }
    // eslint-disable-next-line
  }, [user, history, location]);

  const showUpdatedProspects = () => {
    const id = completedProspectList.id;
    setCompletedProspectList(null);

    dispatch({
      type: ACTIONS.SET_COMPLETED_PROSPECT_LIST_ID,
      data: {
        prospectListId: id,
      },
    });

    history.push({
      pathname: APP_URLS.PROSPECTS,
      search: 'prospectList=' + id,
    });
  };

  const onUpdateProspectListSubscription = (data) => {
    const prospectList = data.value.data.onUpdateProspectList;
    if (prospectList && prospectList.uploadStatus === 'completed') {
      setCompletedProspectList(prospectList);
    }
  };
  useEffect(() => {
    const updateProspectListSubscription = API.graphql(
      graphqlOperation(onUpdateProspectList)
    ).subscribe({
      next: onUpdateProspectListSubscription,
    });
    return () => {
      updateProspectListSubscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='admin-layout'>
      <Sidebar />
      <main className='admin-body'>
        <div
          className={
            'upload-banner ' +
            (!user ||
            !completedProspectList ||
            completedProspectList.userId !== user.id
              ? 'hide'
              : '')
          }
        >
          <div>
            Your prospect list has been successfully uploaded and can be viewed
            <span
              className='clickable'
              onClick={() => {
                showUpdatedProspects();
              }}
            >
              here!
            </span>
          </div>
          <img
            src='/assets/icons/close.svg'
            alt='close-banner'
            className='clickable'
            onClick={() => setCompletedProspectList(null)}
          />
        </div>
        {loading ? (
          <div className='d-flex p-5 justify-content-center'>
            <Spinner animation='border' role='status' />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default Layout;
