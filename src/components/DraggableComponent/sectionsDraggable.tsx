import { getAnswerListStyle,getItemStyle, Reorder } from "./utils";
import Icon from "../../assets/images/delete.png"
import clsx from "clsx";
import { useCourseContext } from "context";
import React, { Component } from "react";
import { DragDropContext, Draggable,Droppable } from "react-beautiful-dnd";
import { Button, Modal } from 'react-bootstrap';
import { FcBookmark } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteModule, deleteSection, updateCourseSections, updateSectionModules } from "services/course.service";

const SectionsDraggable = () => {

    const courseContext = useCourseContext();

    const [sections, setSections] = React.useState(courseContext.currentCourse.sections)
    const [deleteModal, setDeleteModal] = React.useState(false)
    const [moduleIdSelected, setModuleId] = React.useState<any>()
    const [sectionIdSelected, setSectionId] = React.useState<any>()
    const [deleteSectionModal, setDeleteSectionModal] = React.useState(false)

    const navigate = useNavigate()
    const params = useParams()

    function onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            //console.log("no-change");
            return;
        }

        if (result.type === "SECTIONS") {
            const sectionsUpdate = Reorder(
                sections,
                result.source.index,
                result.destination.index
            );
            
            updateCourseSections(courseContext.currentCourse.id, sectionsUpdate).then(res => {
                console.log(res)
                setSections(sectionsUpdate)
            }).catch(err => console.log(err))
        } else {
            const modules = Reorder(
                sections[parseInt(result.type, 10)].modules,
                result.source.index,
                result.destination.index
            );

            const sectionsUpdate = JSON.parse(JSON.stringify(sections));

            sectionsUpdate[result.type].modules = modules;
            
            updateSectionModules(sectionsUpdate[result.type].id, modules).then(res => {
                console.log(res)
                setSections(sectionsUpdate)
            }).catch(err => console.log(err))

            // setSections(sectionsUpdate)
        }
    }

    function deleteModuleTapped(sectionId: string, moduleId: string) {
        deleteModule(courseContext.currentCourse.id, sectionId, moduleId).then((response) => {
            if (response && response.status === 204) {
                toast.success('Module supprimé');
                courseContext.refreshCurrentCourse();
                window.location.reload();
            } else {
                toast.error('Une erreur est survenue, veuillez réessayer');
            }
        }).catch(err => {
            console.log(err)
            toast.error('Une erreur est survenue, veuillez réessayer');
        })
    }

    function deleteSectionTapped(sectionId: string) {
        deleteSection(courseContext.currentCourse.id, sectionId).then((response) => {
            console.log(response)
            if (response && response.status === 204) {
                toast.success('Section supprimée');
                courseContext.refreshCurrentCourse();
                window.location.reload();
            } else {
                toast.error('Une erreur est survenue, veuillez réessayer');
            }
        }).catch(err => {
            console.log(err)
            toast.error('Une erreur est survenue, veuillez réessayer');
        })
    }

    function handleSectionDeleteModal(sectionId: any) {
        setSectionId(sectionId)
        setDeleteSectionModal(!deleteSectionModal);
    }

    function handleDeleteModal(moduleId:any, sectionId: any) {
        setModuleId(moduleId)
        setSectionId(sectionId)
        setDeleteModal(!deleteModal);
    }

    return (
        <>
            <DragDropContext
                onDragEnd={onDragEnd}
            // onDragUpdate={this.onDragUpdate}
            >
                <Droppable droppableId="droppable" type="SECTIONS">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className="accordian mb-3 accordian-course accordion"
                        >
                            {sections?.map((section: any, index: any) => (
                                <Draggable
                                    key={section.id}
                                    draggableId={section.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="accordion-item border-0 mb-3 shadow-xss rounded-sm accordion-item"
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <div {...provided.dragHandleProps} className={"accordion-header d-flex"}>
                                                <span
                                                    className={clsx("text-left flex flex-row items-center w-full  transition-all rounded-md cursor-pointer",
                                                        "px-3 py-1",
                                                        "hover:bg-gray-800",
                                                        params.sectionId === section.id && 'bg-gray-800'
                                                    )}>
                                                    {section.title}
                                                </span>
                                                <div className="ml-auto d-flex">
                                                    <button className="p-1" onClick={() => navigate(`/admin/course/${courseContext.currentCourse.id}/section/${section.id}`)}>
                                                        <i className="feather-edit me-1 font-xs text-grey-500 mr-2"></i>
                                                    </button>
                                                    <button className="p-1" onClick={() => handleSectionDeleteModal(section.id)}>
                                                        <i className="ti-trash  font-xs text-danger"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={"accordion-collapse collapse show"}>
                                                <Droppable droppableId={`droppable${section.id}`} type={`${index}`}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            style={getAnswerListStyle(snapshot.isDraggingOver)}
                                                            className="accordion-body"
                                                        >
                                                            {section.modules.map((module: any, index: number) => {
                                                                return (
                                                                    <Draggable
                                                                        key={`${module.id}${index}`}
                                                                        draggableId={`${module.id}${index}`}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                className="card-body d-flex p-2"
                                                                                style={getItemStyle(
                                                                                    snapshot.isDragging,
                                                                                    provided.draggableProps.style
                                                                                )}
                                                                            >
                                                                                <span {...provided.dragHandleProps}
                                                                                    className={clsx("p-2 rounded-lg font-light text-sm text-left w-4/5 cursor-pointer hover:bg-gray-800", params.moduleId === module.id && 'bg-gray-800')}>
                                                                                        {module.type === "video" && <i className="feather-youtube mr-3"></i>}
                                                                                        {module.type === "quizz" && <i className="feather-help-circle mr-3"></i>}
                                                                                        {module.type === "pdf" && <i className="feather-file-text mr-3"></i>}
                                                                                        {module.type === "text" && <i className="feather-align-left mr-3"></i>}
                                                                                        {module.type === "fichier" && <i className="feather-file mr-3"></i>}
                                                                                        {module.type === "correction" && <i className="feather-upload mr-3"></i>}
                                                                                        {module.type === "correction-url" && <i className="feather-link mr-3"></i>}
                                                                                        {module.title}
                                                                                </span>
                                                                                <div className="ml-auto d-flex">
                                                                                    <button className="p-1 bg-white" onClick={() => navigate(`/admin/course/${courseContext.currentCourse.id}/section/${section.id}/module/${module.id}`)} style={{ border: "0px" }}>
                                                                                        <i className="feather-edit me-1 font-xs text-grey-500 mr-2"></i>
                                                                                    </button>
                                                                                    <button className="p-1 bg-white" onClick={() => handleDeleteModal(module.id, section.id)} style={{ border: '0'}}>
                                                                                        <i className="ti-trash  font-xs text-danger"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                            <div className="card-body d-flex pt-2 pl-2 pr-2 pb-0 mt-2 border-top">
                                                                <span className="p-2 rounded-lg font-light text-sm text-left w-4/5 cursor-pointer hover:bg-gray-800" onClick={() => navigate(`/admin/course/${courseContext.currentCourse.id}/section/${section.id}/module`)}>
                                                                    <i className="feather-plus mr-3"></i> Ajouter un Nouveau Module Ici
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={deleteSectionModal}
                >
                <Modal.Body className="text-center p-5">
                    <i className="ti-info-alt text-danger display4-size"></i>
                    <p className="text-grey-800 font-xsss mt-3 mb-4">
                        Êtes-vous sûr de vouloir supprimer cette Section ?
                    </p>

                    <Button
                        onClick={() => deleteSectionTapped(sectionIdSelected)}
                        className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-white bg-danger font-xssss text-uppercase fw-600 ls-3 mr-4"
                    >
                        Oui, Supprimer !
                    </Button>
                    <Button
                        onClick={() => handleSectionDeleteModal('0')}
                        className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-grey-600 bg-greylight font-xssss text-uppercase fw-600 ls-3 ms-1 ml-4"
                    >
                        Non, Annuler !
                    </Button>
                </Modal.Body>
            </Modal>

        
            <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={deleteModal}
            >
                <Modal.Body className="text-center p-5">
                    <i className="ti-info-alt text-danger display4-size"></i>
                    <p className="text-grey-800 font-xsss mt-3 mb-4">
                        Êtes-vous sûr de vouloir supprimer ce Module ?
                    </p>

                    <Button
                        onClick={() => deleteModuleTapped(sectionIdSelected, moduleIdSelected)}
                        className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-white bg-danger font-xssss text-uppercase fw-600 ls-3 mr-4"
                    >
                        Oui, Supprimer !
                    </Button>
                    <Button
                        onClick={() => handleDeleteModal('0', '0')}
                        className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-grey-600 bg-greylight font-xssss text-uppercase fw-600 ls-3 ms-1 ml-4"
                    >
                        Non, Annuler !
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export { SectionsDraggable };
