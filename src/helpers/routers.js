import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import Marketing from "../pages/Marketing";
import CreateCampaign from "../pages/Marketing/CreateCampaign";
import ProspectsPage from "../pages/Prospects";
import ProspectPage from "../pages/Prospects/ProspectPage";
import YourAccount from "../pages/YourAccount";

import { Login } from "../pages/Auth/Login";
import ResetLinkSent from "../pages/Auth/ResetLinkSent";
import { Signup } from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import CompletedResetPassword from "../pages/Auth/CompletedResetPassword";

export const APP_URLS = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_LINK_SENT: "/reset-link-sent",
  RESET_PASSWORD: "/reset-password/:resetToken",
  COMPLETED_RESET_PASSWORD: "/completed-reset-password",

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
    path: APP_URLS.FORGOT_PASSWORD,
    component: ForgotPassword,
    name: "",
    exact: true,
  },
  {
    path: APP_URLS.RESET_LINK_SENT,
    component: ResetLinkSent,
    name: "",
    exact: true,
  },
  {
    path: APP_URLS.COMPLETED_RESET_PASSWORD,
    component: CompletedResetPassword,
    name: "",
    exact: true,
  },
  {
    path: APP_URLS.RESET_PASSWORD,
    component: ResetPassword,
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
