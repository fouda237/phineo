import {accessConditionsTypes,conditionsTypes} from "../../../../../types/enums/conditionsTypesEnum";

import EditorModule from 'components/Modules/EditorModule/create/EditorModule';
import FichierModule from 'components/Modules/FichierModule/create/FichierModule';
import PDFModule from 'components/Modules/PDFModule/create/PDFModule';
import CreateQuizModule from 'components/Modules/QuizModule/create/CreateQuizModule';
import VideoModule from 'components/Modules/VideoModule/create/VideoModule';
import { useAppStateContext, useCourseContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { FormEvent } from 'react';
import { Spinner } from "react-activity";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { getModuleDetails, updateModule } from "services/course.service";
import { modulesTypesEnum } from 'types/enums/modulesTypesEnum';


const detailsModulePage = () => {
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const [currentModuleType, setCurrentModuleType] = React.useState<modulesTypesEnum>(modulesTypesEnum.NULL);
    const [moduleDetails, setModuleDetails] = React.useState({
        conditions: {
            type: "",
            conditionValue: "sdf"
        },
        accessConditions: {
            type: "",
            conditionValue: "sdf"
        },
        id: "",
        title: "",
        description: "",
        type: currentModuleType,
        filePath: "",
        content: "",
        quizContent: {
            questions: ""
        }
    })
    
    const [loading, setLoading] = React.useState(false);
    const params = useParams();

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


    const getCurrentModule = (moduleType: modulesTypesEnum) => {
        switch (moduleType) {
            case (modulesTypesEnum.NULL):
                return <Spinner />;
            case (modulesTypesEnum.VIDEO):
                return <VideoModule onChange={updateFilePath} value={moduleDetails.filePath} />
            case (modulesTypesEnum.PDF):
                return <PDFModule onChange={updateFilePath} value={moduleDetails.filePath} />
            case (modulesTypesEnum.EDITOR):
                return <EditorModule onChange={updateContent} value={moduleDetails.content} />
            case (modulesTypesEnum.FICHIER):
                return <FichierModule onChange={updateFilePath} value={moduleDetails.filePath} />
            case (modulesTypesEnum.QUIZ):
                return <CreateQuizModule value={moduleDetails.quizContent} updateQuiz={updateQuiz} updateMode moduleDetails={moduleDetails}/>
        }
    }


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateModule({
            moduleId: moduleDetails.id,
            type: moduleDetails.type,
            filePath: moduleDetails.filePath,
            content: moduleDetails.content,
            title: moduleDetails.title,
            description: moduleDetails.description,
            conditions: moduleDetails.conditions,
            accessConditions: moduleDetails.accessConditions,
            quizContent: moduleDetails.quizContent

        }).then(response => {
            if (response && response.status === 200) {
                toast.success('Module mise à jour !')
            }
        })
    }

    React.useEffect(() => {
        setLoading(true)
        if (!params) {
            setLoading(false)
            return
        };
        courseContext.getCurrentCourse(params.courseId);
        getModuleDetails(`${params.moduleId}`).then(response => {
            if (response) {
                setModuleDetails({ ...response.data })
            }
            setLoading(false)
        })
    }, [params])


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
                            <h2 className="text-grey-900 font-md fw-700">{moduleDetails.title}</h2>
                            <h3 className="text-grey-900 font-xs fw-600"> <i className="feather-edit font-xss mr-3"></i>Modifier le Module</h3>
                        </div>
                        <a
                            href={`/admin/course/${courseContext.currentCourse.id}`}
                            className="ml-auto p-0 btn p-2 lh-24 pr-3 pl-3 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR À LA FORMATION
                        </a>
                    </div>
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
                                    { loading ? <Spinner /> : (
                                        <>
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
                                                            value={moduleDetails.title}
                                                            onChange={(e) => setModuleDetails({ ...moduleDetails, title: e.target.value })}
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
                                                            accessConditions: {type: e.target.value, conditionValue: ""}
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
                                                            value={moduleDetails.accessConditions.conditionValue}
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


                                    <div className='row mt-3'>
                                        {
                                            (moduleDetails.type === modulesTypesEnum.QUIZ || moduleDetails.type === modulesTypesEnum.VIDEO) && (
                                                <div className="col-md-12">
                                                    <h2 className="text-grey-900 font-xs fw-700">Conditions de Validation du Module</h2>
                                                    <div className="form-group mb-1">
                                                        <select
                                                            className="form-control form_control"
                                                            value={moduleDetails.conditions.type}
                                                            onChange={(e) => setModuleDetails({
                                                                ...moduleDetails,
                                                                conditions: {type: e.target.value, conditionValue: ""}
                                                            })}
                                                        >
                                                            <option value={conditionsTypes.NO_CONDITION}>
                                                                Par défaut - Module Validé par l'Élève
                                                            </option>
                                                            {
                                                                moduleDetails.type === modulesTypesEnum.QUIZ && (
                                                                    <option value={conditionsTypes.PERCENT}>
                                                                        Score Minimal au Quiz
                                                                    </option>
                                                                )
                                                            }
                                                            {
                                                                moduleDetails.type === modulesTypesEnum.VIDEO && (
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
                                                        value={moduleDetails.conditions.conditionValue}
                                                        placeholder="Pourcentage % *"
                                                        className="form-control form_control"
                                                        onChange={(e) => setModuleDetails({
                                                            ...moduleDetails,
                                                            conditions: {
                                                                type: moduleDetails.conditions.type,
                                                                conditionValue: e.target.value
                                                            }
                                                        })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    </div>


                                    <div className='row mt-3'>
                                        {
                                            getCurrentModule(moduleDetails.type)
                                        }
                                    </div>
                                    
                                    { (moduleDetails.type !== modulesTypesEnum.QUIZ && !loading) && (
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <button
                                                    type="submit"
                                                    className="p-0 btn p-3 lh-24 pl-4 pr-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                                                >
                                                    <i className="feather-check mr-2"></i> Modifier le Module
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
        </AdminLayout>
    );
};

export default detailsModulePage;
