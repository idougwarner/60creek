import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createHashHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";
import userStore from "./userReducers";
import prospectStore from "./prospectReducers";
import signupStore from "./signupReducer";
import uploadWorkerStore from "./uploadWorkerReducer";
export const history = createHashHistory();

const rootReducer = combineReducers({
  userStore,
  prospectStore,
  signupStore,
  uploadWorkerStore,
});

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: "info",
    collapsed: true,
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== "test") {
    // middleware.push(logger);  // uncomment/comment to show/hide redux logger
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {};
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators,
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, {}, enhancer);

  return store;
};
