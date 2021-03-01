import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { API, Auth, graphqlOperation } from "aws-amplify";
import "./Login.scss";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { usersByUserId } from "../../../graphql/queries";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../redux/actionTypes";
import { APP_URLS } from "../../../helpers/routers";
import { validateEmail } from "../../../helpers/validations";
import queryString from "query-string";
//******************************************************************
//*
//* Login: class component
//*
//******************************************************************

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "login" });
    // eslint-disable-next-line
  }, []);
  const patchUserInfo = async (username) => {
    try {
      setLoading(true);
      const user = await API.graphql(
        graphqlOperation(usersByUserId, {
          cognitoUserName: username,
        })
      );
      if (user?.data?.usersByUserId?.items[0]) {
        dispatch({
          type: ACTIONS.SET_USER,
          user: user?.data?.usersByUserId?.items[0],
        });
        const params = queryString.parse(location.search);
        if (params.returnUrl) {
          history.replace(params.returnUrl);
        } else {
          history.replace(APP_URLS.DASHBOARD);
        }
      }
    } catch (err) {}
    setLoading(false);
  };
  const login = async () => {
    setLoading(true);
    setLoginError("");
    try {
      const user = await Auth.signIn(email, password);
      patchUserInfo(user.username);
    } catch (err) {
      if (err.code === "UserNotFoundException") {
        setLoginError(
          "Please verify your username and password and then retry"
        );
      } else {
        setLoginError("User login error");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    const f = async () => {
      try {
        let rt = await Auth.currentUserInfo();
        if (rt) {
          patchUserInfo(rt.username);
        }
      } catch (err) {}
    };
    f();
    // eslint-disable-next-line
  }, []);
  const keyEvent = (e) => {
    if (e.key === "Enter") {
      if (!password || !email || !validateEmail(email) || loading) {
        return;
      } else {
        login();
      }
    }
  };
  return (
    <>
      <h4 className="auth-title">Log In</h4>

      <div className="card auth-form">
        <FormGroup controlId="emailAddress">
          <FormLabel>Username</FormLabel>
          <FormControl
            size="lg"
            type="email"
            placeholder="Enter Email Address"
            className={email && validateEmail(email) ? "completed" : ""}
            value={email}
            onChange={(e) => {
              setLoginError("");
              setEmail(e.target.value);
            }}
            isInvalid={(email && !validateEmail(email)) || loginError}
            onKeyDown={keyEvent}
          />
          <FormControl.Feedback type="invalid">
            {loginError ? "" : "Invalid Email Address"}
          </FormControl.Feedback>
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            size="lg"
            type={!showPassword ? "password" : "text"}
            placeholder="Enter Password"
            className={password ? "completed" : ""}
            value={password}
            onChange={(e) => {
              setLoginError("");
              setPassword(e.target.value);
            }}
            isInvalid={loginError}
            onKeyDown={keyEvent}
          />
          <FormControl.Feedback type="invalid">
            {loginError}
          </FormControl.Feedback>
          <div
            className={
              "password-eye-icon lg" + (showPassword ? " showing-password" : "")
            }
            onClick={() => setShowPassword(!showPassword)}
          />
        </FormGroup>
        <div className="mb-4">
          <Link to={APP_URLS.FORGOT_PASSWORD}>Forgot your Password?</Link>
        </div>
        <Button
          disabled={!password || !email || !validateEmail(email) || loading}
          className="w-100"
          onClick={(e) => {
            login();
          }}
        >
          {loading ? "LOG IN ..." : "LOG IN"}
        </Button>
      </div>
    </>
  );
};

export default Login;
