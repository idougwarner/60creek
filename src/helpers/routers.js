import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import { Login } from "../pages/Login";
import Marketing from "../pages/Marketing";
import CreateCampaign from "../pages/Marketing/CreateCampaign";
import PasswordReset from "../pages/PasswordReset";
import ProspectsPage from "../pages/Prospects";
import ProspectPage from "../pages/Prospects/ProspectPage";
import ResetLinkSent from "../pages/ResetLinkSent";
import { Signup } from "../pages/Signup";
import YourAccount from "../pages/YourAccount";

export const APP_URLS = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  PASSWORD_RESET: "/password-reset",
  LINK_RESET: "/link-sent",
  INDIVIDUAL_PROSPECT: "/admin/prospects/:id",
  PROSPECTS: "/admin/prospects",
  MARKETING: "/admin/marketing",
  CREATE_CAMPAIGN: "/admin/marketing/create-campaign",
  DASHBOARD: "/admin/dashboard",
  YOUR_ACCOINT: "/admin/youraccount",
  ABOUT: "/admin/about",
  HOME: "/",
};

export const appRoutes = [
  /** WEB ROUTES */
  // { path: "/", component: ProjectsContainer },
  { path: APP_URLS.LOGIN, component: Login, name: "", exact: true },
  { path: APP_URLS.SIGNUP, component: Signup, name: "", exact: true },
  {
    path: APP_URLS.PASSWORD_RESET,
    component: PasswordReset,
    name: "",
    exact: true,
  },
  {
    path: APP_URLS.LINK_RESET,
    component: ResetLinkSent,
    name: "",
    exact: true,
  },
  { path: APP_URLS.PROSPECTS, component: ProspectsPage, name: "", exact: true },
  {
    path: APP_URLS.INDIVIDUAL_PROSPECT,
    component: ProspectPage,
    name: "",
    exact: true,
  },
  { path: APP_URLS.MARKETING, component: Marketing, name: "", exact: true },
  {
    path: APP_URLS.CREATE_CAMPAIGN,
    component: CreateCampaign,
    name: "Create Campaign",
    exact: true,
  },
  { path: APP_URLS.DASHBOARD, component: Dashboard, name: "", exact: true },
  {
    path: APP_URLS.YOUR_ACCOINT,
    component: YourAccount,
    name: "",
    exact: true,
  },
  { path: APP_URLS.ABOUT, component: About, name: "", exact: true },
  { path: APP_URLS.HOME, component: Login, name: "", exact: true },
];
