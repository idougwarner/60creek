import './App.scss';
import React from 'react'
import { BrowserRouter, Switch } from "react-router-dom"
import { MakeRoutesWithSubRoutes } from './MakeRoutesWithSubRoutes';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { appRoutes } from './helpers/routers';
Amplify.configure(awsconfig);

function App() {

  return (
    <div className="app-body">
      <BrowserRouter>
        <Switch>
          {appRoutes.map((route, i) => (
            <MakeRoutesWithSubRoutes key={route.component.displayName ? route.component.displayName : route.component.name} {...route} />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
