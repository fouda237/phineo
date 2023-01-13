import {ProtectedRoute} from './PrivateRoute';
import InteractionDetails from "../pages/admin/interaction/details";
import {ConfirmEmail} from "../pages/auth/confirm-email";
import {PasswordRecovery} from "../pages/auth/password-recovery";
import SectionDetails from "../pages/LMS/course/section/details";
import Account from 'pages/admin/account';
import {AdministrationHome} from 'pages/admin/administrationHome';
import Create from "pages/admin/course/create";
import AdminCourseDetails from "pages/admin/course/details";
import KnowledgeDetails from 'pages/admin/course/knowledge/details';
import CourseUserLogs from 'pages/admin/course/logs/details';
import CreateSection from "pages/admin/course/section/create"
import AdminSectionDetails from "pages/admin/course/section/details"
import CreateModule from "pages/admin/course/section/module/create"
import DetailsModulePage from "pages/admin/course/section/module/details"
import {Courses} from 'pages/admin/courses/courses';
import AdminInteractions from 'pages/admin/interactions/interactions';
import Notifications from 'pages/admin/notifications';
import Stats from 'pages/admin/stats';
import {CommandesPage} from 'pages/admin/user/commandes.page';
import CreateUserPage from 'pages/admin/user/createUser.page';
import {TeachersPage} from 'pages/admin/user/teachers.page';
import UserPage from 'pages/admin/user/user.page';
import {UsersPage} from 'pages/admin/user/users.page';
import UserStats from 'pages/admin/userStats';
import { EmrysLogin } from 'pages/auth/emrys-login';
import {EmrysRegistration} from 'pages/auth/emrys-registration';
import {Login} from 'pages/auth/login';
import {PasswordForgot} from 'pages/auth/password-forgot';
import InscriptionCourse from 'pages/inscriptionCourse';
import Interactions from 'pages/interactions';
import CourseDetail from 'pages/LMS/course/details';
import DisplayModulePage from 'pages/LMS/course/section/module/details';
import CourseList from 'pages/LMS/coursesList';
import Password from 'pages/password';
import Settings from 'pages/settings';
import Support from 'pages/support';
import TeacherSupport from 'pages/teacherSupport';
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {routes} from "router/routes"
import {rolesTypesEnum} from 'types/enums/rolesTypesEnum';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Login />}/>
                {(window.location.host === 'laformationenchantee.Wab.co' || window.location.host === '192.168.0.149:5000') && (
                    <Route path={routes.EMRYS_LOGIN.path} element={<EmrysLogin/>}/>
                )}
                <Route path={routes.AUTH_LOGIN.path} element={<Login/>}/>
                <Route path={routes.AUTH_CONFIRM_EMAIL.path} element={<ConfirmEmail />}/>
                <Route path={routes.HOME.path} element={<Login/>}/>
                <Route path={routes.EMRYS_REGISTRATION.path} element={<EmrysRegistration/>}/>
                <Route path={routes.PASSWORD_FORGOT.path} element={<PasswordForgot />}/>
                <Route path={routes.PASSWORD_RECOVERY.path} element={<PasswordRecovery />}/>
                
                <Route element={<ProtectedRoute roles={[rolesTypesEnum.ADMIN]}/>}>
                    <Route path={routes.ADMINISTRATION_USERS.path} element={<UsersPage/>}/>
                    <Route path={routes.ADMINISTRATION_USER.path} element={<UserPage/>}/>
                    <Route path={routes.ADMINISTRATION_CREATE_USER.path} element={<CreateUserPage/>}/>
                    <Route path={routes.ADMINISTRATION_TEACHERS.path} element={<TeachersPage/>}/>
                    <Route path={routes.ANALYTICS.path} element={<Stats/>}/>
                    <Route path={routes.USER_STATS.path} element={<UserStats/>}/>
                    <Route path={routes.ADMINISTRATION_COMMANDES.path} element={<CommandesPage/>}/>
                </Route>

                <Route element={<ProtectedRoute roles={[rolesTypesEnum.ADMIN, rolesTypesEnum.TEACHER]}/>}>
                    <Route path={routes.ADMINISTRATION_COURSES.path} element={<Courses/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE.path} element={<AdminCourseDetails/>}/>
                    <Route path={routes.ADMINISTRATION_KNOWLEDGE.path} element={<KnowledgeDetails/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE_SECTION.path} element={<AdminSectionDetails/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE_MODULE.path} element={<DetailsModulePage/>}/>
                    <Route path={routes.ADMINISTRATION_NEW_COURSES.path} element={<Create/>}/>
                    <Route path={routes.ADMINISTRATION_NEW_SECTION.path} element={<CreateSection/>}/>
                    <Route path={routes.ADMINISTRATION_NEW_MODULE.path} element={<CreateModule/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE_INTERACTIONS.path} element={<AdminInteractions/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE_INTERACTION.path} element={<InteractionDetails/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE_INTERACTION_DETAIL.path} element={<InteractionDetails/>}/>
                    <Route path={routes.ADMINISTRATION_ACCOUNT.path} element={<Account/>}/>
                    <Route path={routes.ADMINISTRATION_COURSE_USER_LOGS.path} element={<CourseUserLogs/>}/>
                </Route>

                <Route element={<ProtectedRoute roles={[rolesTypesEnum.ADMIN, rolesTypesEnum.TEACHER, rolesTypesEnum.STUDENT, rolesTypesEnum.EMRYS]}/>}>
                    <Route path={routes.LMS_COURSE.path} element={<CourseDetail/>}/>
                    <Route path={routes.LMS_COURSES.path} element={<CourseList/>}/>
                    <Route path={routes.LMS_COURSE_MODULE.path} element={<DisplayModulePage />} />
                    <Route path={routes.INTERACTION.path} element={<Interactions/>}/>
                    <Route path={routes.ADMINISTRATION.path} element={<Support/>}/>
                    <Route path={routes.SUPPORT_TEACHER.path} element={<TeacherSupport/>}/>
                    <Route path={routes.INSCRIPTION.path} element={<InscriptionCourse/>}/>
                    <Route path={routes.SETTINGS.path} element={<Settings/>}/>
                    <Route path={routes.ACCOUNT.path} element={<Account/>}/>
                    <Route path={routes.PASSWORD.path} element={<Password/>}/>
                    <Route path={routes.NOTIFICATIONS.path} element={<Notifications />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
