import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='layout'>
      <nav className='Nav_Container'>
        <ul className='Nav_Elements_1'>
          <li className='Web_link'>
            <Link to="/" className='links_1'>AFDAIC</Link>
          </li>
        </ul>
        <ul className='Nav_Elements_2'>
          <li>
            <Link to="/home" className='links'>Home</Link>
          </li>
          <li>
            <Link to="/analysis" className='links'>Analyzer</Link>
          </li>
          <li >
            <Link to="/result" className='links'>Result</Link>
          </li>
        </ul>
     </nav>

     <Outlet />

    </div>
    
    
  )
}

