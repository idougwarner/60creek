import React from 'react';
import { Route } from "react-router-dom"

export const MakeRoutesWithSubRoutes = (route) => {
  return (
    <Route 
      exact
      path={route.path}
      render={props => {
        return (
          <route.component {...props} routes={route.routes} />
        )
      }
      }
    />
  )
}