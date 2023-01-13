import KnowledgeDetails from './knowledge/details';
import CommentaireDetails from './Commentaire/details';
import AdminStats from './stats/details';
import InteractionCard from '../interactions/interactions'
import AutoSuggestInput from "../../../components/AutoSuggest/AutoSuggest";
import { useAuthContext } from "../../../context";
import {duplicateCourseById, getCorrectionByCourse,removeCourse, updateCourse, updateCourseAssignments, updateImageCourse, updateTeacher} from "../../../services/course.service";
import {getLogsCourse, getUsers} from "../../../services/user.service";
import {IUser, IUserAssignment} from "../../../types/user.types";
import For from '../../../assets/images/wab_formation.jpg'
import Icon from "assets/images/courses.png"
import axios, {AxiosResponse} from "axios";
import clsx from 'clsx';
import {AdminSideBar} from "components";
import FileInput from 'components/FileInput/FileInput';
import Table, {diffCell} from "components/Table/Table";
import TableCard from 'components/Table/TableCard';
import {useAppStateContext, useCourseContext} from 'context';
import {AdminLayout} from 'layouts';
import React, {FormEvent} from 'react';
import { Spinner } from 'react-activity';
import { Button, Modal,Tab, Tabs } from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import Moment from 'react-moment';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {routes} from 'router/routes';
import authService from "services/auth.service"
import { removeCourseAssignment } from 'services/user.service';

interface Inputs {
    teacher?: any
}

interface Image {
    image?: File
}

const columns =[
    {
        Header: "Prénom",
        accessor: 'user.lastName',
    },
    {
        Header: "Nom",
        accessor: 'user.firstName',
    },
    {
        Header: "Email",
        accessor: 'user.email',
    },
    {
        Header: "Date d'entrée en Formation",
        type: "date",
        accessor: 'beginDate',
    },
    {
        Header: "Progression",
        accessor: 'progression',
        type: "date",
    }
]

const logsColumns =[
    {
        Header: "Prénom",
        accessor: 'userId.firstName',
    },
    {
        Header: "Nom",
        accessor: 'userId.lastName',
    },
    {
        Header: "Page Visitée",
        accessor: 'page_name',
    },
    {
        Header: "Module",
        accessor: 'moduleId.title',
    }
]

const AdminCourseDetails = () => {
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const authContext = useAuthContext()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const navigate = useNavigate();
    const params = useParams();
    const [users, setUsers] = React.useState<any>();
    const [nbModules, setNbModules] = React.useState(0);
    const [deleteSectionModal, setDeleteSectionModal] = React.useState(false)
    const [loadingDuplication, setLoadingDuplication] = React.useState(false)
    const [successDuplication, setSuccessDuplication] = React.useState(false)
    const [errorDuplication, setErrorDuplication] = React.useState(false)
    const [duplicationLoaded, setDuplicationLoaded] = React.useState(false)
    const [image, setImage] = React.useState<Image>();
    const [updateAssignmentLoading, setUpdateAssignmentLoading] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(false);
    const [imageUploaded, setImageUploaded] = React.useState(false);
    const [imageUploadError, setImageUploadError] = React.useState(false);
    const [assignments, setAssignments] = React.useState<IUserAssignment[] | []>([]);
    const [newAssignments, setNewAssignments] = React.useState<IUserAssignment[] | []>([]);
    const [courseDetails, setCourseDetails] = React.useState({title: "", description: "", category: "", image: "", teacher: ""})
    const [currentCourseDetails, setCurrentCourseDetails] = React.useState({title: "", description: "", category: "", image: "", teacher: ""});
    const [logsCourse, setLogsCourse] = React.useState<any>();
    const [correctionCourse, setCorrectionCourse] = React.useState<any>();
    const [createStudentMode, setStudentCreateMode] = React.useState(false);

    React.useEffect(() => {
        if (!params) return;
        courseContext.getCurrentCourse(params.id);
    }, [])

    React.useEffect(() => {
        if (!courseContext.currentCourse?.id) return;
        getUsers().then(response => {
            if (response) {
                setUsers(response.data)
            }
        });
        
        setAssignments(courseContext.currentCourse.assignments)
        setCourseDetails({
            title: courseContext.currentCourse.title,
            category: courseContext.currentCourse.category,
            image: courseContext.currentCourse.image,
            description: courseContext.currentCourse.description, 
            teacher: courseContext.currentCourse.teacher
        })

        setCurrentCourseDetails({
            title: courseContext.currentCourse.title,
            category: courseContext.currentCourse.category,
            description: courseContext.currentCourse.description,
            image: courseContext.currentCourse.image,
            teacher: courseContext.currentCourse.teacher
        })

        getLogsCourse(courseContext.currentCourse.id).then(response => {
            if (response) {
                const logs = [] as any
                response.data.map((item: any) => {
                    if(item.userId.role === 'emrys' || item.userId.role === 'user'){
                        logs.push(item)
                    }
                })

                setLogsCourse(logs)
            }
        })

        getCorrectionByCourse(courseContext.currentCourse.id).then(response => {
            if (response) {
                setCorrectionCourse(response.data)
            }
        })


        let forNbModules = 0
        for (let x = 0; x < courseContext.currentCourse.sections.length; x++){
            forNbModules = forNbModules + courseContext.currentCourse.sections[x].modules.length
        }
        setNbModules(forNbModules)

    }, [courseContext.currentCourse?.id])


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateCourse({
            courseId: courseContext.currentCourse.id,
            title: courseDetails.title,
            category: courseDetails.category,
            description: courseDetails.description
        })
            .then(response => {
                if (response && response.status === 200) {
                    setCurrentCourseDetails(response.data);
                    toast.success('Formation mise à jour !')
                }
            })
    }


    const addAssignment = (user: IUser, beginDate: Date) => {
        const userToAdd = {beginDate : beginDate, user: user}
        setAssignments([...assignments, userToAdd])
        setNewAssignments([...newAssignments, userToAdd])
    }


    const updateAssignment = async () => {
        setUpdateAssignmentLoading(true)
        const response = await updateCourseAssignments(courseContext.currentCourse.id, assignments)
        setUpdateAssignmentLoading(false)
        if (response && response.status === 200) {
            toast.success('Nouveaux Élèves Ajoutés !');
            setStudentCreateMode(false);
        }
    }

    const imageSubmit = handleSubmit(async (data) => {        
        if (image && image.image){
            setImageLoading(true)

            const dataForm = new FormData()
            dataForm.append('image', image.image)

            const user = authService.getCurrentUser()
            if (!user) return;

            try {
                    return await axios.post(`${process.env.REACT_APP_API_FILE_URL}/upload/image`, dataForm, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
                    }
                }).then ((res) => {
                    updateImageCourse({
                        courseId: courseContext.currentCourse.id,
                        imageUrl: res.data
                    }).then(response => {
                        if (response && response.status === 200) {
                            setCurrentCourseDetails(response.data);
                            toast.success('Image de Formation mise à jour !')
                        }
                    }).catch(error => {
                        console.log('error')
                    })
                    
                    setImageLoading(false)
                    setImageUploadError(false)
                    setImageUploaded(true)
                })
            } catch (e) {
                    setImageLoading(false)
                    setImageUploadError(true)
                    setImageUploaded(false)
                }
            }
    });

    const teacherUpdateSubmit = handleSubmit(async (data) => {
        updateTeacher({
            courseId: courseContext.currentCourse.id,
            teacher: data.teacher
        })
            .then(response => {
                if (response && response.status === 200) {
                    setCurrentCourseDetails(response.data);
                    toast.success('Formation mise à jour !')
                }
            })
    })

    const deleteCourseAssignation = async (data:any) => {
        if (data) {
            const deleteCourseAsss = await removeCourseAssignment(data.user.id, courseContext.currentCourse.id)
            if (deleteCourseAsss && deleteCourseAsss.status === 200) {   
                setAssignments(deleteCourseAsss.data.assignments)
                toast.success("Élève bien enlevé de cette formation !")
            }
        }
    }

    const deleteCourse = async () => {
        const deletingCourse = await removeCourse(courseContext.currentCourse.id)
        if (deletingCourse && deletingCourse.status === 200){
            navigate('/admin/courses')
            toast.success("Formation bien supprimée !")
        }
    }

    function handleSectionDeleteModal() {
        setDeleteSectionModal(!deleteSectionModal);
    }

    const duplicateCourse = async () => {
        setLoadingDuplication(true)
        const duplicateCourseReq = await duplicateCourseById(courseContext.currentCourse.id)

        if (duplicateCourseReq?.status === 200){
            setLoadingDuplication(false)          
            setErrorDuplication(false)  
            setSuccessDuplication(true)
            setDuplicationLoaded(true)
        } else {
            setLoadingDuplication(false)
            setErrorDuplication(true)
            setSuccessDuplication(false)
            setDuplicationLoaded(true)
        }
    }


    if (!courseContext.currentCourse) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )

    const queryParams = new URLSearchParams(window.location.search);

    const teachersNAdmin = []

    if (users) {
        for (let usersCount = 0; usersCount < Object.keys(users).length; usersCount++){
            if (users[usersCount].role === 'admin' || users[usersCount].role === 'teacher'){
                const userToPush = {
                    id : users[usersCount].id, 
                    name: `${users[usersCount].firstName} ${users[usersCount].lastName} - ${users[usersCount].role === 'teacher' ? 'Formateur' : 'Admin'}`
                }
                teachersNAdmin.push(userToPush)
            }
        }
    }

    for (let i = 0; i < assignments.length; i++){
        for (let z = 0; z < courseContext.currentCourse.responses.length; z++){
            if (assignments[i].user.id === courseContext.currentCourse.responses[z].userId){
                let nbValidated = 0
                for (let y = 0; y < courseContext.currentCourse.responses[z].modulesResponse.length; y++){
                    if (courseContext.currentCourse.responses[z].modulesResponse[y].validated == true){
                        nbValidated++
                    }
                }
                assignments[i].progression = ((nbValidated / nbModules) * 100 ).toFixed(0)
            }
        }
    }

    return (
        <AdminLayout>
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12 d-flex mb-2 d-flex-middle">
                        <div>
                            <h2 className="text-grey-900 font-md fw-700">{currentCourseDetails.title}</h2>
                            <h3 className="text-grey-900 font-xs fw-600"> <i className="feather-edit font-xss mr-3"></i>Espace de Modification</h3>
                        </div>
                        <a
                            href={routes.ADMINISTRATION_COURSES.path}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR
                        </a>
                    </div>
                </div>
            </div>

                <Tabs
                    defaultActiveKey={ queryParams.get('t') === "Interaction" ? "Interaction" : ( queryParams.get('t') === "Knowledge" ? "Informations" : ( queryParams.get('t') === "Eleves" ? "Eleves" : "Contenu"))}
                    id="uncontrolled-tab-example"
                    className="nav nav-tabs list-inline product-info-tab  profile"
                  >
                    <Tab eventKey="Informations" title="Informations">

                        <Tabs
                            defaultActiveKey={ queryParams.get('t') === "Knowledge" ? "Knowledge" : "Informations Générales"}
                            className="nav nav-tabs list-inline product-info-tab  profile mt-4"
                        >
                            <Tab eventKey="Informations Générales" title="Informations Générales">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card border-0 pt-3 px-4 mt-0 rounded-lg  admin-form">
                                            <div className="card-body d-block">
                                                <form
                                                    className="contact_form"
                                                    onSubmit={onSubmit}
                                                >
                                                    <div className='row'>
                                                        <div className="col-md-12">
                                                            <div className="form-group mb-1">
                                                                <label
                                                                    htmlFor="product_sku"
                                                                    className="form-label"
                                                                >
                                                                    Titre de la Formation
                                                                </label>
                                                                <input
                                                                    onChange={(e) => setCourseDetails({...courseDetails, title: e.target.value})}
                                                                    value={courseDetails.title}
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
                                                                    Catégorie de la Formation - (actuellement: {currentCourseDetails.category})
                                                                </label>
                                                                <select 
                                                                    value={courseDetails.category}
                                                                    onChange={(e) => setCourseDetails({...courseDetails, category: e.target.value})}
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
                                                                    value={courseDetails.description}
                                                                    onChange={(e) => setCourseDetails({...courseDetails, description: e.target.value})}
                                                                    className="form-control form_control"
                                                                    rows={5}
                                                                    placeholder="Description de la Formation *"
                                                                    required
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
                                                                <i className="feather-check mr-2"></i> Mettre à jour la Formation
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Image" title="Image">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                            <div className="card-body d-block"><div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group mb-1">
                                                        <form 
                                                            className="contact_form"
                                                            onSubmit={imageSubmit}
                                                        >
                                                            <div className='row mb-4'>
                                                                <div className="col-lg-12">
                                                                <label
                                                                htmlFor="product_sku"
                                                                className="form-label"
                                                                >
                                                                    Image de la Formation
                                                                </label>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <img style={{ maxWidth: '500px'}} src={For} />
                                                                </div>
                                                            </div>
                                                        
                                                            <label
                                                                htmlFor="product_sku"
                                                                className="form-label"
                                                            >
                                                                Modifier l'Image
                                                            </label>
                                                            <input 
                                                                onChange={(e:any) => setImage({image: e.target.files[0]})}
                                                                className='form-control form_control' 
                                                                type="file" 
                                                                required
                                                            />
                                                            {(!imageLoading && !imageUploaded && !imageUploadError) && (
                                                                <button
                                                                    type="submit"
                                                                    className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2 mb-4"
                                                                >
                                                                    <i className="feather-check mr-2"></i> Mettre à jour l'Image 
                                                                </button>
                                                            )}
                                                            {(imageLoading && !imageUploaded && !imageUploadError) && (
                                                                <div className='mt-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                                                                    <Spinner /> <p className='mb-0 ml-3'>Téléchargement en cours ... </p>
                                                                </div>
                                                            )}
                                                            {
                                                                (imageUploaded && !imageUploadError) && (
                                                                    <p className='text-success'> <i className="feather-check mr-2"></i> Votre Image a bien été modifié !</p>
                                                                )
                                                            }
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                                
                            </Tab>
                           
                            <Tab eventKey="Knowledge" title="Knowledge">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                            <div className="card-body d-block">
                                                <KnowledgeDetails />
                                            </div>
                                        </div>
                                    </div>
                                </div>             
                            </Tab>

                            <Tab eventKey="Tags" title="Tags">
                                <h2>
                                    SOON
                                </h2>
                            </Tab>

                            {authContext.authState.user.role === 'admin' && (
                            <Tab eventKey="Admin" title="Admin">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                            <div className="card-body d-block">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label
                                                        htmlFor="product_sku"
                                                        className="form-label"
                                                        >
                                                            Changer de Formateur :
                                                        </label>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="form-group mb-1">      
                                                            <form 
                                                                className="contact_form"
                                                                onSubmit={teacherUpdateSubmit}
                                                            >
                                                                <select 
                                                                    {...register("teacher", { required: true })}
                                                                    value={courseDetails.teacher}
                                                                    onChange={(e) => setCourseDetails({
                                                                        ...courseDetails,
                                                                        teacher: e.target.value
                                                                    })}
                                                                    className="form-control form_control"
                                                                >
                                                                    {
                                                                        teachersNAdmin.map((user: any, key: number) => {
                                                                            return (
                                                                                <option value={user.id} key={key}>
                                                                                    {user.name}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                                <button
                                                                    type="submit"
                                                                    className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2 mb-4"
                                                                >
                                                                    <i className="feather-check mr-2"></i> Mettre à jour le Formateur
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
        
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label
                                                        htmlFor="product_sku"
                                                        className="form-label"
                                                        >
                                                            Dupliquer la Formation :
                                                        </label>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="form-group mb-1">   
                                                            {loadingDuplication ? (
                                                                <button
                                                                    className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-white border-success font-xsss fw-600 ls-lg text-success mt-2 pb-2 mb-4"
                                                                >
                                                                    <Spinner /> Duplication en cours
                                                                </button>
                                                            ) : ( duplicationLoaded ? (
                                                                    successDuplication && !errorDuplication ? (
                                                                        <button
                                                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-white border-success font-xsss fw-600 ls-lg text-success mt-2 pb-2 mb-4"
                                                                        >
                                                                            <i className='feather feather-check mr-2'></i> Formation Dupliquée !
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-white border-danger font-xsss fw-600 ls-lg text-danger mt-2 pb-2 mb-4"
                                                                        >
                                                                            <i className='feather feather-x mr-2'></i> Une erreur est survenue ...
                                                                        </button>
                                                                    )                                                                   
                                                            ) : (
                                                                <button
                                                                    onClick={() => duplicateCourse()}
                                                                    className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-white border-success font-xsss fw-600 ls-lg text-success mt-2 pb-2 mb-4"
                                                                >
                                                                    <i className="feather-copy mr-2"></i> Dupliquer cette Formation
                                                                </button>
                                                            )
                                                            )}     
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label
                                                        htmlFor="product_sku"
                                                        className="form-label"
                                                        >
                                                            Supprimer la Formation :
                                                        </label>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="form-group mb-1">        
                                                            <button
                                                                onClick={() => handleSectionDeleteModal()}
                                                                className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-danger font-xsss fw-600 ls-lg text-white mt-2 pb-2 mb-4"
                                                            >
                                                                <i className="feather-x mr-2"></i> Supprimer cette Formation
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Modal
                                                    size="lg"
                                                    aria-labelledby="contained-modal-title-vcenter"
                                                    centered
                                                    show={deleteSectionModal}
                                                >
                                                    <Modal.Body className="text-center p-5">
                                                        <i className="ti-info-alt text-danger display4-size"></i>
                                                        <p className="text-grey-800 font-xsss mt-3 mb-4">
                                                            Êtes-vous sûr de vouloir supprimer cette Formation ? <br/>
                                                            Cette action est irréversible !
                                                        </p>

                                                        <Button
                                                            onClick={() => deleteCourse()}
                                                            className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-white bg-danger font-xssss text-uppercase fw-600 ls-3 mr-4"
                                                        >
                                                            Oui, Supprimer !
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleSectionDeleteModal()}
                                                            className="border-0 btn rounded-6 lh-2 p-3 mt-0 mb-2 text-grey-600 bg-greylight font-xssss text-uppercase fw-600 ls-3 ms-1 ml-4"
                                                        >
                                                            Non, Annuler !
                                                        </Button>
                                                    </Modal.Body>
                                                </Modal>
                                            </div>
                                        </div>
                                    </div>
                                </div>             
                            </Tab>
                            )}
                             <Tab eventKey="Commentaire" title="Commentaire">
                            <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card border-0 pt-2 px-3 mt-0 rounded-lg admin-form">
                                            <div className="card-body d-block">
                                                <CommentaireDetails />
                                            </div>
                                        </div>
                                    </div>
                                </div>           
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey="Contenu" title="Contenu">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                    <div className="card-body d-block">
                                        <AdminSideBar/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Eleves" title="Élèves">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                    <div className="card-body d-block">
                                        {!createStudentMode && (
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <button
                                                        onClick={() => setStudentCreateMode(true)}
                                                        className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-0 pb-2"
                                                    >
                                                        <i className="feather-plus mr-2"></i> Ajouter un Nouvel Élève
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {createStudentMode && (
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <button
                                                        onClick={() => setStudentCreateMode(false)}
                                                        className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-0 pb-2"
                                                    >
                                                        <i className="feather-chevron-left mr-2"></i> Retour
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <hr className="solid mt-4 mb-4"></hr>

                                        {createStudentMode && (
                                            <div className='row'>
                                                <div className="col-lg-12">
                                                    <h2 className="text-grey-900 font-md fw-600">Ajouter de Nouveaux Élèves à Votre Formation</h2>
                                                    <div className="card border-0 mt-0 rounded-lg admin-form">
                                                        <div className="card-body d-block">
                                                            {
                                                                users && <AutoSuggestInput 
                                                                            values={users}
                                                                            valuesToFilter={assignments} 
                                                                            onSelect={addAssignment}
                                                                        />
                                                            }
                                                            {
                                                                newAssignments.length > 0 && (
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <label
                                                                                htmlFor="product_sku"
                                                                                className="form-label"
                                                                            >
                                                                                Les Étudiants que vous allez ajouter :
                                                                            </label>
                                                                        </div>
                                                                            <div className="col-lg-12">
                                                                                {
                                                                                    newAssignments.map((user: any, key: number) => {
                                                                                        return (
                                                                                            <span key={key} style={{ textTransform: 'capitalize' }}>
                                                                                                {user.user.firstName + " " + user.user.lastName} - <Moment format='DD/MM/YYYY'>{user.beginDate}</Moment><br/>
                                                                                            </span> 
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                    </div>
                                                                )
                                                            }
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    {updateAssignmentLoading ? (
                                                                        <Spinner className='mt-2'/>
                                                                    ) : (
                                                                        <button
                                                                            onClick={updateAssignment}
                                                                            className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                                                                        >
                                                                            <i className="feather-check mr-2"></i> Ajouter les Nouveaux Élèves
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {!createStudentMode && (
                                            <TableCard columns={columns} data={assignments.length > 0 ? assignments : []} onlyDeleteAction={deleteCourseAssignation} nbModules={nbModules} courseId={courseContext.currentCourse.id}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Interaction" title="Interaction">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                    <div className="card-body d-block">
                                        <InteractionCard />   
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Corrections" title="Corrections">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                    <div className="card-body d-block">
                                        {(correctionCourse && correctionCourse.length > 0) && (
                                            correctionCourse.map((correction: any, key:number) => {
                                                return(  
                                                    <div className='col-md-12'>
                                                        {(correction.moduleId !== null && key === 0) && (
                                                            <h2 className="fw-500 font-sm d-block lh-4 mb-3 custom-pr-220">
                                                                <strong>Module: </strong>{correction.moduleId.title}
                                                            </h2>
                                                        )}
                                                        {((correction.moduleId !== null && key > 0) && (correction.moduleId.id !== (correctionCourse[key-1].moduleId !== null ? correctionCourse[key-1].moduleId.id : '121'))) && (
                                                            <h2 className="fw-500 font-sm d-block lh-4 mb-3 mt-4 custom-pr-220">
                                                                <strong>Module: </strong>{correction.moduleId.title}
                                                            </h2>
                                                        )}
                                                        {correction.moduleId === null && (
                                                            <h2 className="fw-500 font-sm d-block lh-4 mb-3 mt-4 custom-pr-220">
                                                                <strong>Module: <i className='feather feather-x ml-2 text-danger'></i> Supprimé</strong>
                                                            </h2>
                                                        )}
                                                        <div className='mb-3'>
                                                            <h3 className='mb-0'>
                                                                {correction.userId.firstName} {correction.userId.lastName} - <Moment format='DD MMMM à HH:mm'>{correction.uploadAt}</Moment>
                                                            </h3>
                                                            {correction.filePath.startsWith('http') ? (
                                                                <a className='mr-2' href={correction.filePath} target="_blank">
                                                                    <i className='feather feather-file mr-2'></i>
                                                                    Son Rendu 
                                                                </a>
                                                            ) : (
                                                                <>
                                                                    <a className='mr-2' href={`https://${correction.filePath}`} target="_blank">
                                                                        <i className='feather feather-file mr-2'></i>
                                                                        Son Rendu 
                                                                    </a>
                                                                    <span className='text-warning'>
                                                                        <i className='feather feather-x'></i> Attention ce lien semble être incorrect
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                        {(correctionCourse && correctionCourse.length == 0) && (
                                            <p>
                                                Il n'y a pas encore eu de fichiers envoyé par vos élèves <br />
                                                Ajoutez un Module de Correction pour recevoir des fichiers ici 
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Stats - SOON" title="Stats - SOON">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                    <AdminStats />
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Logs" title="Logs">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card border-0 pt-3 px-4 mt-0 rounded-lg admin-form">
                                    <div className="card-body d-block">
                                        {logsCourse && (
                                            <Table columns={logsColumns} data={logsCourse.length > 0 ? logsCourse : []} noActions/>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
            </Tabs>
        </AdminLayout>
    );
};

export default AdminCourseDetails;

