import React from 'react';
import { Route } from "react-router-dom"
import AuthLayout from './components/layout/AuthLayout';
import Layout from './components/layout/Layout';

export const MakeRoutesWithSubRoutes = (route) => {
  return (
    <Route
      exact
      path={route.path}
      render={props => {
        return (
          route.path.indexOf('/admin/') >= 0 ? <Layout><route.component {...props} routes={route.routes} /></Layout> :
            <AuthLayout><route.component {...props} routes={route.routes} /></AuthLayout>
        )
      }}
    />
  )
}