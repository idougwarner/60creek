import './App.css';
import { BrowserRouter, Switch } from "react-router-dom"
import { MakeRoutesWithSubRoutes } from './MakeRoutesWithSubRoutes';
import Home from './pages/Home'
import Prospects from './pages/Prospects'
import Marketing from './pages/Marketing'
import YourAccount from './pages/YourAccount'
import Dashboard from './pages/Dashboard'
import Menu from './components/Menu'
import About from './pages/About'

const appRoutes = [
  /** WEB ROUTES */
  // { path: "/", component: ProjectsContainer },
  { path: '/prospects', component:Prospects},
  { path: '/marketing', component:Marketing},
  { path: '/dashboard', component:Dashboard},
  { path: '/youraccount', component:YourAccount},
  { path: '/about', component:About},
  { path: "/", component: Home },
]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Menu />
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
