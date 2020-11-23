import './App.css';
import React from 'react'
import { BrowserRouter, Switch } from "react-router-dom"
import { MakeRoutesWithSubRoutes } from './MakeRoutesWithSubRoutes';
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import ResetLinkSent from './pages/ResetLinkSent'
import Prospects from './pages/Prospects'
import Marketing from './pages/Marketing'
import YourAccount from './pages/YourAccount'
import Dashboard from './pages/Dashboard'
import About from './pages/About'

const appRoutes = [
  /** WEB ROUTES */
  // { path: "/", component: ProjectsContainer },
  { path: '/login', component:Login},
  { path: '/password-reset', component:PasswordReset},
  { path: '/link-sent', component:ResetLinkSent},
  { path: '/prospects', component:Prospects},
  { path: '/marketing', component:Marketing},
  { path: '/dashboard', component:Dashboard},
  { path: '/youraccount', component:YourAccount},
  { path: '/about', component:About},
  { path: "/", component: Login },
]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Switch>
            {appRoutes.map((route, i) => (
              <MakeRoutesWithSubRoutes key={route.component.displayName ? route.component.displayName : route.component.name} {...route} />
            )
            )}
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
