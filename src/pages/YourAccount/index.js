import React from "react";
import Profile from "../../components/YourAccount/Profile";
import Transactions from "../../components/YourAccount/Transactions";
import "./YourAccount.scss";

const YourAccount = (props) => {
  return (
    <div className="your-account-container">
      <Profile />
      <Transactions />
    </div>
  );
};

export default YourAccount;
