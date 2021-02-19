import React from "react";
import { withRouter, Link } from "react-router-dom";
import "./ResetLinkSent.scss";

import Header from "../../components/Header";

const ResetLinkSent = () => {
  return (
    <div className="sixty-creek-password-reset g-page-background">
      <Header />
      <div className="sixty-creek-password-reset-sent">
        <div className="g-centered-form-with-header">
          <div className="g-form-container">
            <div className="g-caption">Reset Link Sent</div>
            <div className="g-instruction-block">
              Thank you, an email has been sent to the entered address with a
              link to reset your password.
            </div>
            <div className="g-basic-label italics smallest">
              It may sometimes take 5- 10 minutes for the email to arrive.
            </div>
            <Link className="g-link-button" to="/login">
              Back to Logon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ResetLinkSent);
