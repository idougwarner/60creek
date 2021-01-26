import { API, Auth, graphqlOperation } from 'aws-amplify';
import React from 'react';
import { useDispatch } from 'react-redux';
import BasicButton from '../../../components/controls/BasicButton';
import { AUTH_USER_TOKEN_KEY } from '../../../helpers/constants';
import './AccountCreated.scss';
import { connect } from 'react-redux'
import { createUserInStore } from '../../../redux/actions'
import { listUsers } from '../../../graphql/queries';
import { useHistory } from 'react-router';

const AccountCreated = ({ email, password, onAddUserToStore }) => {
  const history = useHistory();

  const handleGetUser = (cognitoUserName) => {
    API.graphql(graphqlOperation(listUsers, { filter: { cognitoUserName: { eq: cognitoUserName } } })).then(userResults => {
      console.log(userResults);
      if (userResults && userResults.data && userResults.data.listUsers && userResults.data.listUsers.items && userResults.data.listUsers.items.length > 0) {
        onAddUserToStore(userResults.data.listUsers.items[0])
      }
    }).catch(err => {
      alert(err.message ? err.message : 'Could not get user')
    })
  }

  return <div className="account-created">
    <div className="title">
      Account Created
    </div>
    <div className="description">
      Your account has been created, a confirmation email has been sent to your linked address.
    </div>

    <BasicButton title='Go To Dashboard' additionalClass='goto-button' enabled={true}
      buttonPushed={(e) => {
        console.log(email, password)
        Auth.signIn(email, password).then(user => {
          console.log(user)
          handleGetUser(user.username)
          localStorage.setItem(AUTH_USER_TOKEN_KEY, user.signInUserSession.accessToken.jwtToken);
          history.replace('/dashboard')
        }).catch(err => {
          console.log(err.message)
        })
      }}
    />
  </div>
}


const mapDispatchToProps = dispatch => ({
  onAddUserToStore: user => dispatch(createUserInStore(user))
})

export default connect(null, mapDispatchToProps)(AccountCreated)