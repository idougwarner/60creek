import React from 'react'
import Menu from '../../components/Menu'
import './About.scss'

const About = () => {
  return (
    <div className="about">
      <Menu />
      <div className='g-page-background-with-nav'>
        <h1>About Us</h1>
        <p>Learn more about us</p>
      </div>
    </div>
  )
}

export default About