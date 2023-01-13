import WAB1 from '../../assets/images/logo_wab.png'
import logo from '../../assets/images/wab_formation.jpg'
import logoEmrys from '../../assets/images/logo_lfe.png'
import logoEmrysWhite from '../../assets/images/logo_lfe_white.png'
import logoWhite from '../../assets/images/logo_white.png'
import user from '../../assets/images/user2.jpg'
import { useAuthContext } from "../../context";
import { getCoursesNTeachers } from '../../services/course.service'

import clsx from 'clsx';
import Sidebartoggle from 'components/Sidebartoggle/Sidebartoggle'
import React, {useEffect, useState} from "react";
import { Spinner } from 'react-activity'
import { Link, NavLink, useLocation } from 'react-router-dom';
import { routes } from "router/routes";
import { rolesTypesEnum } from 'types/enums/rolesTypesEnum';

interface IAdminTopBar {
    navType: rolesTypesEnum
    backLink?: string
}

const AdminTopBar = ({ navType, backLink }: IAdminTopBar) => {
    const location = useLocation();
    const authContext = useAuthContext()
    const userDatas = JSON.parse(localStorage.user);

    const [isOpen, setIsOpen] = useState(false);
    const [themeActive, setThemeActive] = useState(localStorage.theme);
    const [interactionsList, setInteractionsList] = useState<any>();
    const [interactionsListLoaded, setInteractionsListLoaded] = useState(false);

    function toggleOpen() {
        setIsOpen(!isOpen);
    }

    if (localStorage.interractionsList && !interactionsListLoaded){
        setInteractionsList(JSON.parse(localStorage.interractionsList));        
        setInteractionsListLoaded(true)
    }

    const navClass = `${isOpen ? ' nav-active' : ''}`;


    const clickedClass = 'clicked';
    const body = document.body;
    const lightTheme = 'theme-light';
    const darkTheme = 'theme-dark';

    let theme:any;

    if (localStorage) {
        theme = localStorage.getItem('theme');
    }

    if (theme === lightTheme || theme === darkTheme) {
        body.classList.add(theme);
    } else {
        body.classList.add(lightTheme);
    }

    const switchTheme = (e:any) => {
        if (theme === darkTheme) {
        body.classList.replace(darkTheme, lightTheme);
        e.target.classList.remove(clickedClass);
        localStorage.setItem('theme', 'theme-light');
        theme = lightTheme;
        setThemeActive(lightTheme);
        } else {
        body.classList.replace(lightTheme, darkTheme);
        e.target.classList.add(clickedClass);
        localStorage.setItem('theme', 'theme-dark');
        theme = darkTheme;
        setThemeActive(darkTheme);
        }
    };

    const adminNav = () => {
        return (
            <>
                <div className="container pl-0 pr-0">
                    <div className="nav-content admin-nav">
                        <div className="nav-top">
                            <Link to="/">
                            {themeActive === darkTheme ? (
                                <img className='logo' src={userDatas.user.role === "emrys" ? WAB1 : WAB1} alt="logo WAB"/>
                            ) : (
                                <img className='logo' src={userDatas.user.role === "emrys" ? logoEmrys : WAB1} alt="logo WAB"/>
                            )}
                            </Link>
                            <span
                                onClick={toggleOpen}
                                className="close-nav d-inline-block d-lg-none"
                            >
                            <i className="ti-close bg-grey mb-4 btn-round-sm font-xssss fw-700 text-dark ml-auto mr-2 "></i>
                            </span>
                        </div>
                        
                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Espace Admin</span>
                        </div>
                            <ul className="mb-3">
                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_USERS.path}>
                                    <i className="feather-users  mr-3"></i>
                                    <span>Utilisateurs</span>
                                </NavLink>
                            </li>

                            <li className={clsx(location.pathname === routes.ADMINISTRATION_TEACHERS.path && 'text-pink-300', 'nav-item')}>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_TEACHERS.path}>
                                    <i className="feather-book mr-3"></i>
                                    <span>Formateurs</span>
                                </NavLink>
                            </li>

                            <li className={clsx(location.pathname === routes.ADMINISTRATION_COURSES.path && 'text-pink-300', 'nav-item')}>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_COURSES.path}>
                                    <i className="feather-monitor  mr-3"></i>
                                    <span>Formations</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_COMMANDES.path}>
                                    <i className="feather-file-text  mr-3"></i>
                                    <span>Dossiers</span>
                                </NavLink>
                            </li>

                            <li className={clsx(location.pathname === routes.ADMINISTRATION_STATS.path && 'text-pink-300', 'nav-item')}>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_STATS.path}>
                                    <i className="feather-pie-chart  mr-3"></i>
                                    <span>Wab Stats - SOON</span>
                                </NavLink>
                            </li>
                        </ul>

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Espace Étudiant</span>
                        </div>
                            <ul className="mb-3">
                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.LMS_COURSES.path}>
                                    <i className="feather-play-circle  mr-3"></i>
                                    <span>Mes Formations</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.USER_STATS.path}>
                                    <i className="feather-pie-chart  mr-3"></i>
                                    <span>Mon Parcours</span>
                                </NavLink>
                            </li>
                        </ul>
                        

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Espace Interactions</span>
                        </div>
                        <ul className="mb-3">
                            {interactionsList && (
                                interactionsList.map((interaction: any, key: number) => {
                                    return (
                                        <li className='mb-1' key={key}>
                                            <Link
                                                to={`/interactions/${interaction.id}`}
                                                className="nav-content-bttn open-font pl-2 pb-2 pt-1 h-auto"
                                                data-tab="chats"
                                            >
                                                <img
                                                src={user}
                                                alt="user"
                                                className="w40 mr-2 rounded-circle border-light-md border-danger"
                                                />
                                                <span>
                                                    <p className='m-0 lh-1 font-xsss mt-1'>
                                                        {interaction.teacher.firstName} {interaction.teacher.lastName} <br />
                                                        <span className='font-xssss'>
                                                            {interaction.title}  
                                                        </span>
                                                    </p>
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                }))}
                        </ul>

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span></span> Mon Compte
                        </div>
                        <ul className="mb-3">
                            <li className="logo d-none d-xl-block d-lg-block"></li>

                            <li>
                                <Link 
                                    className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                    to={routes.ADMINISTRATION.path}
                                >
                                    <i className="font-sm feather-message-square mr-3  text-grey-500"></i>
                                    <span>L'Administration</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={routes.SETTINGS.path}
                                    className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                >
                                    <i className="font-sm feather-settings  mr-3 text-grey-500"></i>
                                    <span>Paramètres</span>
                                </Link>
                            </li>
                            <li>
                            <Link
                                onClick={() => {
                                    authContext.logout();
                                    window.location.reload();
                                }}
                                className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                to=""
                            >
                                <i className="font-sm feather-log-out mr-3  text-grey-500"></i>
                                <span>Se Déconnecter</span>
                            </Link>
                            </li>
            
                            <li className='d-flex align-items-center mt-4'>
                                <a href="https://www.facebook.com/Wab.co" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-facebook text-facebook"></i>
                                </a>
                                <a href="https://www.instagram.com/Wab.co/" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-instagram text-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/wabimmo/" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-linkedin text-linkedin"></i>
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
            </>
        )
    }

    const teacherNav = () => {
        return (
            <>
                <div className="container pl-0 pr-0">
                    <div className="nav-content">
                        <div className="nav-top">
                            <Link to="/">
                            {themeActive === darkTheme ? (
                                <img className='logo' src={userDatas.user.role === "emrys" ? WAB1 : WAB1} alt="logo  WAB"/>
                            ) : (
                                <img className='logo' src={userDatas.user.role === "emrys" ? WAB1 : WAB1} alt="logo WAB"/>
                            )}
                            </Link>
                            <span
                                onClick={toggleOpen}
                                className="close-nav d-inline-block d-lg-none"
                            >
                            <i className="ti-close bg-grey mb-4 btn-round-sm font-xssss fw-700 text-dark ml-auto mr-2 "></i>
                            </span>
                        </div>
                        
                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Espace Formateur</span>
                        </div>
                            <ul className="mb-3">

                            <li className={clsx(location.pathname === routes.ADMINISTRATION_COURSES.path && 'text-pink-300', 'nav-item')}>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_COURSES.path}>
                                    <i className="feather-monitor mr-3"></i>
                                    <span>Espace Formations</span>
                                </NavLink>
                            </li>
{/* 
                            <li className={clsx(location.pathname === routes.ADMINISTRATION_STATS.path && 'text-pink-300', 'nav-item')}>
                                <NavLink className="nav-content-bttn open-font" to={routes.ADMINISTRATION_STATS.path}>
                                    <i className="feather-pie-chart mr-3"></i>
                                    <span>Wab Stats - SOON</span>
                                </NavLink>
                            </li>*/}
                        </ul>

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Espace Étudiant</span>
                        </div>
                            <ul className="mb-3">
                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.LMS_COURSES.path}>
                                    <i className="feather-play-circle mr-3"></i>
                                    <span>Mes Formations</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.ANALYTICS.path}>
                                    <i className="feather-pie-chart mr-3"></i>
                                    <span>Statistiques - SOON</span>
                                </NavLink>
                            </li>
                        </ul>
                        {/*

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Espace Interactions</span>
                        </div>
                        <ul className="mb-3">
                            <li>
                            <Link
                                to="#"
                                className="nav-content-bttn open-font pl-2 pb-2 pt-1 h-auto"
                                data-tab="chats"
                            >
                                <img
                                src={user}
                                alt="user"
                                className="w40 mr-2 rounded-circle"
                                />
                                <span>Nom du Formateur </span>
                                <span className="circle-icon bg-danger mt-3"></span>
                            </Link>
                            </li>
                        </ul>
                         */}

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span></span> Mon Compte
                        </div>
                        <ul className="mb-3">
                            <li className="logo d-none d-xl-block d-lg-block"></li>

                            <li>
                                <Link 
                                    className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                    to={routes.ADMINISTRATION.path}
                                >
                                    <i className="font-sm feather-message-square mr-3 text-grey-500"></i>
                                    <span>L'Administration</span>
                                </Link>
                            </li>

                            <li>
                            <Link
                                to={routes.SETTINGS.path}
                                className="nav-content-bttn open-font h-auto pt-2 pb-2"
                            >
                                <i className="font-sm feather-settings mr-3 text-grey-500"></i>
                                <span>Paramètres</span>
                            </Link>
                            </li>
                            <li>
                            <Link
                                onClick={() => {
                                    authContext.logout();
                                    window.location.reload();
                                }}
                                className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                to=""
                            >
                                <i className="font-sm feather-log-out mr-3 text-grey-500"></i>
                                <span>Se Déconnecter</span>
                            </Link>
                            </li>
                                         
                            <li className='d-flex align-items-center mt-4'>
                                <a href="https://www.facebook.com/Wab.co" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-facebook text-facebook"></i>
                                </a>
                                <a href="https://www.instagram.com/Wab.co/" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-instagram text-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/Wab-formation/" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-linkedin text-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        )
    }

    const studentNav = () => {
        return (
           
            <>
                <div className="container pl-0 pr-0">
                    <div className="nav-content">
                        <div className="nav-top">
                            <Link to="/">
                            {themeActive === darkTheme ? (
                                <img className='logo' src={userDatas.user.role === "emrys" ? logoEmrysWhite : WAB1} alt="logo Wab"/>
                            ) : (
                                <img className='logo' src={userDatas.user.role === "emrys" ? logoEmrys : WAB1} alt="logo Wab"/>
                            )}
                            </Link>
                            <span
                                onClick={toggleOpen}
                                className="close-nav d-inline-block d-lg-none"
                            >
                            <i className="ti-close bg-grey mb-4 btn-round-sm font-xssss fw-700 text-dark ml-auto mr-2 "></i>
                            </span>
                        </div>
                        
                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span>Mon Espace</span>
                        </div>
                            <ul className="mb-3">
                            <li>
                                <NavLink className="nav-content-bttn open-font" to={routes.LMS_COURSES.path}>
                                    <i className="feather-play-circle mr-3"></i>
                                    <span>Mes formations</span>
                                </NavLink>
                            </li>

                            {userDatas.user.role === "emrys" && (
                                <li>
                                    <a className="nav-content-bttn open-font" href='https://www.facebook.com/groups/572013837775748' target='_blank'>
                                        <i className="feather-unlock mr-3"></i>
                                        <span>Mon Groupe Privé</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                        

                        <div className="nav-caption fw-600 font-xssss text-grey-500">
                            <span></span> Mon Compte
                        </div>
                        <ul className="mb-3">
                            <li className="logo d-none d-xl-block d-lg-block"></li>

                            <li>
                                <Link 
                                    className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                    to={routes.ADMINISTRATION.path}
                                >
                                    <i className="font-sm feather-message-square mr-3 text-grey-500"></i>
                                    <span>L'Administration</span>
                                </Link>
                            </li>

                            <li>
                            <Link
                                to={routes.SETTINGS.path}
                                className="nav-content-bttn open-font h-auto pt-2 pb-2"
                            >
                                <i className="font-sm feather-settings mr-3 text-grey-500"></i>
                                <span>Paramètres</span>
                            </Link>
                            </li>
                            <li>
                            <Link
                                onClick={() => {
                                    authContext.logout();
                                    window.location.reload();
                                }}
                                className="nav-content-bttn open-font h-auto pt-2 pb-2"
                                to=""
                            >
                                <i className="font-sm feather-log-out mr-3 text-grey-500"></i>
                                <span>Se Déconnecter</span>
                            </Link>
                            </li>
                                     
                            <li className='d-flex align-items-center mt-4'>
                                <a href="https://www.facebook.com/Wab.co" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-facebook text-facebook"></i>
                                </a>
                                <a href="https://www.instagram.com/Wab.co/" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-instagram text-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/Wab-formation/" className="btn-round-md bg-transparent" target='_blank'>
                                    <i className="font-xs ti-linkedin text-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        )
    }

    const getNav = () => {
        switch (authContext.authState.user.role) {
            case (rolesTypesEnum.ADMIN):
                return adminNav();
                break;
            case (rolesTypesEnum.STUDENT || rolesTypesEnum.EMRYS):
                return studentNav();
                break;
            case (rolesTypesEnum.TEACHER):
                return teacherNav();
                break;
            case (rolesTypesEnum.EMRYS):
                return studentNav();
                break;
            default:
                return studentNav();
        }
    }

    return (<>
        <nav className={`navigation scroll-bar sidebar ${navClass}`}>
            {getNav()}
            {userDatas.user.role === "emrys" && (
                themeActive === darkTheme ? (
                    <div className='Wab-emrys-logo mt-4'>
                        <img className='logo mb-3' src={WAB1} alt="logo Wab emrys"/>
                    </div>
                ) : (
                    <div className='Wab-emrys-logo mt-4'>
                        <img className='logo mb-3' src={WAB1} alt="logo Wab emrys"/>
                    </div>
                )
            )}
        </nav>

    <div className="middle-sidebar-header bg-white">
    <button onClick={toggleOpen} className="header-menu mr-auto"></button> 


    {backLink ? (
      <a
      href={backLink}
      className="mt-0 p-0 btn p-2 lh-24 w100 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-700 ls-lg text-white noMobile mr-2"
      >
        <i className="feather-chevron-left mr-0"></i> RETOUR
      </a>
    ) : ''}

    <Sidebartoggle themeActive={themeActive} userDatas={userDatas}/>

    {themeActive === darkTheme ? (
        <img className='logo mobile' src={userDatas.user.role === "emrys" ? logoEmrysWhite : logoWhite} alt="logo Wab"/>
    ) : (
        <img className='logo mobile' src={userDatas.user.role === "emrys" ? logoEmrys : logo} alt="logo Wab"/>
    )}
      <ul className="d-flex ml-auto right-menu-icon">
        <li className={'nav-item dropdown '}>
            <span
                className={`navi-link  cursor-pointer ${
                theme === 'dark' ? clickedClass : ''
                }`}
                onClick={(e) => switchTheme(e)}
            >
                <i className={`feather-moon text-grey-500`}></i>
            </span>
        </li>
        <li>
        </li>
      </ul>
    </div>
    </>
    );
};

export { AdminTopBar };
