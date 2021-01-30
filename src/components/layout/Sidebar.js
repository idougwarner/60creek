import React from 'react'
import './Sidebar.scss'
import { Link, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { APP_URLS } from '../../helpers/routers'

// Left sideboard menu

const Sidebar = (props) => {
  return <div className="menu">

    <Link className='logo' to='/admin/about' >
      <img src="/assets/images/logo.png" />
    </Link>
    <div className="menu-wrapper">
      <NavLink className={'link-item'} activeClassName='active-link' to={APP_URLS.DASHBOARD}>Dashboard</NavLink>
      <NavLink className={'link-item'} activeClassName='active-link' to={APP_URLS.MARKETING}>Marketing</NavLink>
      <NavLink className={'link-item'} activeClassName='active-link' to={APP_URLS.PROSPECTS}>Prospects</NavLink>
      <NavLink className={'link-item'} activeClassName='active-link' to={APP_URLS.YOUR_ACCOINT}>Your Account</NavLink>
    </div>
  </div>
}

export default withRouter(Sidebar)
