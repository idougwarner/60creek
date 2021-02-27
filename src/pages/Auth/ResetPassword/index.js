import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Spinner,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import InfoTooltip from "../../../components/controls/InfoTooltip";
import { _PasswordStrengths } from "../../../helpers/validations";
import { resetPassword } from "../../../graphql/mutations";
import { APP_URLS } from "../../../helpers/routers";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { resetToken } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const history = useHistory();
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
    setResetting(true);
    setErrMsg("");
    try {
      const rt = await API.graphql(
        graphqlOperation(resetPassword, {
          input: {
            token: resetToken,
            password: password,
          },
        })
      );
      console.log(rt);
      if (rt.data.resetPassword.error) {
        setErrMsg(rt.data.resetPassword.error.message);
      } else {
        history.replace(APP_URLS.COMPLETED_RESET_PASSWORD);
      }
    } catch (err) {
      console.log(err);
    }
    setResetting(false);
  };

  return (
    <>
      <h4 className="auth-title">Reset Your Password</h4>
      <div className="card auth-form">
        <FormGroup controlId="password">
          <FormLabel className="required">New Password</FormLabel>
          <FormControl
            type={!displayPassword ? "password" : "text"}
            placeholder="Enter Password"
            className={password && passwordStrength > 1 ? "completed" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={(password && password.length < 6) || errMsg}
          />
          <FormControl.Feedback type="invalid">
            {errMsg ? errMsg : "Password must contain at least 6 characters"}
          </FormControl.Feedback>
          <div
            className={
              "password-eye-icon" + (displayPassword ? " showing-password" : "")
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
              "password-eye-icon" + (displayPassword ? " showing-password" : "")
            }
            onClick={() => setDisplayPassword(!displayPassword)}
          />
          <FormControl.Feedback type="invalid">
            Password doesn't match
          </FormControl.Feedback>
        </FormGroup>
        <Button
          size="lg"
          variant="primary"
          disabled={
            !(passwordStrength > 1 && isValidConfirmPassword) || resetting
          }
          onClick={() => updatePassword()}
        >
          {resetting && (
            <Spinner
              size="sm"
              style={{ marginRight: 10 }}
              animation="border"
              role="status"
            />
          )}
          RESET PASSWORD
        </Button>
      </div>
    </>
  );
};

export default ResetPassword;
