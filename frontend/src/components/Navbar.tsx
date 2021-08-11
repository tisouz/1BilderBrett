import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import TagSearch from '../containers/TagSearch';

interface NavbarProps {
  authenticated: boolean
}

const Navbar = ({ authenticated }: NavbarProps) => {
  const [isActive, setIsActive] = useState(false);

  const toggleBurger = () => {
    setIsActive(!isActive);
  }

  let links = [<NavLink key={1} to='/login' className='navbar-item' activeClassName='is-active'>Login</NavLink>];
  if (authenticated) {
    links = [<NavLink key={1} to='/create' className='navbar-item' activeClassName='is-active'>Create Post</NavLink>,
    <NavLink key={2} to='/changePassword' className='navbar-item' activeClassName='is-active'>Change Password</NavLink>,
    <NavLink key={3} to='/logout' className='navbar-item' activeClassName='is-active'>Logout</NavLink>];
  }
  
  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt='Logo'
            width='50'
            height='50'
          />
        </Link>
        {
          // eslint-disable-next-line
        }<a
          onClick={toggleBurger}
          role='button'
          className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
          aria-label='menu'
          aria-expanded='false'
          data-target='navbarMenu'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div id='navbarMenu' className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className='navbar-start'>
        { authenticated ? <TagSearch /> : null }
        </div>

        <div className='navbar-end'>

          {links}

        </div>
      </div>
    </nav>
  )
}

export default Navbar;