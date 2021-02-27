import React from "react";
import { Link } from "react-router-dom";
import { APP_URLS } from "../../../helpers/routers";

const CompletedResetPassword = () => {
  return (
    <>
      <h4 className="auth-title">Password Reset!</h4>
      <div className="card auth-form">
        <div className="text-center text-lg mb-3">
          Click the button below to return to login page.
        </div>
        <div className="text-center text-sm mb-5 text-muted font-italic">
          You will receive an email shortly confirming your password change.
        </div>
        <Link className="btn btn-outline-primary w-100" to={APP_URLS.LOGIN}>
          BACK TO LOG IN
        </Link>
      </div>
    </>
  );
};

export default CompletedResetPassword;
