import TopHeader from './TopHeader';

import {AdminTopBar} from 'components';
import {ContentContainer} from 'components/ContentContainer/ContentContainer';
import { useAuthContext } from 'context';
import React, {Fragment,ReactElement} from 'react';
import { Spinner } from 'react-activity';
import { rolesTypesEnum } from 'types/enums/rolesTypesEnum';

interface IAdminLayout {
    children: ReactElement | ReactElement[];
    backLink?: string;
}

const AdminLayout = ({children, backLink}: IAdminLayout,) => {
    const userRole = useAuthContext().authState.user.role

    if (!userRole) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )

    return (
        <Fragment>
            <div className={`main-wrapper${window.location.host === 'laformationenchantee.Wab.co' ? ' formationenchantee' : ''}`}>
                <div className="main-content">
                    <AdminTopBar navType={userRole as rolesTypesEnum} backLink={backLink} />
                    
                    <div className="middle-sidebar-bottom theme-dark-bg">
                        <div className="middle-sidebar-left">
                            {children}
                        </div>
                    </div>
                </div>                            
            </div>
        </Fragment>
    );
};

export {AdminLayout};
