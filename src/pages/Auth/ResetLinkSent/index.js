import React from "react";
import { Link } from "react-router-dom";
import { APP_URLS } from "../../../helpers/routers";
import "./ResetLinkSent.scss";

const ResetLinkSent = () => {
  return (
    <>
      <h4 className="auth-title">Reset Link Sent</h4>
      <div className="card auth-form">
        <div className="text-center text-lg mb-3">
          Thank you, an email has been sent to the entered address with a link
          to reset your password.
        </div>
        <div className="text-center text-sm mb-5 text-muted font-italic">
          It may sometimes take 5- 10 minutes for the email to arrive.
        </div>
        <Link className="btn btn-outline-primary w-100" to={APP_URLS.LOGIN}>
          BACK TO LOG IN
        </Link>
      </div>
    </>
  );
};

export default ResetLinkSent;
