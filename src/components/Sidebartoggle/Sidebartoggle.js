import logo from '../../assets/images/wab_formation.jpg'
import logoEmrys from '../../assets/images/logo_lfe.png'
import logoEmrysWhite from '../../assets/images/logo_lfe_white.png'
import logoWhite from '../../assets/images/logo_white.png'

import React from "react"
import { Link } from 'react-router-dom';

const Sidebartoggle = ({ themeActive, userDatas }) => {
    let clickedClass = "feather-chevrons-right"
    const body = document.body
    const lightTheme = "sidebar-deactive"
    const darkTheme = "sidebar-toggled"
    let theme
  
    if (localStorage) {
      theme = localStorage.getItem("theme")
    }
  
    if (theme === lightTheme || theme === darkTheme) {
      body.classList.add(theme)
    } else {
      body.classList.add(lightTheme)
    }
  
    const switchTheme = e => {
      if (theme === darkTheme) {
        body.classList.replace(darkTheme, lightTheme)
        e.target.classList.remove(clickedClass)
        localStorage.setItem("theme", "sidebar-deactive")
        theme = lightTheme
      } else {
        body.classList.replace(lightTheme, darkTheme)
        e.target.classList.add(clickedClass)
        localStorage.setItem("theme", "sidebar-toggled")
        theme = darkTheme
      }
    }
  
    return (
        <>
            <button id="sidebarToggle" className={`noMobile border-0 ms-4 bg-transparent d-flex mr-auto mt-0 ${theme === "dark" ? clickedClass : ""}`} onClick={e => switchTheme(e)}>
                <i className="feather-chevrons-left text-white font-lg text-grey-400"></i>
            </button>
            <Link to="/">
                {themeActive === 'theme-dark' ? (
                    <img className='logo-toggled noMobile' src={userDatas.user.role === "emrys" ? logoEmrysWhite : logoWhite} alt="logo Wab"/>
                ) : (
                    <img className='logo-toggled noMobile' src={userDatas.user.role === "emrys" ? logoEmrys : logo} alt="logo Wab"/>
                )}
            </Link>     
        </>
    )
  }
  
  export default Sidebartoggle