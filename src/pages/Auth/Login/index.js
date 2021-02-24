import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { API, Auth, graphqlOperation } from "aws-amplify";
import "./Login.scss";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { listUsers } from "../../../graphql/queries";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../redux/actionTypes";
import { APP_URLS } from "../../../helpers/routers";
import { validateEmail } from "../../../helpers/validations";

//******************************************************************
//*
//* Login: class component
//*
//******************************************************************

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "login" });
    // eslint-disable-next-line
  }, []);
  const patchUserInfo = async (username) => {
    try {
      setLoading(true);
      const user = await API.graphql(
        graphqlOperation(listUsers, {
          filter: { cognitoUserName: { eq: username } },
        })
      );
      if (user?.data?.listUsers?.items[0]) {
        dispatch({
          type: ACTIONS.SET_USER,
          user: user?.data?.listUsers?.items[0],
        });
        history.replace(APP_URLS.DASHBOARD);
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
      console.log(err);
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
  return (
    <>
      <h4 className="auth-title">Log In</h4>

      <div className="card auth-form">
        <FormGroup controlId="emailAddress">
          <FormLabel className="required">Email Address</FormLabel>
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
          />
          <FormControl.Feedback type="invalid">
            {loginError ? "" : "Invalid Email Address"}
          </FormControl.Feedback>
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel className="required">Password</FormLabel>
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
            isInvalid={!password || loginError}
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

        <Link className=" mb-4" to={APP_URLS.PASSWORD_RESET}>
          Forgot your Password?
        </Link>
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
