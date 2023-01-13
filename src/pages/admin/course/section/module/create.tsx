//@ts-nocheck

import { Player } from "video-react";
import { AdminLayout } from 'layouts';
import React from 'react';
import Icon from "assets/images/courses.png"
import { AdminSideBar, Button } from 'components';
import clsx from 'clsx';
import { useAppStateContext, useCourseContext } from 'context';
import CardAddModule from 'components/CardAddModule/CardAddModule';
import { MdQuestionAnswer, MdVideoLibrary } from "react-icons/md"
import { BsFileEarmarkPdfFill, BsTextareaT } from "react-icons/bs"
import { modulesTypesEnum } from 'types/enums/modulesTypesEnum';
import VideoModule from 'components/Modules/VideoModule/create/VideoModule';
import PDFModule from 'components/Modules/PDFModule/create/PDFModule';
import FichierModule from 'components/Modules/FichierModule/create/FichierModule';
import EditorModule from 'components/Modules/EditorModule/create/EditorModule';
import CreateQuizModule from 'components/Modules/QuizModule/create/CreateQuizModule';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { createModule } from "services/course.service"
import { accessConditionsTypes, conditionsTypes } from "../../../../../types/enums/conditionsTypesEnum";
import Datetime from 'react-datetime';
import { Spinner } from 'react-activity';

const modules = [
    {
        label: "Vidéo",
        icon: 'youtube',
        method: modulesTypesEnum.VIDEO
    },
    {
        label: "Quiz",
        icon: 'help-circle',
        method: modulesTypesEnum.QUIZ
    },
    {
        label: "Document",
        icon: 'file-text',
        method: modulesTypesEnum.PDF
    },
    {
        label: "Article",
        icon: 'align-left',
        method: modulesTypesEnum.EDITOR
    },
    {
        label: "Visionneuse PDF",
        icon: 'file',
        method: modulesTypesEnum.FICHIER
    }
]

const correctionModules = [
    {
        label: "Fichier",
        icon: 'upload',
        method: modulesTypesEnum.CORRECTION
    }, 
    {
        label: "Lien Externe",
        icon: 'link',
        method: modulesTypesEnum.CORRECTIONURL
    }
]

interface Inputs {
    title: string,
    description: string,
}


const createModulePage = () => {
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const [currentModuleType, setCurrentModuleType] = React.useState<modulesTypesEnum>(modulesTypesEnum.NULL);
    const [moduleDetails, setModuleDetails] = React.useState({
        conditions: {
            type: conditionsTypes.NO_CONDITION,
            conditionValue: ""
        },
        accessConditions: {
            type: accessConditionsTypes.NO_CONDITION,
            conditionValue: ""
        },
        title: "",
        description: "",
        type: currentModuleType,
        filePath: "",
        content: "",
        quizContent: {}
    })
    const [accessDate, setAccessDate] = React.useState<Moment | string>();
    const [backToMain, setBackToMain] = React.useState(false);
    const [mapModulesLoaded, setMapModulesLoaded] = React.useState(false);
    const inputRef = React.useRef();
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();   
    const [selectedFile, setSelectedFile] = React.useState(null);
    
    
      const OnInputChange=(e)=> {
        setSelectedFile(e.target.files[0])
      }
    const onSubmit = handleSubmit(async (data,e) => {
        e.preventDefault();
        if (!params.sectionId) return;
        const vid=new FormData();
        vid.append('file',selectedFile);
        const createModuleResponse = await createModule({
            title: data.title,
            description: moduleDetails.description,
            type: currentModuleType,
            filePath:vid,
            content: moduleDetails.content,
            courseId: courseContext.currentCourse.id,
            sectionId: params.sectionId,
            conditions: moduleDetails.conditions,
            accessConditions: moduleDetails.accessConditions,
            quizContent: moduleDetails.quizContent
        })
        console.log('bojr2')
        if (!backToMain && createModuleResponse && createModuleResponse.status === 201) {
            courseContext.refreshCurrentCourse();
            console.log('bojr3')
            navigate(`/admin/course/${courseContext.currentCourse.id}/section/${params.sectionId}/module`)
            window.location.reload()
        }

        if (backToMain && createModuleResponse && createModuleResponse.status === 201) {
            courseContext.refreshCurrentCourse();
            console.log('bojr3')
            navigate(`/admin/course/${courseContext.currentCourse.id}`)
            window.location.reload()
        }
        
    })

    const getListeModules = () => {
        return (
            <>
                <div className='col-md-12'>
                    <h4 className='text-grey-900 font-sm fw-600 mb-3 text-center'>
                        Sélectionnez un type de Module :
                    </h4>
                </div>
                <div className='col-md-12'>
                    <h4 className='text-grey-900 font-xs fw-500 mb-3 text-center'>
                        Apprentissage :
                    </h4>
                </div>
                {
                    modules.map(module => {
                        return (
                            <CardAddModule 
                                label={module.label} 
                                onClick={() => setCurrentModuleType(module.method)}
                                icon={module.icon}
                                key={module.label}
                            />
                        );
                    })
                }
                <div className='col-md-12'>
                    <h4 className='text-grey-900 font-xs fw-500 mb-3 text-center'>
                        Correction :
                    </h4>
                </div>
                {
                    correctionModules.map(module => {
                        return (
                            <CardAddModule 
                                label={module.label} 
                                onClick={() => setCurrentModuleType(module.method)}
                                icon={module.icon}
                                key={module.label}
                            />
                        );
                    })
                }
            </>
        )
    }

    const updateFilePath = (path: string) => {
        setModuleDetails({ ...moduleDetails, filePath: path })
    }
    const updateContent = (html: string) => {
        setModuleDetails({ ...moduleDetails, content: html })
    }
    const updateDescription = (html: string) => {
        setModuleDetails({ ...moduleDetails, description: html })
    }
    const updateQuiz = (Quiz: any) => {
        for(let i = 0; i < Quiz.questions.length; i++){
            if(Quiz.questions[i].messageForCorrectAnswer === ""){
                Quiz.questions[i].messageForCorrectAnswer = "Bonne Réponse !"
            }

            if(Quiz.questions[i].messageForIncorrectAnswer === ""){
                Quiz.questions[i].messageForIncorrectAnswer = "Mauvaise Réponse..."
            }
        }
        setModuleDetails({ ...moduleDetails, quizContent: Quiz })
    }
  
    const getCurrentModule = () => {
        switch (currentModuleType) {
            case (modulesTypesEnum.NULL):
                return getListeModules();
            case (modulesTypesEnum.VIDEO):
                return (
                    <>
                        <div className="col-md-12">
                           
                            <div>
                                <label >Télécharger la vidéo</label>
                                <input type="file" onChange={OnInputChange} className="form-control" multiple/>
                            </div>
                            </div>
                        </>
                );

            case (modulesTypesEnum.PDF):
                return ( <>
                    <div className="col-md-12">
                       
                        <div>
                            <label >Télécharger le fichier</label>
                            <input type="file" onChange={OnInputChange} className="form-control" multiple/>
                        </div>
                        </div>
                    </>)
            case (modulesTypesEnum.EDITOR):
                return ( <>
                    <div className="col-md-12">
                       
                        <div>
                            <label >Télécharger l'article</label>
                            <input type="file" onChange={OnInputChange} className="form-control" multiple/>
                        </div>
                        </div>
                    </>)
            case (modulesTypesEnum.FICHIER):
                return (<>
                    <div className="col-md-12">
                       
                        <div>
                            <label >Télécharger le document</label>
                            <input type="file" onChange={OnInputChange} className="form-control" multiple/>
                        </div>
                        </div>
                    </>)
            case (modulesTypesEnum.QUIZ):
                return <CreateQuizModule value={moduleDetails.quizContent} updateQuiz={updateQuiz} moduleDetails={moduleDetails} />
        }
    }
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
                            <h2 className="text-grey-900 font-md fw-700">Création d'un Nouveau Module</h2>
                        </div>
                        <a
                            href={`/admin/course/${courseContext.currentCourse.id}`}
                            className="ml-auto p-0 btn p-2 lh-24 pr-3 pl-3 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR À LA FORMATION
                        </a>
                    </div>
                </div>


                <form
                    className="contact_form"
                    onSubmit={onSubmit}
                >
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                <div className="card-body d-block">
                                    { currentModuleType !== modulesTypesEnum.NULL && (
                                        <>
                                            <div className='d-flex'>
                                                <div>
                                                    <h2 className="text-grey-900 font-xs fw-700">Informations du Module</h2>
                                                </div>
                                                <a
                                                    onClick={() => setCurrentModuleType(modulesTypesEnum.NULL)}
                                                    className="ml-auto p-0 btn p-2 lh-24 pr-3 pl-3 ls-3 d-inline-block rounded-xl bg-primary-blue border-primary font-xssss fw-600 ls-lg text-primary"
                                                >
                                                    <i className="feather-chevron-left mr-0"></i> Changer de Module
                                                </a>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group mb-1">
                                                        <label
                                                            htmlFor="product_sku"
                                                            className="form-label"
                                                        >
                                                            Titre du Module
                                                        </label>
                                                        <input
                                                            {...register("title", { required: true })}
                                                            className="form-control form_control"
                                                            type="text"
                                                            placeholder="Titre du Module *"
                                                            required
                                                        />
                                                    </div>
                                                </div>                                                
                                                <EditorModule onChange={updateDescription} value={moduleDetails.description} title={'Description du Module'}/>

                                            </div>
                                        </>
                                    )}
                                    { currentModuleType !== modulesTypesEnum.NULL && (
                                        <div className='row mt-3'>
                                            <div className="col-md-12">
                                                <h2 className="text-grey-900 font-xs fw-700">Conditions d'Accès au Module</h2>
                                                <div className="form-group mb-1">
                                                    <label
                                                        htmlFor="product_sku"
                                                        className="form-label"
                                                    >
                                                        Paramètre d'Accès au Module
                                                    </label>
                                                    <select
                                                        className="form-control form_control"
                                                        value={moduleDetails.accessConditions.type}
                                                        onChange={(e) => setModuleDetails({
                                                            ...moduleDetails,
                                                            accessConditions: {type: e.target.value, value: ""}
                                                        })}
                                                        >
                                                        <option value={accessConditionsTypes.NO_CONDITION}>
                                                            Par défaut - Ouvert à Tous les Élèves
                                                        </option>
                                                        <option value={accessConditionsTypes.VALID_MODULE}>
                                                            L'Élève doit Valider un Module pour y accéder
                                                        </option>
                                                    </select>
                                                </div>
                                                {moduleDetails.accessConditions.type === "validModule" && (
                                                    <div className="form-group mb-1">
                                                        <label
                                                            htmlFor="product_sku"
                                                            className="form-label"
                                                        >
                                                            Module à Valider pour Accéder à ce Module
                                                        </label>
                                                        <select
                                                            className="form-control form_control"
                                                            onChange={(e) => setModuleDetails({
                                                                ...moduleDetails,
                                                                accessConditions: {type: moduleDetails.accessConditions.type, conditionValue: e.target.value}
                                                            })}
                                                        >
                                                                <option value={'noDefined'}>
                                                                    Choisir un module
                                                                </option>
                                                            {
                                                                courseContext.currentCourse.sections.map((section: any, key: number) => {
                                                                    return(
                                                                        <optgroup label={section.title}>
                                                                        {
                                                                            section.modules.length > 0 && (
                                                                                section.modules.map((module: any, key: number) => {
                                                                                    return(
                                                                                        <option value={module.id}>
                                                                                            {module.title}
                                                                                        </option>
                                                                                    )
                                                                                })
                                                                            )
                                                                        }
                                                                        </optgroup>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className='row mt-3'>
                                        {
                                            (currentModuleType === modulesTypesEnum.QUIZ || currentModuleType === modulesTypesEnum.VIDEO) && (
                                                <div className="col-md-12">
                                                    <h2 className="text-grey-900 font-xs fw-700">Conditions de Validation du Module</h2>
                                                    <div className="form-group mb-1">
                                                        <select
                                                            className="form-control form_control"
                                                            value={moduleDetails.conditions.type}
                                                            onChange={(e) => setModuleDetails({
                                                                ...moduleDetails,
                                                                conditions: {type: e.target.value, value: ""}
                                                            })}
                                                        >
                                                            <option value={conditionsTypes.NO_CONDITION}>
                                                                Par défaut - Module Validé par l'Élève
                                                            </option>
                                                            {
                                                                currentModuleType === modulesTypesEnum.QUIZ && (
                                                                    <option value={conditionsTypes.PERCENT}>
                                                                        Score Minimal au Quiz
                                                                    </option>
                                                                )
                                                            }
                                                            {
                                                                currentModuleType === modulesTypesEnum.VIDEO && (
                                                                    <option value={conditionsTypes.VIEWING}>
                                                                        Voir la Vidéo en Entier
                                                                    </option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className='row'>
                                    {
                                        (currentModuleType === modulesTypesEnum.QUIZ) && (
                                            moduleDetails.conditions.type === conditionsTypes.PERCENT && (
                                                <div className='col-md-6'>
                                                    <div className="form-group mb-1">
                                                        <label
                                                            htmlFor="product_sku"
                                                            className="form-label"
                                                        >
                                                            Pourcentage Minimum de Réussite au Quiz
                                                        </label>
                                                        <input 
                                                            type={"number"}
                                                            max={100}
                                                            min={0}
                                                            placeholder="Pourcentage % *"
                                                            className="form-control form_control"
                                                            onChange={(e) => setModuleDetails({
                                                                ...moduleDetails,
                                                                conditions: {
                                                                    type: moduleDetails.conditions.type,
                                                                    value: `${(e.target.value > 100 || 0 > e.target.value) ? 100 : e.target.value}`
                                                                }
                                                            })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                    </div>


                                    <div className='row mt-3'>
                                        {
                                            getCurrentModule()
                                        }
                                    </div>

                                    { (currentModuleType !== modulesTypesEnum.NULL && currentModuleType !== modulesTypesEnum.QUIZ) && (
                                        <div className="row pt-3">
                                            <div className="col-lg-12">
                                                <button
                                                    onClick={() => setBackToMain(false)}
                                                    type="submit"
                                                    className="btn p-3 lh-24 pr-5 pl-5 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                                                >
                                                    <i className="feather-check mr-2"></i> Créer le Module
                                                </button>
                                                <button
                                                    onClick={() => setBackToMain(true)}
                                                    type="submit"
                                                    className="btn p-3 ml-4 lh-24 ls-3 pr-5 pl-5 d-inline-block border-primary rounded-xl bg-white font-xsss fw-600 ls-lg text-primary mt-2 pb-2"
                                                >
                                                    <i className="feather-check mr-2"></i> Créer le Module + Retour au Sommaire
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

        </AdminLayout>
    );
};

export default createModulePage;
