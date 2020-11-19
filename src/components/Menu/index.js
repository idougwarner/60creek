import React from 'react'
import './Menu.scss'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

const Menu = (props) => {
  return <div className="menu">
    <Link className='logo' to='/about'/>
    <div className="menu-wrapper">
      <Link className={'link-item' + (props.location.pathname === '/' ? ' selected' : '')} to="/">Home</Link>
      <Link className={'link-item' + (props.location.pathname === '/prospects' ? ' selected' : '')} to="/prospects">Prospects</Link>
      <Link className={'link-item' + (props.location.pathname === '/marketing' ? ' selected' : '')} to="/marketing">Marketing</Link>
      <Link className={'link-item' + (props.location.pathname === '/dashboard' ? ' selected' : '')} to="/dashboard">Dashboard</Link>
      <Link className={'link-item' + (props.location.pathname === '/youraccount' ? ' selected' : '')} to="/youraccount">Your Account</Link>
      <Link className={'link-item' + (props.location.pathname === '/logout' ? ' selected' : '')} to="/">Logout</Link>
    </div>
  </div>
}

export default withRouter(Menu)
// // 
// import React from 'react'

// const Menu = () => {
//   return <div className='menu'>
//       <Link className='link-item' to="/">Home</Link>
//       <Link className='link-item' to="/prospects">Prospects</Link>
//     </div>
// }

// export default Menu