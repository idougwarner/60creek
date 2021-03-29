import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./ForgotPassword.scss";
import { validateEmail } from "../../../helpers/validations";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { APP_URLS } from "../../../helpers/routers";
import { API, graphqlOperation } from "aws-amplify";
import { requestPasswordReset } from "../../../graphql/mutations";

//******************************************************************
//*
//* Password reset: function component
//*
//******************************************************************

const ForgotPassword = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const resetPassword = async () => {
    setSubmitting(true);
    setResetError("");
    try {
      const rt = await API.graphql(
        graphqlOperation(requestPasswordReset, {
          input: {
            email: email,
            link: `${window.location.protocol}//${window.location.host}/reset-password`,
          },
        })
      );
      if (rt.data.requestPasswordReset.error) {
        setResetError(rt.data.requestPasswordReset.error.message);
      } else {
        history.push(APP_URLS.RESET_LINK_SENT);
      }
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

export default ForgotPassword;
