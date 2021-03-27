import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../graphql/mutations";
import { ACTIONS } from "../../redux/actionTypes";
import EditEmailModal from "./EditEmailModal";
import EditNameModal from "./EditNameModal";
import EditPasswordModal from "./EditPasswordModal";
import "./Profile.scss";

const Profile = () => {
  const userInfo = useSelector((state) => state.userStore);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showEditPwdModal, setShowEditPwdModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);

  const dispatch = useDispatch();

  const updateProfile = async (checked) => {
    setLoading(true);
    try {
      let user = {
        id: userInfo.id,
        receiveEmail: checked,
      };
      const rt = await API.graphql(
        graphqlOperation(updateUser, {
          input: user,
        })
      );

      dispatch({
        type: ACTIONS.SET_USER,
        user: rt.data.updateUser,
      });
    } catch (err) {}
    setLoading(false);
  };
  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setReceiveEmail(
        userInfo.receiveEmail === null ? true : userInfo.receiveEmail
      );
    }
  }, [userInfo]);
  return (
    <div className="profile-container mb-5">
      <h4>Profile</h4>
      <div className="card p-5">
        <div className="row">
          <div className="col-12 col-md-6">
            <FormGroup controlId="name" className="mb-5">
              <FormLabel className="required">Name</FormLabel>
              <div className="d-flex">
                <FormControl
                  size="lg"
                  type="text"
                  placeholder="Enter Full Name"
                  value={firstName + " " + lastName}
                  readOnly
                />
                <Button
                  variant="outline-primary"
                  className="ml-4"
                  size="lg"
                  onClick={() => setShowEditNameModal(true)}
                >
                  EDIT
                </Button>

                <EditNameModal
                  show={showEditNameModal}
                  close={() => setShowEditNameModal(false)}
                />
              </div>
            </FormGroup>
          </div>
          <div className="col-12 col-md-6">
            <FormGroup controlId="email" className="mb-5">
              <FormLabel className="required">Email Address</FormLabel>
              <div className="d-flex">
                <FormControl
                  size="lg"
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  readOnly
                />
                <Button
                  variant="outline-primary"
                  className="ml-4"
                  size="lg"
                  onClick={() => setShowEditEmailModal(true)}
                >
                  EDIT
                </Button>

                <EditEmailModal
                  show={showEditEmailModal}
                  close={() => setShowEditEmailModal(false)}
                />
              </div>
            </FormGroup>
          </div>
          <div className="col-12 col-md-6">
            <FormGroup controlId="password" className="mb-5">
              <FormLabel className="required">Password</FormLabel>
              <div className="d-flex">
                <FormControl
                  size="lg"
                  type="password"
                  placeholder="Enter Password"
                  value={"******************"}
                  readOnly
                />
                <Button
                  variant="outline-primary"
                  className="ml-4"
                  size="lg"
                  onClick={() => setShowEditPwdModal(true)}
                >
                  EDIT
                </Button>
                <EditPasswordModal
                  show={showEditPwdModal}
                  close={() => setShowEditPwdModal(false)}
                />
              </div>
            </FormGroup>
          </div>
        </div>
        <h5 className="mb-3 d-flex align-items-center">
          Notification Preferences{" "}
          {loading && (
            <Spinner
              size="sm"
              as="span"
              style={{ marginLeft: 10 }}
              animation="border"
              role="status"
            />
          )}
        </h5>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center">
              <div className="receive-an-email">
                Receive an email when spreadsheets are uploaded.
              </div>
              <FormCheck
                custom
                id="receive-an-email"
                type="checkbox"
                className="ml-5"
                checked={receiveEmail}
                onChange={(event) => {
                  setReceiveEmail(event.target.checked);
                  updateProfile(event.target.checked);
                }}
                label=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
