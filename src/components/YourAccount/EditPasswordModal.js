import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Spinner,
} from "react-bootstrap";
import { _PasswordStrengths } from "../../helpers/validations";
import InfoTooltip from "../controls/InfoTooltip";

const EditPasswordModal = ({ show, close }) => {
  const [curPassword, setCurPassword] = useState("");
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let i;
    for (i = _PasswordStrengths.length - 1; i >= 0; i--) {
      if (i === 0) {
        setPasswordStrength(i);
      } else if (i === 1) {
        if (password.length > 0) {
          setPasswordStrength(i);
          break;
        }
      } else if (_PasswordStrengths[i].regEx.test(password)) {
        setPasswordStrength(i);
        break;
      }
    }
  }, [password]);
  useEffect(() => {
    if (password && confirmPassword) {
      setIsValidConfirmPassword(password === confirmPassword);
    } else {
      setIsValidConfirmPassword(false);
    }
  }, [password, confirmPassword]);
  const updatePassword = async () => {
    setLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, curPassword, password);
      close();
    } catch (err) {}
    setLoading(false);
  };
  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header className="justify-content-start" closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="curPassword">
            <FormLabel className="required">Current Password</FormLabel>
            <FormControl
              type={!displayPassword ? "password" : "text"}
              placeholder="Enter Current Password"
              className={curPassword ? "completed" : ""}
              value={curPassword}
              onChange={(e) => setCurPassword(e.target.value)}
            />

            <div
              className={
                "password-eye-icon" +
                (displayPassword ? " showing-password" : "")
              }
              onClick={() => setDisplayPassword(!displayPassword)}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel className="required">New Password</FormLabel>
            <FormControl
              type={!displayPassword ? "password" : "text"}
              placeholder="Enter New Password"
              className={password && passwordStrength > 1 ? "completed" : ""}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={password && password.length < 6}
            />
            <FormControl.Feedback type="invalid">
              Password must contain at least 6 characters
            </FormControl.Feedback>
            <div
              className={
                "password-eye-icon" +
                (displayPassword ? " showing-password" : "")
              }
              onClick={() => setDisplayPassword(!displayPassword)}
            />
            <div className="password-strength">
              <div
                className={
                  "strength-bar " + _PasswordStrengths[passwordStrength].legend
                }
              >
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="strength-label">
                {_PasswordStrengths[passwordStrength].legend}
                <InfoTooltip description="Combining uppercase and lowercase letters, numbers, and special characters can create a stronger password" />
              </div>
            </div>
          </FormGroup>
          <FormGroup controlId="confirmPassword">
            <FormLabel className="required">Confirm New Password</FormLabel>
            <FormControl
              type={!displayPassword ? "password" : "text"}
              placeholder="Confirm Password"
              className={
                confirmPassword && isValidConfirmPassword ? "completed" : ""
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!isValidConfirmPassword && confirmPassword}
            />
            <div
              className={
                "password-eye-icon" +
                (displayPassword ? " showing-password" : "")
              }
              onClick={() => setDisplayPassword(!displayPassword)}
            />
            <FormControl.Feedback type="invalid">
              Password doesn't match
            </FormControl.Feedback>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={
              !(
                passwordStrength > 1 &&
                isValidConfirmPassword &&
                curPassword
              ) || loading
            }
            onClick={() => updatePassword()}
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

export default EditPasswordModal;
