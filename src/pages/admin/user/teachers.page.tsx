import Table, {AvatarCell, SelectColumnFilter, StatusPill} from '../../../components/Table/Table'
import {getUsers} from "../../../services/user.service";

import Icon from "assets/images/user.png"
import {AdminLayout} from 'layouts';
import React from 'react';
import {routes} from 'router/routes';

const columns =  [
    {
        Header: "Prénom",
        accessor: 'lastName',
    },
    {
        Header: "Nom",
        accessor: 'firstName',
    },
    {
        Header: "Email",
        accessor: 'email',
    },
    {
        Header: "Rôle",
        accessor: 'role',
        Cell: StatusPill,
    }
]

const TeachersPage = () => {
    const [users, setUsers] = React.useState([]);



    React.useEffect(() => {
        getUsers().then(response => {
            if (response) {
                const teachers = [] as any
                response.data.map((item: any) => {
                    if (item.role === "teacher") {
                        teachers.push(item)
                    }
                })
                setUsers(teachers)
            }
        })
    }, [])

    return (
        <AdminLayout>
            <div className="row">
                <div className="col-lg-9 d-flex d-flex-middle">
                    <h2 className="text-grey-900 font-md fw-700">Formateurs Wab</h2>
                </div>
                <div className="col-lg-3 d-flex mb-2">                    
                    <a
                        href={`${routes.ADMINISTRATION_CREATE_USER.path}?type=formateur`}
                        className="btn btn-block border-0 w-100 bg-skype p-3 text-white fw-600 rounded-lg d-inline-block font-xssss btn-light"
                        >
                        <i className="feather-plus fw-700 mr-1"></i> Créer un Nouveau Formateur
                    </a>
                </div>
            </div>
            <Table columns={columns} data={users.length > 0 ? users : []} urlRedirect={"/admin/user/"}/>
        </AdminLayout>
    );
};

export {TeachersPage};
