import user from '../assets/images/user2.jpg'

import { useAuthContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { useEffect,useState } from 'react';
import { Bounce, Spinner } from 'react-activity';
import Moment from 'react-moment';
import { useNavigate,useParams } from "react-router-dom";
import {getInteractionWab,getOneCourseDetailInteraction, getSuitInteractionWab, getSuitInteractionWabAfterPersonalizedMessage, postUserResponseInteraction} from "services/course.service"
import { createLog } from "services/user.service";

const Interactions = () => {
    const authContext = useAuthContext();
    const params = useParams();
    const navigate = useNavigate();

    const [currentCourseId, setCurrentCourseId] = React.useState<any>();
    const [courseDetail, setCourseDetail] = React.useState<any>();
    const [messagesToDisplay, setMessagesToDisplay] = React.useState<any>();
    const [loadingAfterChoiceClicked, setLoadingAfterChoiceClicked] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [moreChecked, setMoreChecked] = React.useState(false);
    

    React.useEffect(() => {
        if (!params) return;
        getInteractionData()

            // createLog(params, 'interaction')            
    }, [])


    const getMessagesInteraction = async () => {
        if(params.courseId) {
            getInteractionWab(params.courseId, authContext.authState.user.id).then(response => {
                setMessagesToDisplay(response?.data)

                if (response?.data[response?.data.length-1].nodeType === 'MessagePersonnalizedTag' && response?.data[response?.data.length-1].message === 'MESSAGE_PERSONNALIZED_CHECK_1256'){
                    if (!params.courseId) return;
                    getSuitInteractionWabAfterPersonalizedMessage(response?.data[response?.data.length - 1], params.courseId, authContext.authState.user.id, response?.data[response?.data.length - 1].interractionId).then(response => {
                        if (response?.status === 200) {
                            if (!params.courseId) return;
                            getInteractionWab(params.courseId, authContext.authState.user.id).then(response => {
                                setMessagesToDisplay(response?.data)
                            })
                        }
                    })
                }

                if(response?.data[response?.data.length-1].nodeType === 'TagsConditionBegin' || (response?.data[response?.data.length-1].nodeType === 'MessagePersonnalizedTag' && response?.data[response?.data.length-1].message !== 'MESSAGE_PERSONNALIZED_CHECK_1256')){
                    if (!params.courseId) return;
                    getSuitInteractionWab(response?.data[response?.data.length - 1], params.courseId, authContext.authState.user.id, response?.data[response?.data.length - 1].interractionId).then(response => {
                        if (response?.status === 200) {
                            if (!params.courseId) return;
                            getInteractionWab(params.courseId, authContext.authState.user.id).then(response => {
                                setMessagesToDisplay(response?.data)
                            })
                        }
                    })
                } 
            })
        }
    }

    const getInteractionData = async () => {
        await setCurrentCourseId(params.courseId)
        if (params.courseId){
            await getOneCourseDetailInteraction(params.courseId).then(response => {
                if (response) {
                    setCourseDetail(response.data);
                }
            });
        }
        getMessagesInteraction()
        setLoaded(true)
    }

    if (loaded && (params.courseId !== currentCourseId)){
        setLoaded(false)
        getInteractionData()
    }

    async function getMoreMessages() {
        if (!params.courseId) return;
    }

    if (!moreChecked && messagesToDisplay && messagesToDisplay.length > 0 && messagesToDisplay[messagesToDisplay.length - 1].nodeType === 'TagsConditionBegin') {
        // getMoreMessages()
        setMoreChecked(true)      
    }



    const responseClickedByUser = async (data:any) => {
        // Il faudra passer la limit ici aussi pour retourner avec +/- les bons messages
        if (params.courseId) {
            setLoadingAfterChoiceClicked(true)
            postUserResponseInteraction(data, params.courseId, authContext.authState.user.id, messagesToDisplay[messagesToDisplay.length - 2].interractionId).then(response => {
                if (response?.status === 200) {
                    getInteractionData()
                    setLoadingAfterChoiceClicked(false)
                }
            })
        }
    }


    if (!loaded) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )


    return (
        <AdminLayout>
            <div className='row'>
                <div className='col-md-12 mb-2'>
                    <h2 className="fw-700 font-md d-block lh-4 mb-0 custom-pr-220">
                        Espace Intéractions
                    </h2>
                    <span className="font-xssss fw-600 text-grey-500 d-inline-block">
                        Avec {courseDetail.teacher.firstName} {courseDetail.teacher.lastName}, de la Formation {courseDetail.title}
                    </span>
                </div>

                <div className='col-md-12'>

                    <div className="card w-100 vh100 d-block chat-body p-0 border-0 shadow-xss rounded-3 mb-3 position-relative">
                        <div className="messages-content chat-wrapper scroll-bar p-3">

                            {!loadingAfterChoiceClicked && (
                                messagesToDisplay && messagesToDisplay[messagesToDisplay.length - 1].length && (
                                <>
                                
                                <div className='responsesUserDisplay message-item outgoing-message'>
                                    {messagesToDisplay[messagesToDisplay.length - 1].map((response:any, key: number) => {
                                        return (
                                            <button 
                                                onClick={() => responseClickedByUser(response)}
                                                className='p-1 pr-3 pl-3 border border-primary bg-primary rounded-xl ml-2 font-xsss text-white'
                                            >
                                                {response.data.label}
                                            </button>
                                        )
                                    })}
                                </div>

                                <p className='font-xsss message-item outgoing-message mr-2 mb-2'>
                                    Faites votre choix :
                                </p>
                                </>
                            ))}


                            {loadingAfterChoiceClicked && (
                                <div className='mt-2 ml-2'>
                                    <Bounce />
                                </div>
                            )}
                            
                            
                            
                            {
                            messagesToDisplay && messagesToDisplay.slice(0).reverse().map((message:any, key: number) => { 
                                if (!message.length) {
                                    if (message.nodeType === 'TagsConditionBegin' || message.nodeType === 'TagCondition' || (message.nodeType === 'MessagePersonnalizedTag' && message.message === 'MESSAGE_PERSONNALIZED_CHECK_1256')) {
                                        return ( <></> )
                                    }
                                    
                                    return (
                                        <>
                                            { message.nodeType === 'AnswerType' ? (
                                                <div className="message-item outgoing-message">
                                                    <div className="message-user">
                                                        <div>
                                                            <h5>
                                                                <span className="time mr-3">
                                                                    <Moment format='ddd DD MMMM à HH:mm'>{message.serverDate}</Moment> 
                                                                </span>
                                                                Vous
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="message-wrap">
                                                        {message.message} 
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="message-item">
                                                    <div className="message-user">
                                                        <div>
                                                            <h5>
                                                                {courseDetail.teacher.firstName} {courseDetail.teacher.lastName} 
                                                                <span className="time ml-3">
                                                                    <Moment format='ddd DD MMMM à HH:mm'>{message.serverDate}</Moment> 
                                                                </span>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="message-wrap">
                                                        {message.message}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )
                                }
                            })
                        }



                            {(!messagesToDisplay) && (
                                <p> Aucun message pour le moment (design en cours...)</p>
                            )}

                            
                            

                        </div>
                      </div>
                      
                      <p> 
                                Mettre en place l'infinite loader avec la gestion du limit qui s'incrémente
                            </p> 

                </div>
            </div>
        </AdminLayout>
    );
};

export default Interactions;