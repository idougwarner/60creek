import React, { useState, useEffect } from "react";
import MorePips from "../MorePips";
import "./Signup1.scss";

import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
} from "react-bootstrap";
import { ACTIONS } from "../../../../redux/actionTypes";
import { useDispatch } from "react-redux";
import {
  _PasswordStrengths,
  validateEmail,
} from "../../../../helpers/validations";
import { Auth } from "aws-amplify";
import InfoTooltip from "../../../../components/controls/InfoTooltip";

//******************************************************************
//*
//* Signup1: function component
//*
//******************************************************************

const Signup1 = (props) => {
  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false);
  const [emailAddress, setEmailAddress] = useState(props.emailAddress || "");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [password, setPassword] = useState(props.password || "");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(
    props.defaultPasswordConfirm || ""
  );
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState(props.firstName);
  const [lastNameValue, setLastNameValue] = useState(props.lastName);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "step-1" });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setIsValidEmail(validateEmail(emailAddress));
  }, [emailAddress]);
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
  useEffect(() => {
    if (
      firstNameValue &&
      lastNameValue &&
      isValidEmail &&
      passwordStrength > 1 &&
      isValidConfirmPassword
    ) {
      setNextButtonEnabledValue(true);
    } else {
      setNextButtonEnabledValue(false);
    }
  }, [
    firstNameValue,
    lastNameValue,
    isValidEmail,
    passwordStrength,
    isValidConfirmPassword,
  ]);
  const gotoNext = async () => {
    setEmailErrMsg("");
    setCheckingEmail(true);
    const msg = "This email address is already in use.";
    try {
      await Auth.signIn(
        emailAddress,
        "sldfow3902938dfsoiow349r-234289349S@#WEwewer@#@r"
      );
      Auth.signOut();
      setEmailErrMsg(msg);
    } catch (err) {
      switch (err.code) {
        case "UserNotFoundException":
          // Only here, in .catch error block we actually send a user to sign up
          props.next(
            true,
            firstNameValue,
            lastNameValue,
            emailAddress,
            password
          );
          break;
        case "NotAuthorizedException":
          setEmailErrMsg(msg);
          break;
        case "PasswordResetRequiredException":
          setEmailErrMsg(msg);
          break;
        case "UserNotConfirmedException":
          setEmailErrMsg(msg);
          break;
        default:
          break;
      }
    }
    setCheckingEmail(false);
  };
  return (
    <div>
      <FormGroup controlId="firstName">
        <FormLabel className="required">First Name</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter First Name"
          value={firstNameValue}
          className={firstNameValue ? "completed" : ""}
          onChange={(e) => setFirstNameValue(e.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="lastName">
        <FormLabel className="required">Last Name</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter Last Name"
          className={lastNameValue ? "completed" : ""}
          value={lastNameValue}
          onChange={(e) => setLastNameValue(e.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="emailAddress">
        <FormLabel className="required">Email Address</FormLabel>
        <FormControl
          type="email"
          placeholder="Enter Email Address"
          className={emailAddress && isValidEmail ? "completed" : ""}
          value={emailAddress}
          onChange={(e) => {
            setEmailErrMsg("");
            setEmailAddress(e.target.value);
          }}
          isInvalid={(!isValidEmail || emailErrMsg) && emailAddress}
        />
        <FormControl.Feedback type="invalid">
          {emailErrMsg ? emailErrMsg : "Invalid Email Address"}
        </FormControl.Feedback>
        <FormText className="font-italic pl-3">
          This will also be your username
        </FormText>
      </FormGroup>

      <FormGroup controlId="password">
        <FormLabel className="required">Password</FormLabel>
        <FormControl
          type={!displayPassword ? "password" : "text"}
          placeholder="Enter Password"
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
        <FormLabel className="required">Confirm Password</FormLabel>
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
        variant="primary"
        className="w-100"
        disabled={!nextButtonEnabledValue || checkingEmail}
        onClick={() => gotoNext()}
      >
        {checkingEmail ? "CHECKING ..." : "NEXT"}
      </Button>
      <MorePips pipsConfig={props.pipsConfig} />
    </div>
  );
};

export default Signup1;
