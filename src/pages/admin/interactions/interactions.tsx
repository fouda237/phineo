import Icon from "../../../assets/images/courses.png";
import IconDelete from "../../../assets/images/deleteBlack.png";
import { Button } from "../../../components";
import { useCourseContext } from "../../../context";

import clsx from 'clsx';
import { AdminLayout } from 'layouts';
import React from 'react';
import { Spinner } from "react-activity";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { deleteInteraction,getInteractions } from 'services/course.service';
import { ICreateInteraction } from 'types/course.types';

const InteractionCard = ({ id, days, hour, minute, title }: { id: string, days: string, hour: string, minute:string, title: string }) => {
    const navigate = useNavigate()
    const courseContext = useCourseContext();
    const params = useParams();

    return (
        <div
            className="col-md-3 same-height"
            key={id}
        >
            <div className="card p-2 shadow-lg border-0 rounded-lg mb-4 course-card w-100">
                <div className="card-body text-center">
                        <h2 className="text-grey-900 font-sm fw-500 mb-2">
                            {title !== 'undefined' ? title : 'PAS DE TITRE'}
                        </h2>
                        <h2 className="text-grey-800 font-xss fw-400 mb-3">
                            J+{days} à {hour}h{(parseInt(minute) < 10) && '0'}{minute}
                        </h2>


                        <button
                            className="bg-white border-0"
                            onClick={() => navigate(`/admin/course/${params.id}/interaction/${id}`)}
                        >
                            <i className="feather-edit me-1 font-xs text-grey-500 mr-2 ml-2"></i>
                        </button>
                        <button 
                            className="bg-white border-0"
                            onClick={() => {
                                if (!params.id) {
                                    toast.error('Une erreur est survenue, veuillez réessayer');
                                    return
                                }
                                deleteInteraction(params.id, id).then((response) => {
                                    console.log(response)
                                    if (response && response.status === 204) {
                                        toast.success('Interaction supprimée');
                                            window.location.reload()
                                    } else {
                                        toast.error('Une erreur est survenue, veuillez réessayer');
                                    }
                                }).catch(err => {
                                    console.log(err)
                                    toast.error('Une erreur est survenue, veuillez réessayer');
                                })
                            }}>
                            <i className="ti-trash font-xs text-danger mr-2 ml-2"></i>
                        </button>
                    </div>
                </div>
        </div>
    )
}

const AdminInteractions = () => {

    const params = useParams();
    const navigate = useNavigate();
    const [interactions, setInteractions] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (params.id) {
            getInteractions(params.id).then(response => {
                if (response) {
                    const mapArray = response.data.sort((a: ICreateInteraction, b: ICreateInteraction) => (a.daysAfter > b.daysAfter) ? 1 : (a.daysAfter < b.daysAfter) ? -1 : 0)
                    // const mapArray = response.data.sort((a: ICreateInteraction, b: ICreateInteraction) => {
                    //     console.log(a.daysAfter.toString().localeCompare(b.daysAfter.toString()))
                    //     return a.daysAfter.toString().localeCompare(b.daysAfter.toString()) ? 1 : (b.hourOfTheDay > a.hourOfTheDay) ? -1 : 0
                    // });
                    setInteractions(mapArray)
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
        } else {
            setLoading(false);
        }
    }, [params])

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <button
                        onClick={() => navigate(`/admin/course/${params.id}/interaction`)}
                        className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                    >
                        <i className="feather-plus mr-2"></i> Créer une Intéraction
                    </button>
                    <hr className="solid mt-4 mb-5"></hr>
                </div>
            </div>


            <div className="row">
                { loading ? (
                    <Spinner />
                ) : (
                    interactions && interactions.length > 0 ?
                        interactions.map((card: { id: string, daysAfter: number, hourOfTheDay: number, minuteOfTheDay: number, title?:string }, key: number) => {
                            return (
                                <>
                                    {key > 0 && (card.daysAfter !== interactions[key-1].daysAfter ? (
                                        <div className="col-md-12"> 
                                            <hr className="solid mt-4 mb-4"></hr>
                                            <h2 className="fw-600 font-sm d-block lh-4 mb-4 custom-pr-220">
                                                {card.daysAfter === 0 ? (
                                                <>
                                                    Jour d'Entrée en Formation
                                                </>
                                                ) : (
                                                    card.daysAfter < 0 ? (
                                                        <>
                                                            J{card.daysAfter}
                                                        </>
                                                    ) : (
                                                        <>
                                                            J+{card.daysAfter}
                                                        </>
                                                    )
                                                )}                                                 
                                                <button
                                                    onClick={() => navigate(`/admin/course/${params.id}/interaction`)}
                                                    className="p-0 btn p-2 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xssss fw-600 ls-lg text-white ml-4"
                                                >
                                                    <i className="feather-plus mr-2"></i> Créer une Intéraction
                                                </button>
                                            </h2>
                                        </div>
                                    ) : '')}
                                    
                                    {key === 0 ? (
                                        <div className="col-md-12"> 
                                            <h2 className="fw-600 font-sm d-block lh-4 mb-4 custom-pr-220">
                                                {card.daysAfter === 0 ? (
                                                    <>
                                                        Jour d'Entrée en Formation
                                                    </>
                                                    ) : (
                                                        card.daysAfter < 0 ? (
                                                            <>
                                                                J{card.daysAfter}
                                                            </>
                                                        ) : (
                                                            <>
                                                                J+{card.daysAfter}
                                                            </>
                                                        )
                                                    )}                                                       
                                                    <button
                                                        onClick={() => navigate(`/admin/course/${params.id}/interaction`)}
                                                        className="p-0 btn p-2 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xssss fw-600 ls-lg text-white ml-4"
                                                    >
                                                        <i className="feather-plus mr-2"></i> Créer une Intéraction
                                                    </button> 
                                            </h2>
                                        </div>
                                    ) : ''}
                                    <InteractionCard id={card.id} days={"" + card.daysAfter} hour={"" + card.hourOfTheDay}  minute={"" + card.minuteOfTheDay} title={"" + card.title} />
                                </>
                            )
                        })
                        :
                        <p className="text-black leading-none">Il est temps de créer votre 1ère Intéraction !</p>
                )}
            </div>

        
        </>
    );
};

export default AdminInteractions;
