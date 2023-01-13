import React from "react";
import {useNavigate} from "react-router-dom";
import { routes } from "router/routes";
import { rolesTypesEnum } from "types/enums/rolesTypesEnum";

export const redirectByRoleHooks = () => {
    const navigate = useNavigate();
    
    const redirectByRole = (role : string) => {
        switch (role) {
            case (rolesTypesEnum.STUDENT):
                navigate(routes.LMS_COURSES.path)
                break;
            case (rolesTypesEnum.EMRYS):
                navigate(routes.LMS_COURSES.path)
                break;
            case(rolesTypesEnum.ADMIN):
                navigate(routes.ADMINISTRATION_USERS.path)
                break;
            case(rolesTypesEnum.TEACHER):
                navigate(routes.ADMINISTRATION_COURSES.path)
                break;

        }
    }
    
    return {
        redirectByRole
    };
};
