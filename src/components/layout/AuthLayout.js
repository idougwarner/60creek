import React from "react";
import Header from "../Header";
import "./AuthLayout.scss";
const AuthLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="auth-container">{children}</div>
    </div>
  );
};

export default AuthLayout;
