import { Button } from "../../../components";

import Icon from "assets/images/user.png"
import clsx from 'clsx';
import { useAppStateContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import {routes} from 'router/routes';
import { createUser } from 'services/user.service';

interface Inputs {
    email: string,
    firstName: string,
    lastName: string
}

const CreateUserPage = () => {
    const appStateContext = useAppStateContext();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [role, setRole] = useState("user")
    const queryParams = new URLSearchParams(window.location.search);

    React.useEffect(() => {
        if (queryParams.get('type') === "formateur"){
            setRole('teacher')
        }
    }, [])
    

    const onSubmit = handleSubmit(async (data) => {
        const userCreatedResponse = await createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: role
        })

        if (userCreatedResponse && userCreatedResponse.status === 201) {
            window.location.reload()
            toast.success('Utilisateur a bien été créé !');
            // navigate(`/admin/course/${userUpdateResponse.data.id}`)
        }
    });

    


    return (
        <AdminLayout>
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12 d-flex mb-4 d-flex-middle">
                        <h2 className="text-grey-900 font-md fw-700">Créer un Nouvel Utilisateur</h2>
                        <a
                            href={routes.ADMINISTRATION_USERS.path}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR
                        </a>
                    </div>
                        { /* authContext.authState.error && <span className='text-red-500'>{authContext.authState.errorMessage}</span> */}
                    </div>
                    <div className="row">
                    <div className="col-lg-12 ">
                        <div className="card border-0 px-4 pt-4 mt-2 rounded-lg admin-form">
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
                                            {...register("firstName", { required: true })}
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
                                            {...register("lastName", { required: true })}
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
                                            {...register("email", { required: true })}
                                            className="form-control form_control"
                                            type="email"
                                            placeholder="Son Email *"
                                            required
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
                                                Élève Emrys
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
                            
                            <div className="row">
                                <div className="col-lg-12">
                                    <button
                                        type="submit"
                                        className="p-0 btn p-3 lh-24 w250 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-3"
                                    >
                                        <i className="feather-check mr-2"></i> Créer l'Utilisateur
                                    </button>
                                </div>
                            </div>

                            </form>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateUserPage;

