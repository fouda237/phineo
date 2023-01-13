const routes = {
    //AUTHENTIFICATION
    AUTH_LOGIN: {path: "/login"},
    AUTH_CONFIRM_EMAIL: {path: "/auth/confirm-email/:token"},
    HOME: {path: "/"},
    EMRYS_LOGIN: {path: "/emrys"},
    EMRYS_REGISTRATION: {path: "/la-formation-enchantee"}, // register from emrys
    PASSWORD_FORGOT: {path: "/password-lost"},
    PASSWORD_RECOVERY: {path: "/reset-password/:token"},

    //ADMINITSTRATION
    ADMINISTRATION_HOME: {path: "/admin"},
    ADMINISTRATION_ANALYTICS: {path: "/admin/global-analytics"},
    ADMINISTRATION_INTERACTIONS: {path: "/admin/interactions"},
    ADMINISTRATION_INTERACTION: {path: "/admin/interaction/:interactionId"},
    ADMINISTRATION_USERS: {path: "/admin/users"},
    ADMINISTRATION_USER: {path: "/admin/user/:userId"},
    ADMINISTRATION_CREATE_USER: {path: "/admin/user/create"},
    ADMINISTRATION_TEACHERS: {path: "/admin/teachers"},
    ADMINISTRATION_COURSE: {path: "/admin/course/:id"},
    ADMINISTRATION_KNOWLEDGE: {path: "/admin/course/:id/knowledge"},
    ADMINISTRATION_COURSE_INTERACTIONS: {path: "/admin/course/:id/interactions"},
    ADMINISTRATION_COURSE_USER_LOGS: {path: "/admin/course/:id/logs/:userId"},
    ADMINISTRATION_COURSE_INTERACTION: {path: "/admin/course/:courseId/interaction"},
    ADMINISTRATION_COURSE_INTERACTION_DETAIL: {path: "/admin/course/:courseId/interaction/:interactionId"},
    ADMINISTRATION_COURSE_SECTION: {path: "/admin/course/:courseId/section/:sectionId"},
    ADMINISTRATION_COURSE_MODULE: {path: "/admin/course/:courseId/section/:sectionId/module/:moduleId"},
    ADMINISTRATION_COURSES: {path: "/admin/courses"},
    ADMINISTRATION_NEW_COURSES: {path: "/admin/course/create"},
    ADMINISTRATION_NEW_SECTION: {path: "/admin/course/:courseId/section"},
    ADMINISTRATION_NEW_MODULE: {path: "/admin/course/:courseId/section/:sectionId/module"},
    ADMINISTRATION_STATS: {path: "/admin/stats"},
    ADMINISTRATION_ACCOUNT: {path: "/admin/account"},
    ADMINISTRATION_COMMANDES: {path: "/admin/commandes"},

    //LMS
    LMS_COURSES: {path: "/formations"},
    LMS_COURSE: {path: "/formations/:courseId"},
    LMS_COURSE_MODULE: {path: "/formations/:courseId/module/:moduleId"},
    LMS_COURSE_SECTION: {path: "/formations/:courseId/section/:sectionId"},
    LMS_COURSE_KNOWLEDGE: {path: "/formations/:courseId/knowledge"},
    LMS_COURSE_FEEDBACK: {path: "/formations/:courseId/feedback"},

    //GLOBAL
    INTERACTION: {path: "/interactions/:courseId"},
    ANALYTICS: {path: "/analytics"},
    USER_STATS: {path: "/stats"},
    SETTINGS: {path: "/parametres"},
    ACCOUNT: {path: "/parametres/mon-compte"},
    PASSWORD: {path: "/parametres/secret"},
    ADMINISTRATION: {path: "/administration"},
    SUPPORT_TEACHER: {path: "/message-a-mon-formateur"},
    INSCRIPTION: {path: "/inscription-formation"},
    LIVE_SUPPORT: {path: "/support"},
    NOTIFICATIONS: {path: "/notifications"},

}


export {routes};
