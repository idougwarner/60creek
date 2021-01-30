import About from "../pages/About";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Marketing } from "../pages/Marketing";
import PasswordReset from "../pages/PasswordReset";
import ProspectsPage from "../pages/Prospects";
import ResetLinkSent from "../pages/ResetLinkSent";
import { Signup } from "../pages/Signup";
import YourAccount from "../pages/YourAccount";

export const APP_URLS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  PASSWORD_RESET: '/password-reset',
  LINK_RESET: '/link-sent',
  PROSPECTS: '/admin/prospects',
  MARKETING: '/admin/marketing',
  DASHBOARD: '/admin/dashboard',
  YOUR_ACCOINT: '/admin/youraccount',
  ABOUT: '/admin/about',
  HOME: '/'
};

export const appRoutes = [
  /** WEB ROUTES */
  // { path: "/", component: ProjectsContainer },
  { path: APP_URLS.LOGIN, component: Login, },
  { path: APP_URLS.SIGNUP, component: Signup, },
  { path: APP_URLS.PASSWORD_RESET, component: PasswordReset, },
  { path: APP_URLS.LINK_RESET, component: ResetLinkSent, },
  { path: APP_URLS.PROSPECTS, component: ProspectsPage, },
  { path: APP_URLS.MARKETING, component: Marketing, },
  { path: APP_URLS.DASHBOARD, component: Dashboard, },
  { path: APP_URLS.YOUR_ACCOINT, component: YourAccount, },
  { path: APP_URLS.ABOUT, component: About, },
  { path: APP_URLS.HOME, component: Login, },
]
