import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../graphql/mutations";
import { ACTIONS } from "../../redux/actionTypes";

const EditNameModal = ({ show, close }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userStore);
  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
    }
  }, [userInfo]);
  const updateName = async () => {
    setLoading(true);
    try {
      let user = {
        ...userInfo,
        firstName: firstName,
        lastName: lastName,
      };
      delete user.createdAt;
      delete user.updatedAt;
      const rt = await API.graphql(
        graphqlOperation(updateUser, {
          input: user,
        })
      );
      dispatch({
        type: ACTIONS.SET_USER,
        user: rt.data.updateUser,
      });
      close();
    } catch (err) {}
    setLoading(false);
  };
  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header className="justify-content-start" closeButton>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="firstName">
            <FormLabel className="required">First Name</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter Frist Name"
              className={firstName ? "completed" : ""}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="lastName">
            <FormLabel className="required">Last Name</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter Last Name"
              className={lastName ? "completed" : ""}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!firstName || !lastName || loading}
            onClick={() => updateName()}
          >
            {loading && (
              <Spinner
                size="sm"
                style={{ marginRight: 10 }}
                animation="border"
                role="status"
              />
            )}
            UPDATE
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditNameModal;
