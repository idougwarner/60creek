import React from "react";
import { Route } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Layout from "./components/layout/Layout";

export const MakeRoutesWithSubRoutes = (route) => {
  return (
    <Route
      exact={route.exact}
      name={route.name}
      path={route.path}
      render={(props) => {
        return route.path.indexOf("/admin/") >= 0 ? (
          <Layout>
            <route.component {...props} />
          </Layout>
        ) : (
          <AuthLayout>
            <route.component {...props} />
          </AuthLayout>
        );
      }}
    />
  );
};
