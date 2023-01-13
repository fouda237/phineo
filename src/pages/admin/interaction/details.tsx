
import {Button} from "../../../components";
import {createInteraction, getInteraction, getTagsCourse, updateInteraction} from "../../../services/course.service";

import Flow from "components/Flow/FlowDnd"
import {AdminLayout} from 'layouts';
import React from 'react';
import { Spinner } from "react-activity";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const InteractionDetails = () => {
    const [nodes, setNodes] = React.useState([]);
    const [edges, setEdges] = React.useState([]);
    const [hourOfTheDay, setHourOfTheDay] = React.useState(0);
    const [minuteOfTheDay, setMinuteOfTheDay] = React.useState(0);
    const [daysAfter, setDaysAfter] = React.useState(0);
    const [title, setTitle] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const [tagsCourse, setTagsCourse] = React.useState<any>()

    function getAllCourseTags(courseId: any) {
        if (!params.courseId) return

        getTagsCourse(params.courseId).then(response => {
            if (response && response.status === 200){
                setTagsCourse(response.data)
            }

            if (response && response.status > 400){
                setTagsCourse('')
            }
        })
    }


    React.useEffect(() => {
        if (params.interactionId && params.courseId) {
            getInteraction(params.courseId, params.interactionId).then(response => {
                console.log("INTERACTION DETAIL ====", response);
                if (response) {
                    setNodes(response.data.content.nodes);
                    setEdges(response.data.content.edges);
                    setHourOfTheDay(response.data.hourOfTheDay);
                    setMinuteOfTheDay(response.data.minuteOfTheDay);
                    setTitle(response.data.title);
                    setDaysAfter(response.data.daysAfter);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })

            getAllCourseTags(params.courseId) 
        } else {
            getAllCourseTags(params.courseId) 
            setLoading(false);
        }


    }, [params])

    const updateNodesFromReactFlow = (newNodes: any, newEdges: any) => {
        setNodes(newNodes);
        setEdges(newEdges)
    }


    const saveInteraction = async () => {
        if (!params.courseId) return;
        const response = await createInteraction({courseId: params.courseId, daysAfter, hourOfTheDay, minuteOfTheDay, title, nodes, edges})
        if (response && response.status === 201) {
            if (response.data.id) {
                toast.success('Interaction Créée !');
                window.location.reload()
            } else {
                window.location.reload()
            }
        } else {
            toast.error('Une erreur est survenue');
        }
    }

    const editInteraction = async () => {
        if (!params.courseId || !params.interactionId) return;
        const response = await updateInteraction({courseId: params.courseId, interactionId: params.interactionId, daysAfter, hourOfTheDay, minuteOfTheDay, title,  nodes, edges})
        if (response && response.status === 200) {
            toast.success('Interaction Mise à Jour !');
        } else {
            toast.error('Une erreur est survenue');
        }
    }


    const saveBackInteraction = async () => {
        if (!params.courseId) return;
        const response = await createInteraction({courseId: params.courseId, daysAfter, hourOfTheDay, minuteOfTheDay, title, nodes, edges})
        if (response && response.status === 201) {
            toast.success('Interaction créé');
            if (response.data.id) {
                navigate(`/admin/course/${params.courseId}?t=Interaction`)
            } else {
                navigate(`/admin/course/${params.courseId}?t=Interaction`)
            }
        } else {
            toast.error('Une erreur est survenue');
        }
    }

    const editBackInteraction = async () => {
        if (!params.courseId || !params.interactionId) return;
        const response = await updateInteraction({courseId: params.courseId, interactionId: params.interactionId, daysAfter, hourOfTheDay, minuteOfTheDay, title, nodes, edges})
        if (response && response.status === 200) {
            toast.success('Interaction mise à jour');
            navigate(`/admin/course/${params.courseId}?t=Interaction`)
        } else {
            toast.error('Une erreur est survenue');
            navigate(`/admin/course/${params.courseId}?t=Interaction`)
        }
    }

    const goBack = () => {
        if (!params.courseId) return;
        navigate(`/admin/course/${params.courseId}?t=Interaction`)
    }

    console.log('tagsCourse : ', tagsCourse)


    if (loading || tagsCourse === undefined) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )

    return (
        <AdminLayout>
                <div className="row">
                    <div className="col-lg-12 d-flex mb-2 d-flex-middle">
                        <div>
                            <h2 className="text-grey-900 font-md fw-700">Interaction</h2>
                            <h3 className="text-grey-900 font-xs fw-600"> <i className="feather-edit font-xss mr-2"></i>Espace de {params.interactionId ? 'Modification' : 'Création '}</h3>
                        </div>
                        <a
                            href={`/admin/course/${params.courseId}?t=Interaction`}
                            className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-600 ls-lg text-white"
                        >
                            <i className="feather-chevron-left mr-0"></i> RETOUR
                        </a>
                    </div>
                </div>

                <div className="row">
                    {
                        (loading || tagsCourse === undefined) ? <Spinner /> :
                        <Flow 
                            updateNodes={updateNodesFromReactFlow} 
                            currentNodes={nodes} 
                            currentEdges={edges}
                            setTagsCourse={setTagsCourse}
                            tagsCourse={tagsCourse}
                            getAllCourseTags={getAllCourseTags}
                        />
                    }

                </div>

                <div className="row mt-4">
                    <div className="col-md-5">

                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="text-grey-900 font-xs fw-600"> Informations du Module</h3>
                                <div className="form-group mb-1">
                                    <label
                                        htmlFor="product_sku"
                                        className="form-label"
                                    >
                                        Titre du Module d'Intéraction<br /><span className="font-xssss">(Uniquement pour votre Gestion)</span>
                                    </label>
                                    <input
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                        className="form-control form_control"
                                        type="text"
                                        placeholder="Titre du Module"
                                        required
                                    />
                            </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <div className="row">
                        <div className="col-md-12">
                            <h3 className="text-grey-900 font-xs fw-600"> Paramètres de Déclenchement</h3>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-1">
                                    <label
                                        htmlFor="product_sku"
                                        className="form-label"
                                    >
                                        Déclenchement à J+ <br /><span className="font-xssss">(Après Début de Formation)</span>
                                    </label>
                                    <input
                                        onChange={(e) => setDaysAfter(parseInt(e.target.value))}
                                        value={daysAfter}
                                        className="form-control form_control"
                                        type="number"
                                        placeholder="J+3"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-1">
                                    <label
                                        htmlFor="product_sku"
                                        className="form-label mb-0"
                                    >
                                        Heure de Déclenchement
                                    </label>
                                    <div className="row">
                                        <div className="col-md-4 pr-0">
                                            <label className="font-xssss">Heures :</label>
                                            <input
                                                onChange={(e) => setHourOfTheDay(parseInt(e.target.value))}
                                                value={hourOfTheDay}
                                                className="form-control form_control"
                                                type="number"
                                                placeholder="10"
                                                min={5} max={23}
                                                required
                                            /> 
                                        </div>
                                        <div className="col-md-4 pl-0">
                                            <label className="font-xssss">Minutes :</label>
                                            <input
                                                onChange={(e) => setMinuteOfTheDay(parseInt(e.target.value))}
                                                value={minuteOfTheDay}
                                                className="form-control form_control"
                                                type="number"
                                                placeholder="00"
                                                min={0} max={59}
                                                required
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    

                </div>



                <Button label={params.interactionId ? "Enregistrer" : "Créer l'Intéraction"} action={params.interactionId ? editInteraction : saveInteraction}/>
                <button
                    className="btn p-3 ml-4 lh-24 ls-3 pr-5 pl-5 d-inline-block border-primary rounded-xl bg-white font-xsss fw-600 ls-lg text-primary mt-3 pb-2"
                    onClick={params.interactionId ? editBackInteraction : saveBackInteraction}
                >
                    {params.interactionId ? "Enregistrer puis Retour au Sommaire" : "Créer cette Intéraction puis Retour au Sommaire"}
                </button>

        </AdminLayout>
    );
};

export default InteractionDetails;
