import Icon from "assets/images/courses.png"
import clsx from 'clsx';
import {AdminSideBar, Button} from "components";
import {useAppStateContext, useCourseContext} from 'context';
import {AdminLayout} from 'layouts';
import React from 'react';
import { Spinner } from 'react-activity';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from "react-router-dom";
import {routes} from 'router/routes';
import {createSection} from "services/course.service";

interface Inputs {
    title: string,
    category: string,
    description?: string,
    image?: string
}

const Create = () => {
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const navigate = useNavigate();
    const params= useParams();
    const {register, handleSubmit, watch, formState: {errors}} = useForm<Inputs>();
    const onSubmit = handleSubmit(async (data) => {
        const createSectionResponse = await createSection({
            title: data.title,
            description: data.description,
            courseId: courseContext.currentCourse.id
        })

        if (createSectionResponse && createSectionResponse.status === 201) {
            courseContext.refreshCurrentCourse();
            navigate(`/admin/course/${courseContext.currentCourse.id}`);
            window.location.reload();
        }
    });


    React.useEffect(() => {
        if (!params) return;
        courseContext.getCurrentCourse(params.courseId);
    }, [])


    if (!courseContext.currentCourse) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )

    return (
        <AdminLayout>
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12 d-flex mb-2 d-flex-middle">
                        <div>
                            <h2 className="text-grey-900 font-md fw-700">Création d'une Nouvelle Section</h2>
                        </div>
                        <a
                            href={`/admin/course/${courseContext.currentCourse.id}`}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR
                        </a>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
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
                                            Titre de la Section
                                        </label>
                                        <input
                                            {...register("title", { required: true })}
                                            className="form-control form_control"
                                            type="text"
                                            placeholder="Titre de la Section *"
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
                                            Description de la Section
                                        </label>
                                        <textarea
                                            {...register("description", { required: true })}
                                            className="form-control form_control"
                                            rows={5}
                                            placeholder="Description de la Section *"
                                            required
                                            minLength={20}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <button
                                        type="submit"
                                        className="p-0 btn p-3 lh-24 w300 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                                    >
                                        <i className="feather-check mr-2"></i> Créer la Section
                                    </button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Create;

