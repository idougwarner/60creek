import React from 'react'
import './Dashboard.scss'
import Menu from '../../components/Menu'

const Dashboard = () => {
  return (
    <div className='sixty-creek-dashboard'>
      <Menu/>
      <div className='g-page-background-with-nav'>
        <h1>This is the Dashboard</h1>
      </div>
  </div>
  )
}

export default Dashboard