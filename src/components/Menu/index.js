import React from 'react'
import './Menu.scss'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

// Left sideboard menu

const Menu = (props) => {
  return <div className="menu">
    <Link className='logo' to='/about'/>
    <div className="menu-wrapper">
      <Link className={'link-item' + (props.location.pathname === '/dashboard' ? ' selected' : '')} to="/dashboard">Dashboard</Link>
      <Link className={'link-item' + (props.location.pathname === '/marketing' ? ' selected' : '')} to="/marketing">Marketing</Link>
      <Link className={'link-item' + (props.location.pathname === '/prospects' ? ' selected' : '')} to="/prospects">Prospects</Link>
      <Link className={'link-item' + (props.location.pathname === '/youraccount' ? ' selected' : '')} to="/youraccount">Your Account</Link>
    </div>
  </div>
}

export default withRouter(Menu)
