import { Button } from "../../../components";
import Table, {AvatarCell, StatusPill} from '../../../components/Table/Table'
import { IUser } from "../../../types/user.types";

import AutoSuggestCoursesInput from 'components/AutoSuggest/AutoSuggestCourses';
import {AdminLayout} from 'layouts';
import React, { FormEvent } from 'react';
import { Spinner } from "react-activity";
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import {routes} from 'router/routes';
import { getCourses, updateCourseAssignmentsFromUserPage } from 'services/course.service';
import { getUser, removeCourseAssignment, updateUser } from 'services/user.service';

const UserPage = () => {
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
            Header: "Élèves Inscrits",
            accessor: 'assignments.length',
        }
    ]

    const [user, setUser] = React.useState<IUser>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    });
    const [actualUser, setActualUser] = React.useState<IUser>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        courses: []
    });
    const [role, setRole] = React.useState("user")
    const [courses, setCourses] = React.useState<[any]>();
    const [assignCourse, setAssignCourse] = React.useState(false);

    const params = useParams();
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userUpdateResponse = await updateUser({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: role
        })

        if (userUpdateResponse && userUpdateResponse.data) {
            toast.success("Utilisateur mis à jour correctement")
            setActualUser(userUpdateResponse.data);
        } else {
            toast.error('Une erreur est survenue')
        }
    };
    

    React.useEffect(() => {
        if (!params.userId) return;
        getCourses().then(response => {
            if (response) setCourses(response.data)
        });
    }, [])


    React.useEffect(() => {
        if (!params.userId) return;
        getUser({ id: params.userId }).then(response => {
            if (response) {
                setUser(response.data);
                setActualUser(response.data);
                setRole(response.data.role);
            }
        });
    }, [])

    const addAssignment = async (course: any, beginDate: Date) => {
        if (course.assignments.filter((courseItem: any) => ("" + courseItem.user) === ("" + user.id)).length != 0) {
            toast.error("Cet élève est déjà affecté à cette formation.")
            return
        }

        const userToAdd = { beginDate: beginDate, user: user.id }
        const assignementsUpdated = [...course.assignments, userToAdd]
        const response = await updateCourseAssignmentsFromUserPage(course.id, assignementsUpdated)

        if (response && response.status === 200) {
            setAssignCourse(!assignCourse)
            window.location.reload();
            toast.success('Formation Ajoutée !')
        }
    }

    const deleteCourseAssignation = async (data:any) => {
        if (data) {
            const deleteCourse = await removeCourseAssignment(actualUser.id, data.id)
            if (deleteCourse && deleteCourse.status === 200) {
                getUser({ id: actualUser.id }).then(response => {
                    if (response) {
                        setUser(response.data);
                        setActualUser(response.data);
                        toast.success('La Formation a bien été enlevée !')
                    }
                });
            }
        }
    }



    if (!user.id) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )


    return (
        <AdminLayout>
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12 d-flex mb-4 d-flex-middle">
                        <h2 className="text-grey-900 font-md fw-700">Modifier l'Utilisateur : {actualUser.firstName} {actualUser.lastName}</h2>
                        <a
                            href={routes.ADMINISTRATION_USERS.path}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR
                        </a>
                    </div>
                </div>
                <Tabs
                    defaultActiveKey='1'
                    className="nav nav-tabs list-inline product-info-tab profile"
                >
                    <Tab eventKey='1' title="Informations de l'Utilisateur">
                        <div className="card border-0 px-4 pt-4 rounded-lg admin-form">
                            <div className="card-body d-block">

                                <form
                                    className="contact_form"
                                    onSubmit={onSubmit}
                                >
                                <h4 className="font-xss text-grey-800 mb-4 mt-0 fw-700">
                                    Informations de l'Utilisateur
                                </h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-1">
                                            <label
                                                htmlFor="product_sku"
                                                className="form-label"
                                            >
                                                Prénom
                                            </label>
                                            <input
                                                onChange={(e) => setUser({...user, firstName: e.target.value})}
                                                value={user.firstName}
                                                className="form-control form_control"
                                                type="text"
                                                placeholder="Son Prénom *"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-1">
                                            <label
                                                htmlFor="product_sku"
                                                className="form-label"
                                            >
                                                Nom
                                            </label>
                                            <input
                                                onChange={(e) => setUser({...user, lastName: e.target.value})}
                                                value={user.lastName}
                                                className="form-control form_control"
                                                type="text"
                                                placeholder="Son Nom *"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group mb-1">
                                            <label
                                                htmlFor="product_sku"
                                                className="form-label"
                                            >
                                                Email
                                            </label>
                                            <input
                                                onChange={(e) => setUser({...user, email: e.target.value})}
                                                value={user.email}
                                                className="form-control form_control"
                                                type="email"
                                                placeholder="Son Email *"
                                                required
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label
                                                htmlFor="product_sku"
                                                className="form-label"
                                            >
                                                Son Rôle sur Wab
                                            </label>
                                            <select 
                                                className="form-control form_control"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                <option value={"user"}>
                                                    Élève
                                                </option>
                                                <option value={"emrys"}>
                                                    Emrys Élève
                                                </option>
                                                <option value={"teacher"}>
                                                    Formateur
                                                </option>
                                                <option value={"admin"}>
                                                    Admin
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-5">
                                    <div className="col-lg-12">
                                        <button
                                            type="submit"
                                            className="p-0 btn p-3 lh-24 w250 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white mt-1"
                                        >
                                            <i className="feather-check mr-2"></i> Modifier l'Utilisateur
                                        </button>
                                    </div>
                                </div>

                                </form>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey='2' title="Formations Attribuées">
                        <div className="card border-0 px-4 pt-4 rounded-lg admin-form">
                            <div className="card-body d-block">
                                <h4 className="font-xss text-grey-800 mb-4 fw-700">
                                    Inscrits aux Formations :
                                </h4>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <Table columns={columns} data={actualUser.courses} onlyDeleteAction={deleteCourseAssignation}/>
                                    </div>
                                </div>

                                {assignCourse && (
                                    <h4 className="font-xss text-grey-800 mb-4 fw-700">
                                        Inscrire à une Formation :
                                    </h4>
                                )}

                                {assignCourse && courses && courses.length > 0 &&
                                    <AutoSuggestCoursesInput values={courses} onSelect={addAssignment} />
                                }

                                <button 
                                    className="p-0 btn p-3 lh-24 w250 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white mt-1"
                                    onClick={() => setAssignCourse(!assignCourse)} 
                                >
                                    {assignCourse ? "Retour" : "Assigner un cours"}
                                </button>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                
            </div>
        </AdminLayout>
    );
};

export default UserPage;
