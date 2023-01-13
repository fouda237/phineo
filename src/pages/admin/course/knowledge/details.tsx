import clsx from 'clsx';
import { useAppStateContext, useAuthContext, useCourseContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { useState } from 'react';
import { Accordion, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteKnowledgeCourse,updateCourseComments } from "services/course.service";

interface Inputs {
    message: string,
    explain: string
}

const KnowledgeDetails = () => {
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const userContext = useAuthContext()
    const [deleteModal, setDeleteModal] = React.useState(false)
    const [deleteSectionModal, setDeleteSectionModal] = React.useState(false)
    const [knowledgeId, setKnowledgeId] = React.useState('')

    const navigate = useNavigate();
    const params = useParams();

    const [comments, setComments] = useState<any>([])
    const [createMode, setCreateMode] = useState(false);

    React.useEffect(() => {
        if (!params) return;
        if (courseContext.currentCourse?.id) {
            setComments(courseContext.currentCourse.knowledge)
        } else {
            courseContext.getCurrentCourse(params.id);
        }
    }, [])

    React.useEffect(() => {
        if (!params) return;
        if (courseContext.currentCourse?.id) {
            setComments(courseContext.currentCourse.knowledge)
        }
    }, [courseContext.currentCourse?.id])

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Inputs>();
    const onSubmit = handleSubmit(async (data) => {
        if (!params.id) return
        if (data.message && data.explain) {
            const updatedComments = comments
            updatedComments.push({
                user: userContext.authState.user.id,
                message: data.message,
                explain: data.explain,
                time: new Date()
            })
            const updateCommentsResponse = await updateCourseComments(params.id, updatedComments)

            if (updateCommentsResponse && updateCommentsResponse.status === 200) {
                setComments(updatedComments)
                setCreateMode(false)
                reset({ message: '', explain: ''})
            }
        }
    });

    function deleteCommentTapped(commentId: string) {
        deleteKnowledgeCourse(courseContext.currentCourse.id, commentId).then((response) => {
            if (response && response.status === 204) {
                toast.success('Knowledge supprimé');
                courseContext.refreshCurrentCourse();
                navigate(`/admin/course/${courseContext.currentCourse.id}?t=Knowledge`);
                window.location.reload();
            } else {
                toast.error('Une erreur est survenue, veuillez réessayer');
            }
        }).catch(err => {
            console.log(err)
            toast.error('Une erreur est survenue, veuillez réessayer');
        })
    }

    function handleSectionDeleteModal(id:any) {
        setDeleteSectionModal(!deleteSectionModal);
        setKnowledgeId(id)
    }

    function handleDeleteModal() {
        setDeleteModal(!deleteModal);
    }

    return (
        <>
            {!createMode && (
                <div className="row">
                    <div className="col-lg-12">
                        <button
                            onClick={() => setCreateMode(true)}
                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-0 pb-2"
                        >
                            <i className="feather-plus mr-2"></i> Ajouter un Élèment
                        </button>
                    </div>
                </div>
            )}
            
            {createMode && (
                <div className="row">
                    <div className="col-lg-12">
                        <button
                            onClick={() => setCreateMode(false)}
                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-0 pb-2"
                        >
                            <i className="feather-chevron-left mr-2"></i> Retour
                        </button>
                    </div>
                </div>
            )}

            <hr className="solid mt-4 mb-5"></hr>

            {createMode && (
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="text-grey-900 font-md fw-600">Ajouter une Question/Réponse au Knowledge</h2>
                        <div className="card border-0 mt-0 rounded-lg admin-form">
                            <div className="card-body d-block">
                                <form
                                    className="contact_form"
                                    id="form_knowledge"
                                    onSubmit={onSubmit}
                                >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group mb-1">
                                            <label
                                                htmlFor="product_sku"
                                                className="form-label"
                                            >
                                                Question
                                            </label>
                                            <input
                                                {...register("message", { required: true })}
                                                className="form-control form_control"
                                                type="text"
                                                placeholder="Question *"
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
                                                Explication
                                            </label>
                                            <textarea
                                                {...register("explain", { required: true })}
                                                className="form-control form_control"
                                                rows={5}
                                                placeholder="Explication *"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <button
                                            type="submit"
                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                                        >
                                            <i className="feather-check mr-2"></i> Ajouter la Question
                                        </button>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {!createMode && (
            <>
                <h2 className="text-grey-900 font-md fw-600 mb-4">FAQ</h2>
                <Accordion
                    defaultActiveKey="0"
                    className="accordian mb-3 accordian-course"
                    >
                    {comments ? (
                        comments.map((item: any, key: number) => {
                        return (
                            <Accordion.Item
                                    eventKey='0'
                                    className="accordion-item border-0 mb-3 shadow-xss rounded-sm bg-white mb-4"
                                >
                                    <Accordion.Header>
                                        {item.message}

                                        <div className="ml-auto d-flex">
                                            <button className="p-1 " onClick={() => handleSectionDeleteModal(item._id)}>
                                                <i className="ti-trash  font-xs text-danger"></i>
                                            </button>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {item.explain}
                                    </Accordion.Body>
                                </Accordion.Item>
                        )
                    })) : "Vous n'avez pas encore créé de FAQ pour votre Formation..."}
                </Accordion>

                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={deleteSectionModal}
                    >
                    <Modal.Body className="text-center p-5">
                        <i className="ti-info-alt text-danger display4-size"></i>
                        <p className="text-grey-800 font-xsss mt-3 mb-4">
                            Êtes-vous sûr de vouloir supprimer ce Knowledge ?
                        </p>

                        <Button
                            onClick={() => deleteCommentTapped(knowledgeId)}
                            className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-white bg-danger font-xssss text-uppercase fw-600 ls-3 mr-4"
                        >
                            Oui, Supprimer !
                        </Button>
                        <Button
                            onClick={() => handleSectionDeleteModal(0)}
                            className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-grey-600 bg-greylight font-xssss text-uppercase fw-600 ls-3 ms-1 ml-4"
                        >
                            Non, Annuler !
                        </Button>
                    </Modal.Body>
                </Modal>
            </>
            )}


        </>
    );
};

export default KnowledgeDetails;

