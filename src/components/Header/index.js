import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { APP_URLS } from "../../helpers/routers";
import "./Header.scss";

const Header = (props) => {
  const { pathname } = useLocation();
  const signupStep = useSelector((state) => state.signupStore.step);
  return (
    <div className="sixty-creek-login-header">
      <img src="/logo.png" className="sixty-creek-icon" alt="logo" />
      <div className="not-a-member-box">
        {pathname === APP_URLS.LOGIN || pathname === APP_URLS.HOME ? (
          <>
            <Link className="g-link-item" to={APP_URLS.SIGNUP}>
              Sign Up
            </Link>
            <div className="header-label g-basic-label">Not a Member?</div>
          </>
        ) : signupStep === "completed" ? (
          <>
            <Link className="g-link-item" to={APP_URLS.DASHBOARD}>
              Visit Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link className="g-link-item" to={APP_URLS.LOGIN}>
              Log In
            </Link>
            <div className="header-label g-basic-label">Already a member</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
