import React from "react";
import "./AccountCreated.scss";
import { useHistory } from "react-router";
import { Button } from "react-bootstrap";
import { APP_URLS } from "../../../../helpers/routers";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../../redux/actionTypes";

const AccountCreated = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const gotoDashboard = async () => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "" });
    history.replace(APP_URLS.DASHBOARD);
  };

  return (
    <div className="account-created">
      <div className="title">Account Created</div>
      <div className="description">
        Your account has been created, a confirmation email has been sent to
        your linked address.
      </div>
      <Button
        variant="primary"
        className="w-100"
        onClick={(e) => gotoDashboard()}
      >
        Go To Dashboard
      </Button>
    </div>
  );
};

export default AccountCreated;
