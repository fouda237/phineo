import {Button} from "../../../components";
import {createCourse} from "../../../services/course.service";

import Icon from "assets/images/courses.png"
import axios from 'axios';
import clsx from 'clsx';
import FileInput from 'components/FileInput/FileInput';
import {useAppStateContext} from 'context';
import {AdminLayout} from 'layouts';
import React from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from "react-router-dom";
import {routes} from 'router/routes';

interface Inputs {
    title: string,
    category: string,
    description?: string,
    image?: string
}

const Create = () => {
    const appStateContext = useAppStateContext();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

    const [path, setPatch] = React.useState<File>()

    const onSubmit = handleSubmit(async (data) => {
        const imageUrl = "https://imagedelivery.net/RjrK3-sZ-H0UTy2YcMGYog/febdf9d7-11ea-4f5d-f998-95ff5d960900/public";
        
        const createCourseResponse = await createCourse({
            title: data.title,
            description: data.description,
            image: imageUrl,
            category: data.category
        }) 

        if (createCourseResponse && createCourseResponse.status === 201) {
            navigate(`/admin/course/${createCourseResponse.data.id}`)
        } 
    });

    return (
        <AdminLayout>
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12 d-flex mb-4 d-flex-middle">
                        <h2 className="text-grey-900 font-md fw-700">Créer une Nouvelle Formation</h2>
                        <a
                            href={routes.ADMINISTRATION_COURSES.path}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR
                        </a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 ">
                        <div className="card border-0 px-4 pt-2 mt-2 rounded-lg admin-form">
                        <div className="card-body d-block">
                            <form
                                className="contact_form"
                                onSubmit={onSubmit}
                            >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group mb-1">
                                        <label
                                            htmlFor="product_sku"
                                            className="form-label"
                                        >
                                            Titre de la Formation
                                        </label>
                                        <input
                                            {...register("title", { required: true })}
                                            className="form-control form_control"
                                            type="text"
                                            placeholder="Titre de la Formation *"
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
                                            Catégorie de la Formation
                                        </label>
                                        <select 
                                            {...register("category", { required: true })}
                                            className="form-control form_control"
                                        >
                                            <option value={"Langue"}>
                                                Langue
                                            </option>
                                            <option value={"Digital"}>
                                                Digital
                                            </option>
                                            <option value={"Entreprise"}>
                                                Entreprise
                                            </option>
                                            <option value={"Logiciel"}>
                                                Logiciel
                                            </option>
                                            <option value={"Autres"}>
                                                Autres
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group mb-1">
                                        <label
                                            htmlFor="product_sku"
                                            className="form-label"
                                        >
                                            Description de la Formation
                                        </label>
                                        <textarea
                                            {...register("description", { required: true })}
                                            className="form-control form_control"
                                            rows={5}
                                            placeholder="Description de la Formation *"
                                            required
                                        />
                                    </div>
                                </div>
                                { FileInput("Choisir une image de couverture", (fileName) => setPatch(fileName)) }
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <button
                                        type="submit"
                                        className="p-0 btn p-3 lh-24 w250 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white mt-3"
                                    >
                                        <i className="feather-check mr-2"></i> Créer la Formation
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

export default Create;

