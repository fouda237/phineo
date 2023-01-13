import Icon from "assets/images/courses.png"
import clsx from 'clsx';
import {AdminSideBar, Button} from "components";
import {useAppStateContext, useCourseContext} from 'context';
import {AdminLayout} from 'layouts';
import React, {FormEvent} from 'react';
import { Spinner } from 'react-activity';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {getSectionDetails, updateSection} from "services/course.service";


const AdminSectionDetails = () => {
    const [sectionData, setSectionData] = React.useState({
        title: "",
        description: ""
    })
    const [sectionBaseData, setSectionBaseData] = React.useState({
        title: "",
        description: ""
    })
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const navigate = useNavigate();
    const params = useParams();

    React.useEffect(() => {
        if (!params) return;
        getSectionDetails(`${params.courseId}`, `${params.sectionId}`).then(response => {
            if (response) {
                setSectionData(response.data)
                setSectionBaseData(response.data)
            }
        })
    }, [params])


    React.useEffect(() => {
        if (!params) return;
        courseContext.getCurrentCourse(params.courseId);
    }, [])


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateSection({
            ...sectionData,
            courseId: `${params.courseId}`,
            sectionId: `${params.sectionId}`
        }).then(response => {
            if(response && response.status === 200) {
                toast.success('Section mise à jour !'),
                setSectionBaseData(response.data)
            }
        })
    }

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
                            <h2 className="text-grey-900 font-md fw-700">{sectionBaseData.title}</h2>
                            <h3 className="text-grey-900 font-xs fw-600"> <i className="feather-edit font-xss mr-3"></i>Modifier la Section</h3>
                        </div>
                        <a
                            href={`/admin/course/${courseContext.currentCourse.id}`}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-600 ls-lg text-white"
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
                                            onChange={(e) => setSectionData({...sectionData, title: e.target.value})}
                                            value={sectionData.title}
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
                                            onChange={(e) => setSectionData({...sectionData, description: e.target.value})}
                                            value={sectionData.description}
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
                                        className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                                    >
                                        <i className="feather-check mr-2"></i> Modifier la Section
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

export default AdminSectionDetails;

