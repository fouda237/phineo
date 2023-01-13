import Darkbutton from './Darkbutton'
import user from '../../assets/images/user2.jpg'

import React, { Component, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const TopHeader = ({ backLink }) => {


  const [isOpen, setIsOpen] = useState(true);

  function toggleOpen() {
      setIsOpen(!isOpen);
  }

  return (
    <>
    {/*
    <div className="middle-sidebar-header bg-white">
    <button onClick={toggleOpen} className="header-menu"></button>

    {backLink ? (
      <a
      href={backLink}
      className="mt-0 p-0 btn p-2 lh-24 w100 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white"
      >
        RETOUR
      </a>
    ) : ''}
      <ul className="d-flex ml-auto right-menu-icon">
        <Darkbutton />
        <li>
          <Link to="/default-user-profile">
            <img
              src={user}
              alt="user"
              className="w40 mt--1 rounded-circle"
            />
          </Link>
        </li>
        <li>
        </li>
      </ul>
    </div>
*/ }</>
  )
}

export default TopHeader;
