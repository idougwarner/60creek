import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import "./PasswordReset.scss";
import { validateEmail } from "../../../helpers/validations";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { APP_URLS } from "../../../helpers/routers";

//******************************************************************
//*
//* Password reset: function component
//*
//******************************************************************

const PasswordReset = (props) => {
  const { history } = props;

  const [email, setEmail] = useState(null);
  const [resetError, setResetError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const resetPassword = async () => {
    setSubmitting(true);
    setResetError("");
    try {
      let rt = await Auth.forgotPassword(email);
      console.log(rt);
      history.push(APP_URLS.LINK_RESET);
    } catch (err) {
      setResetError("Please verify your email and try again");
    }
    setSubmitting(false);
  };
  return (
    <>
      <h4 className="auth-title">Password Reset</h4>
      <div className="card auth-form">
        <div className="text-center mb-3">
          Enter your email address to receive a link to reset your password.
        </div>

        <FormGroup controlId="emailAddress">
          <FormLabel className="required">Email Address</FormLabel>
          <FormControl
            size="lg"
            type="email"
            placeholder="Enter Email Address"
            className={email && validateEmail(email) ? "completed" : ""}
            value={email}
            onChange={(e) => {
              setResetError("");
              setEmail(e.target.value);
            }}
            isInvalid={(email && !validateEmail(email)) || resetError}
          />
          <FormControl.Feedback type="invalid">
            {resetError ? resetError : "Please enter a valid email address"}
          </FormControl.Feedback>
        </FormGroup>
        <Button
          disabled={!email || !validateEmail(email) || submitting}
          className="mb-4"
          onClick={() => resetPassword()}
        >
          {submitting ? "SUBMITTING ..." : "RESET PASSWORD"}
        </Button>
        <Link className="text-center" to="/login">
          Remember your Password?
        </Link>
      </div>
    </>
  );
};

export default withRouter(PasswordReset);
