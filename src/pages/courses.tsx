import React from 'react';
import {AdminLayout} from '../layouts';
import Table, {AvatarCell, StatusPill} from '../components/Table/Table'
import Icon from "../assets/images/courses.png"

const getData = () => {
    const data = [
        {
            formateur: 'Jane Cooper',
            email: 'jane.cooper@example.com',
            title: 'Regional Paradigm Technician',
            department: 'Optimization',
            status: 'Active',
            role: 'Admin',
            students: 27,
            imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
        {
            formateur: 'Cody Fisher',
            email: 'cody.fisher@example.com',
            title: 'Product Directives Officer',
            department: 'Intranet',
            status: 'Inactive',
            role: 'Owner',
            students: 43,
            imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
        {
            formateur: 'Esther Howard',
            email: 'esther.howard@example.com',
            title: 'Forward Response Developer',
            department: 'Directives',
            status: 'Active',
            role: 'Member',
            students: 32,
            imgUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
        {
            formateur: 'Jenny Wilson',
            email: 'jenny.wilson@example.com',
            title: 'Central Security Manager',
            department: 'Program',
            status: 'Offline',
            role: 'Member',
            students: 29,
            imgUrl: 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
        {
            formateur: 'Kristin Watson',
            email: 'kristin.watson@example.com',
            title: 'Lean Implementation Liaison',
            department: 'Mobility',
            status: 'Inactive',
            role: 'Admin',
            students: 36,
            imgUrl: 'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
        {
            formateur: 'Cameron Williamson',
            email: 'cameron.williamson@example.com',
            title: 'Internal Applications Engineer',
            department: 'Security',
            status: 'Active',
            role: 'Member',
            students: 24,
            imgUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        },
    ]
    return [...data, ...data, ...data]
}


const Courses = () => {
    const columns = React.useMemo(() => [
        {
            Header: "Titre",
            accessor: 'title',
            Cell: AvatarCell,
            imgAccessor: "imgUrl",
        },
        {
            Header: "Status",
            accessor: 'status',
            Cell: StatusPill,
        },
        {
            Header: "Formateur",
            accessor: 'formateur',
        }, {
            Header: "Nombre d'étudiants",
            accessor: "students"
        }
    ], [])

    const data = React.useMemo(() => getData(), [])


    return (
        <AdminLayout>
            <section>
                <div className={"flex space-x-3 items-center "}>
                    <img src={Icon} alt={"icon"} className={"w-9"}/>
                    <h3 className={"text-gray-500"}>Liste des formations</h3>
                </div>
                <hr className={"my-6"}/>
            </section>
            <Table columns={columns} data={data}/>
        </AdminLayout>
    );
};

export {Courses};
