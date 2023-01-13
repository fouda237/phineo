import { routes } from './routes';

import { useAuthContext } from 'context';
import {ReactElement} from 'react';
import { Spinner } from 'react-activity';
import {Navigate, Outlet} from 'react-router-dom';
import { rolesTypesEnum } from 'types/enums/rolesTypesEnum';

interface IPrivateRoute {
    roles:string[]
}

const ProtectedRoute = ({roles}: IPrivateRoute) => {
   const authContext = useAuthContext();

   if(!authContext.authState.isInitialized) return <Spinner />
   if(!roles.includes(authContext.authState.user.role)){
        return <Navigate to={routes.AUTH_LOGIN.path} replace/>;
   }

    return <Outlet />;
};
export {ProtectedRoute};
