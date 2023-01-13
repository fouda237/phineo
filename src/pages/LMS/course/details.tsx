import AutoSuggestInput from "../../../components/AutoSuggest/AutoSuggest";
import {getModuleTitle, updateCourseAssignments} from "../../../services/course.service";
import {getUsers} from "../../../services/user.service";
import {ITeacher} from "../../../types/user.types";
import For from '../../../assets/images/wab_formation.jpg'
import Icon from "assets/images/courses.png"
import clsx from 'clsx';
import {AdminSideBar, Button, SideBar} from "components";
import {useAppStateContext, useCourseContext} from 'context';
import {AdminLayout} from 'layouts';
import React, {FormEvent, useState} from 'react';
import { Spinner } from "react-activity";
import { Accordion } from 'react-bootstrap';
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ReactTooltip from "react-tooltip";
import authService from "services/auth.service"
import {createLog} from "services/user.service";

const AdminCourseDetails = () => {
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const navigate = useNavigate();
    const [canMessage, setCanMessage] = React.useState(true);
    const [messageLoaded, setMessageLoaded] = React.useState(false);
    const params = useParams();
    const [modulesName, setModuleName] = useState({})

    React.useEffect(() => {
        if (!params) return;
            courseContext.getCurrentCourseWab(params.courseId);
            createLog(params, 'course')
    }, [])

    if (!courseContext.currentCourse) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )


    if ((
        courseContext.currentCourse.id === '625056b616f562c67ee6bfdf'
      || courseContext.currentCourse.id === '625056b616f562c67ee6bfdf'
      || courseContext.currentCourse.id === '627cef43454b0c003e41bdcc'
      || courseContext.currentCourse.id === '627bec5777fb3126e504d199'
      || courseContext.currentCourse.id ===  '627bec7077fb31f81404d1a7'
      || courseContext.currentCourse.id === '627bec9a8f6df33efde535aa'
      || courseContext.currentCourse.id ===  '627becae8f6df33b30e535b1'
      || courseContext.currentCourse.id ===  '627becc28f6df3f02de535bd'
      || courseContext.currentCourse.id ===  '627becdd77fb31415804d1c7'
      || courseContext.currentCourse.id ===  '627becee77fb31c15804d1ce'
      || courseContext.currentCourse.id ===   '627bed038f6df32dd0e535cf'
      ) && !messageLoaded){
        setCanMessage(false)
        setMessageLoaded(true)
    }
    
    
    const date = Date.now()
    const beginDate = Math.floor(new Date(courseContext.currentCourse.assignments[0].beginDate).getTime())

    if (beginDate > date) {
        navigate(`/formations`);
        toast.error("Votre Formation n'a pas encore démarré... ")
    }
    
    // IMPORT CHAYALL
  if (window.location.host === 'laformationenchantee.Wab.co') {
    const script = document.createElement('script');
    script.src = 'https://widgets.greenbureau.com/js/chayall.js';
    script.async = true;
    script.defer = true;
    script.type = 'text/javascript';
    script.setAttribute('data-chayall-account', '802d967d-0f73-45de-9347-348dfa40201e');
    document.body.appendChild(script);
  }


    const testModuleName = (id:any) => {
        return (
            courseContext.currentCourse.sections.map((section: any, key: number) => {
                return (
                    section.modules.map((module:any, key: number) => {
                        if(id === module.id){
                            return( 
                                <ReactTooltip id={id}>
                                    <span><i className="feather-lock mr-1"></i> Module Bloqué... Il faut d'abord valider : {module.title}</span>
                                </ReactTooltip>
                            )
                        }
                    })
                )
            })

        )
    }
    
    
    return (
        <AdminLayout>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded-lg overflow-hidden">
                        <div className="card-body pt-4 pb-4 pl-5 bg-skype -09">
                            <span className="font-xssss fw-600 text-white-500 mb-0 d-inline-block">
                                Votre Formation :
                            </span>
                            <h2 className="fw-700 font-lg d-block lh-4 mb-0 text-white mt-0">
                                {courseContext.currentCourse.title}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h2 className="text-grey-900 font-md mt-4 mb-0 fw-700">Sommaire de votre Formation</h2>

                    <div className="card d-block border-0 rounded-lg overflow-hidden mt-3">
                        <Accordion
                        defaultActiveKey="0"
                        className="accordian mb-3 accordian-course"
                        >
                        {
                            courseContext.currentCourse.sections.map((section: any, key:number) => {
                                return (
                                    <Accordion.Item
                                        eventKey="0"
                                        key={key}
                                        className="accordion-item accordion-collapse border mb-3 shadow-xss rounded-sm bg-white"
                                    >
                                        <Accordion.Header className="mb-0">
                                            {section.title}
                                        </Accordion.Header>
                                        <Accordion.Body className="border-top">
                                        {
                                            section.modules.map((module: any, key: number) => {
                                                if(module.accessConditions.type === "validModule"){
                                                    let canAccess = false;

                                                    for (let x = 0; x < courseContext.currentCourse.responses[0].modulesResponse.length; x++){
                                                        if (courseContext.currentCourse.responses[0].modulesResponse[x].moduleId === module.accessConditions.conditionValue){
                                                            if (courseContext.currentCourse.responses[0].modulesResponse[x].validated === true){
                                                                canAccess = true
                                                            }
                                                        }
                                                    }
                                                    
                                                    if (!canAccess){
                                                        return (
                                                            <>
                                                            {testModuleName(module.accessConditions.conditionValue)}
                                                            <div className="card-body d-flex p-2" key={key}>
                                                                <span className="bg-skype btn-round-s rounded-lg font-xssss text-white fw-600">
                                                                    {key+1}
                                                                </span>
                                                                <span className="font-xsss fw-500 text-grey-800 ml-2">
                                                                    {module.type === "video" && <i className="feather-youtube mr-2"></i>}
                                                                    {module.type === "quizz" && <i className="feather-help-circle mr-2"></i>}
                                                                    {module.type === "pdf" && <i className="feather-file-text mr-2"></i>}
                                                                    {module.type === "text" && <i className="feather-align-left mr-2"></i>}
                                                                    

                                                                    <a className='tooltipText' data-tip data-for={module.accessConditions.conditionValue}><i className="feather-lock mr-1"></i>{module.title} </a>

                                                                </span>

                                                            </div>
                                                            </>
                                                        )
                                                    }


                                                }

                                                

                                                if (courseContext.currentCourse.responses[0].modulesResponse.length > 0){
                                                  for (let a = 0; a < courseContext.currentCourse.responses[0].modulesResponse.length; a++){
                                                    if (courseContext.currentCourse.responses[0].modulesResponse[a].moduleId === module.id){
                                                      if (courseContext.currentCourse.responses[0].modulesResponse[a].validated === true){
                                                        return (
                                                            <div className="card-body d-flex p-2" key={key}>
                                                                <Link
                                                                to={`/formations/${courseContext.currentCourse.id}/module/${module.id}`}
                                                                >
                                                                <span className="bg-skype btn-round-s rounded-lg font-xssss text-white fw-600">
                                                                    {key+1}
                                                                </span>
                                                                <span className="font-xsss fw-500 text-grey-800 ml-2">
                                                                    {module.type === "video" && <i className="feather-youtube mr-2"></i>}
                                                                    {module.type === "quizz" && <i className="feather-help-circle mr-2"></i>}
                                                                    {module.type === "pdf" && <i className="feather-file-text mr-2"></i>}
                                                                    {module.type === "text" && <i className="feather-align-left mr-2"></i>}
                                                                    {module.title} <i className="feather-check text-success ml-1"></i>
                                                                </span>
                                                                </Link>

                                                            </div>
                                                        )
                                                      }
                                                    }
                                                  }
                                                }
                                                return (
                                                    <div className="card-body d-flex p-2" key={key}>
                                                        <Link
                                                        to={`/formations/${courseContext.currentCourse.id}/module/${module.id}`}
                                                        >
                                                        <span className="bg-skype btn-round-s rounded-lg font-xssss text-white fw-600">
                                                            {key+1}
                                                        </span>
                                                        <span className="font-xsss fw-500 text-grey-800 ml-2">
                                                            {module.type === "video" && <i className="feather-youtube mr-2"></i>}
                                                            {module.type === "quizz" && <i className="feather-help-circle mr-2"></i>}
                                                            {module.type === "pdf" && <i className="feather-file-text mr-2"></i>}
                                                            {module.type === "text" && <i className="feather-align-left mr-2"></i>}
                                                            {module.title}
                                                        </span>
                                                        </Link>

                                                    </div>
                                                )
                                            }) 
                                        }
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            }) 
                        }
                        </Accordion>
                    </div>

                </div>

                <div className="col-md-6 mt-4">
                    <img src={For} style={{ width: '100%', borderRadius: '20px' }}/>

                    {courseContext.currentCourse.description.trim().length > 0 && (
                        <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss mb-3 mt-3">
                            <h2 className="fw-700 font-md d-block lh-4 mb-0">
                                Un Mot de votre Formateur
                            </h2>
                            <p className="font-xsss fw-500 text-grey-600 lh-30 pr-5 mt-3 mr-5 custom-mobile-para">
                                {courseContext.currentCourse.description}
                            </p>
                        </div>
                    )}


                    {canMessage && (
                        <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss mb-3 pb-5 mt-3 text-center">
                            <h2 className="fw-700 font-md d-block lh-4 mb-0">
                                Une Question ?
                            </h2>
                            <p className="font-xsss fw-500 text-grey-600 lh-30 mt-2 mb-4">
                                Une Question au sujet de la formation ? <br /> Votre formateur est là pour vous répondre !
                            </p>

                            <a
                              className="rounded-xl p-3 pr-5 pl-5 float-center bg-skype text-white text-center font-xsss fw-500 border-2"
                              href={`/message-a-mon-formateur?formation=${courseContext.currentCourse.teacher}`}
                              target="_blank"
                            >
                              Envoyer un Message
                            </a>
                        </div>
                    )}

                    {(courseContext.currentCourse.knowledge && courseContext.currentCourse.knowledge.length > 0) && (
                            <>
                            <h2 className="text-grey-900 font-md mt-5 mb-3 fw-700">Questions Fréquentes :</h2>
                            {courseContext.currentCourse.knowledge.map((knowledge: {message: string, explain: string}, key: number) => {
                                return (
                                    <div key={key}>
                                        <hr className="solid mt-3 mb-3"></hr>

                                        <h2 className="text-grey-800 font-xs fw-700"><i className="feather-arrow-right mr-2"></i>{knowledge.message}</h2>
                                        <p className="font-xsss fw-600 text-grey-700">{knowledge.explain}</p>
                                    </div>
                                )
                            })}
                        </>
                    )}
                </div>
            </div>
            
        </AdminLayout>
    );
};

export default AdminCourseDetails;

