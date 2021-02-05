import React, { useState, useEffect } from "react";
import MorePips from "../MorePips";
import "./Signup1.scss";

import BasicButton from "../../../components/controls/BasicButton";
import { FormControl, FormGroup, FormLabel, FormText } from "react-bootstrap";
import { ACTIONS } from "../../../redux/actionTypes";
import { useDispatch } from "react-redux";

//******************************************************************
//*
//* Signup1: function component
//*
//******************************************************************

const STRENGTH_0 = "strength";
const STRENGTH_1 = "week";
const STRENGTH_2 = "good";
const STRENGTH_3 = "strong";
const STRENGTH_4 = "perfect";

const strengths = [
  { legend: STRENGTH_0, regEx: "" },
  { legend: STRENGTH_1, regEx: "" },
  {
    legend: STRENGTH_2,
    regEx: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
  },
  {
    legend: STRENGTH_3,
    regEx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
  },
  {
    legend: STRENGTH_4,
    regEx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[+-_()])(?=.{8,})/,
  },
];

const validateEmail = (email) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return true;
  }
  return false;
};
const Signup1 = (props) => {
  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false);
  const [emailAddress, setEmailAddress] = useState(props.emailAddress || "");
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
  }, []);
  useEffect(() => {
    setIsValidEmail(validateEmail(emailAddress));
  }, [emailAddress]);
  useEffect(() => {
    let i;
    for (i = strengths.length - 1; i >= 0; i--) {
      if (i === 0) {
        setPasswordStrength(i);
      } else if (i === 1) {
        if (password.length > 0) {
          setPasswordStrength(i);
          break;
        }
      } else if (strengths[i].regEx.test(password)) {
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
          onChange={(e) => setEmailAddress(e.target.value)}
          isInvalid={!isValidEmail && emailAddress}
        />
        <FormControl.Feedback type="invalid">
          Invalid Email Address
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
        />
        <div
          className={
            "password-eye-icon" + (displayPassword ? " showing-password" : "")
          }
          onClick={() => setDisplayPassword(!displayPassword)}
        />
        <div className="password-strength">
          <div className={"strength-bar " + strengths[passwordStrength].legend}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="strength-label">
            {strengths[passwordStrength].legend}
            <img src="assets/icons/information-circle.svg" />
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
          Confirm password should be matched with password.
        </FormControl.Feedback>
      </FormGroup>
      <BasicButton
        title="next"
        additionalClass="next-button"
        enabled={nextButtonEnabledValue}
        buttonPushed={(e) => {
          if (!validateEmail(emailAddress)) {
            setIsValidEmail(true);
          } else {
            props.next(
              true,
              firstNameValue,
              lastNameValue,
              emailAddress,
              password
            );
          }
        }}
      />
      <MorePips pipsConfig={props.pipsConfig} />
    </div>
  );
};

export default Signup1;
