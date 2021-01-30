import React from 'react'
// import './Menu.scss'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

// Left sideboard menu

const Menu = (props) => {
  return <div className="menu">
    <Link className='logo' to='/admin/about' >
      <img src="assets/images/loggo.png" />
    </Link>
    <div className="menu-wrapper">
      <Link className={'link-item' + (props.location.pathname === '/admin/dashboard' ? ' selected' : '')} to="/admin/dashboard">Dashboard</Link>
      <Link className={'link-item' + (props.location.pathname === '/admin/marketing' ? ' selected' : '')} to="/admin/marketing">Marketing</Link>
      <Link className={'link-item' + (props.location.pathname === '/admin/prospects' ? ' selected' : '')
      } to="/admin/prospects" > Prospects</Link>
      <Link className={'link-item' + (props.location.pathname === '/admin/youraccount' ? ' selected' : '')} to="/admin/youraccount" > Your Account</Link >
    </div >
  </div >
}

export default withRouter(Menu)
