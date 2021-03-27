import "./App.scss";
import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { MakeRoutesWithSubRoutes } from "./MakeRoutesWithSubRoutes";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import { appRoutes } from "./helpers/routers";
import { initDB } from "react-indexed-db";
import { DBConfig } from "./helpers/DBConfig";

Amplify.configure(awsconfig);
initDB(DBConfig);

function App() {
  return (
    <div className="app-body">
      <BrowserRouter>
        <Switch>
          {appRoutes.map((route, i) => (
            <MakeRoutesWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
