import React from "react";
import "./Sidebar.scss";
import { NavLink, useHistory } from "react-router-dom";
import { APP_URLS } from "../../helpers/routers";
import { Auth } from "aws-amplify";
import { ACTIONS } from "../../redux/actionTypes";
import { useDispatch } from "react-redux";

// Left sideboard menu

const Sidebar = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const logout = async (e) => {
    e.preventDefault();

    await Auth.signOut();
    history.replace(APP_URLS.LOGIN);
    dispatch({
      type: ACTIONS.SET_USER,
      user: null,
    });
  };
  return (
    <div className="menu">
      <NavLink className="logo" to={APP_URLS.ABOUT}>
        <img src="/assets/images/logo.png" alt="logo" />
      </NavLink>
      <div className="menu-wrapper">
        <NavLink
          className={"link-item"}
          activeClassName="active-link"
          to={APP_URLS.DASHBOARD}
        >
          Dashboard
        </NavLink>
        <NavLink
          className={"link-item"}
          activeClassName="active-link"
          to={APP_URLS.MARKETING}
        >
          Marketing
        </NavLink>
        <NavLink
          className={"link-item"}
          activeClassName="active-link"
          to={APP_URLS.PROSPECTS}
        >
          Prospects
        </NavLink>
        <NavLink
          className={"link-item"}
          activeClassName="active-link"
          to={APP_URLS.YOUR_ACCOINT}
        >
          Your Account
        </NavLink>
      </div>

      <NavLink
        className={"link-item logout mb-0"}
        to={"#"}
        onClick={(e) => logout(e)}
      >
        Sign Out
      </NavLink>
    </div>
  );
};

export default Sidebar;
