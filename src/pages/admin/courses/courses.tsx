import Table, {AvatarCell } from '../../../components/Table/Table'
import {getCourses} from "../../../services/course.service";

import Icon from "assets/images/courses.png"
import {Button} from 'components';
import {AdminLayout} from 'layouts';
import React from 'react';
import {useNavigate} from "react-router-dom";
import {routes} from 'router/routes';

const columns =[
    {
        Header: "",
        accessor: 'image',
        Cell: AvatarCell,
        imgAccessor: "image",
    },
    {
        Header: "Titre",
        accessor: 'title',
    },
    {
        Header: "Catégorie",
        accessor: 'category',
    },
    {
        Header: "Formateur",
        accessor: 'teacher.email',
    },
    {
        Header: "Élèves Inscrits",
        accessor: 'assignments.length',
    }
]
const Courses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = React.useState([]);


    React.useEffect(() => {
         getCourses().then(response => {
            if (response) setCourses(response.data)
        });
    }, [])

    return (
        <AdminLayout>
            <div className="row">
                <div className="col-lg-9 d-flex d-flex-middle">
                    <h2 className="text-grey-900 font-md fw-700">Mes Formations sur Wab</h2>
                </div>
                <div className="col-lg-3 d-flex mb-2">                    
                    <a
                        href={routes.ADMINISTRATION_NEW_COURSES.path}
                        className="btn btn-block border-0 w-100 bg-skype p-3 text-white fw-600 rounded-lg d-inline-block font-xssss btn-light"
                        >
                        <i className="feather-plus fw-700 mr-1"></i> Créer une Nouvelle Formation
                    </a>
                </div>
            </div>
            <Table columns={columns} data={courses.length > 0 ? courses : []} urlRedirect={"/admin/course/"}/>
        </AdminLayout>
    );
};

export {Courses};
