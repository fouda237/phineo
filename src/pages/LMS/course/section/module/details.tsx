import { wait } from '@testing-library/user-event/dist/utils';
import axios from "axios";
import { useAuthContext,useCourseContext} from 'context';
import {AdminLayout} from 'layouts';
import React, {FormEvent} from 'react';
import { Spinner } from 'react-activity';
import { Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ReactPlayer from 'react-player';
import Quiz from 'react-quiz-component';
import { useNavigate, useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import ReactTooltip from "react-tooltip";
import authService from "services/auth.service"
import {createcomment,getcommentVal,createreponse, getModuleDetails, getSpecificLastCorrection,postUserCorrection} from "services/course.service";
import {createResponseModule, updateResponseModule} from 'services/response.service'
import {createLog, createStayLog} from "services/user.service";
import {useState} from 'react';
import Moment from 'react-moment';
import { FaPaperPlane } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import { FontAwesome } from '@fortawesome/react-fontawesome'

interface Inputs {
    filePath: string,
}


const DisplayModulePage = () => {
    const courseContext = useCourseContext();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const authContext = useAuthContext()
    const [responseExist, setResponseExist] = React.useState(false);
    const [isValidated, setIsValidated] = React.useState(false);
    const [canValidate, setCanValidate] = React.useState(true);
    const [tabActive, setTabActive] = React.useState(true);
    const [filterValidationLoaded, setFilterValidationLoaded] = React.useState(false);
    const [responseIsLoaded, setResponseIsLoaded] = React.useState(false);
    const [actualSection, setActualSection] = React.useState<any>();
    const [duration, setDurationVideo] = React.useState(0)
    const [fileUploaded, setFileUploaded] = React.useState(false);
    const [fileUploadError, setFileUploadError] = React.useState(false);
    const [fileLoading, setFileLoading] = React.useState(false);
    const [lastCorrection, setLastCorrection] = React.useState<any>([])
    const [moduleDetails, setModuleDetails] = React.useState({
        id:"",
        title: "",
        description: "",
        type:"",
        filePath: "",
        content: "",
  
        quizContent: {
          questions: "",

        },
        conditions: {
          type: "",
          conditionValue: ""
        },
        accessConditions: {
          type: "",
          conditionValue: ""
        },
        comments:[]
    })
  const [commentairess, setComment] =useState("");
  const [commentValided, setValiderComment] =React.useState<any>({
     comment:"",
  })
  const [reponsesss, setreponse] =useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const params = useParams();
    let actualSectionIndex;
    let actualModuleIndex;
    let nextModuleId;
    let nextModuleAccessible;
    let nextModuleName;
    let b;
    // let data=Date();
    // 45 secondes
    const MINUTE_MS = 45000;
    React.useEffect(() => {
     
      getcommentVal(`${params.moduleId}`).then(response => {
          if (response) {
            setValiderComment({...response.data})
          //  alert(JSON.stringify(commentVal))

          }})
      
      })
    React.useEffect(() => {
        if (!params) return;
        
        courseContext.getCurrentCourseWab(params.courseId);
        getModuleDetails(`${params.moduleId}`).then(response => {
            if (response) {
                setModuleDetails({...response.data})
               
            }
        })

        createLog(params, 'module')

        if (params && params.courseId && params.moduleId){
          getSpecificLastCorrection(
            authContext.authState.user.id,
            params.courseId, 
            params.moduleId, 
          ).then(response => {
            if (response) {
              setLastCorrection({...response.data})
            }
          })
        }
        
        const interval = setInterval(() => {
          if (tabActive === true){
            createStayLog(params.courseId, params.moduleId, 'module')
          }
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.

    }, [params])
    
    const validat: any[] = [];
      moduleDetails.comments.map((cmmnt:any,key:number)=>{
        if(cmmnt.validated=="true"){
          validat.push(cmmnt);
        }
        
      })
    // console.log(JSON.stringify(validat));
    // alert(JSON.stringify(validat));
      
    if (!courseContext.currentCourse) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )

    if ((
        courseContext.currentCourse.id === '627bec5777fb3126e504d199'
        || courseContext.currentCourse.id === '627cef43454b0c003e41bdcc'
        || courseContext.currentCourse.id === '627bec5777fb3126e504d199'
        || courseContext.currentCourse.id === '627bec7077fb31f81404d1a7'
        || courseContext.currentCourse.id === '627bec9a8f6df33efde535aa'
        || courseContext.currentCourse.id === '627becae8f6df33b30e535b1'
        || courseContext.currentCourse.id === '627becc28f6df3f02de535bd'
        || courseContext.currentCourse.id === '627becdd77fb31415804d1c7'
        || courseContext.currentCourse.id === '627becee77fb31c15804d1ce'
        || courseContext.currentCourse.id === '627bed038f6df32dd0e535cf'
      ) && !filterValidationLoaded){
      setCanValidate(false)
      setFilterValidationLoaded(true)
    }

    window.addEventListener('focus', function (event) {
        setTabActive(true)
    });
    
    window.addEventListener('blur', function (event) {
        setTabActive(false)
    });
    
    const date = Date.now()
    const beginDate = Math.floor(new Date(courseContext.currentCourse.assignments[0].beginDate).getTime())

    if (beginDate > date) {
        navigate(`/formations`);
    }

    if(courseContext.currentCourse && moduleDetails){
      if(moduleDetails.accessConditions.type === "validModule"){
        let isValida = false
        for (let i = 0; i < courseContext.currentCourse.responses[0].modulesResponse.length; i++){
          if (courseContext.currentCourse.responses[0].modulesResponse[i].moduleId === moduleDetails.accessConditions.conditionValue){
            if (courseContext.currentCourse.responses[0].modulesResponse[i].validated === true){
              isValida = true
            }
          }
        }

        if (isValida === false){
          navigate(`/formations/${courseContext.currentCourse.id}`);
        }
      }
    }

    if (courseContext.currentCourse && !actualSectionIndex && !actualModuleIndex){
      for (let s=0; s < courseContext.currentCourse.sections.length; s++){
        for (let m=0; m < courseContext.currentCourse.sections[s].modules.length; m++){
          if (courseContext.currentCourse.sections[s].modules[m].id === moduleDetails.id){
            actualSectionIndex = s;
            actualModuleIndex = m;
          }
        }
      }
    }

    if(actualSectionIndex !== undefined && !actualSection){
      setActualSection(courseContext.currentCourse.sections[actualSectionIndex])
    }
    
    if(actualModuleIndex !== undefined && actualSectionIndex!== undefined && !nextModuleId && !nextModuleName){
      if (!courseContext.currentCourse.sections[actualSectionIndex].modules[actualModuleIndex+1]){
        if (!courseContext.currentCourse.sections[actualSectionIndex+1]) {
          nextModuleId = 'END'
          nextModuleName = 'Vous êtes arrivé à la fin de la formation !'
        } else if (!courseContext.currentCourse.sections[actualSectionIndex+1].modules[0]) {
          nextModuleId = 'END2'
          nextModuleName = ''
        } else {
          nextModuleId = courseContext.currentCourse.sections[actualSectionIndex+1].modules[0].id
          nextModuleName = ('Prochaine Section : ' + courseContext.currentCourse.sections[actualSectionIndex+1].modules[0].title)

          if(courseContext.currentCourse.sections[actualSectionIndex+1].modules[0].accessConditions.type === "validModule"){
            for (let z = 0; z < courseContext.currentCourse.responses[0].modulesResponse.length; z++){
              if (courseContext.currentCourse.responses[0].modulesResponse[z].moduleId === courseContext.currentCourse.sections[actualSectionIndex+1].modules[0].accessConditions.conditionValue){
                  if (courseContext.currentCourse.responses[0].modulesResponse[z].validated === true){
                      nextModuleAccessible = true
                  }
              } 
            }
          } else {
            nextModuleAccessible = true
          }
        }
      } else {
        nextModuleId = courseContext.currentCourse.sections[actualSectionIndex].modules[actualModuleIndex+1].id
        nextModuleName = courseContext.currentCourse.sections[actualSectionIndex].modules[actualModuleIndex+1].title

        if(courseContext.currentCourse.sections[actualSectionIndex].modules[actualModuleIndex+1].accessConditions.type === "validModule"){
          for (let z = 0; z < courseContext.currentCourse.responses[0].modulesResponse.length; z++){
            if (courseContext.currentCourse.responses[0].modulesResponse[z].moduleId === courseContext.currentCourse.sections[actualSectionIndex].modules[actualModuleIndex+1].accessConditions.conditionValue){
                if (courseContext.currentCourse.responses[0].modulesResponse[z].validated === true){
                    nextModuleAccessible = true
                }
            } 
          }
        } else {
          nextModuleAccessible = true
        }
        
      }
    }


    if (moduleDetails.type === 'quizz' && moduleDetails.quizContent.questions.length > 0){
      const appLocale = {
        "appLocale": {
          "landingHeaderText": "<questionLength> Questions dans ce Quiz",
          "question": "Question",
          "startQuizBtn": "Démarrer le Quiz !",
          "resultFilterAll": "Revoir Toutes les Questions",
          "resultFilterCorrect": "Mes Bonnes Réponses",
          "resultFilterIncorrect": "Mes Mauvaises Réponses",
          "nextQuestionBtn": "Suivant",
          "resultPageHeaderText": "Vous avez terminé le Quiz !",
          "resultPagePoint": `Vous avez obtenu un score de <correctPoints>/<totalPoints>${moduleDetails.conditions.conditionValue && (`, pour valider ce Module Quiz il faut obtenir au moins ${moduleDetails.conditions.conditionValue}% de Bonnes Réponses`)} !`,
          "messageForCorrectAnswer": "Super !"
      }}
      moduleDetails.quizContent = Object.assign(moduleDetails.quizContent, appLocale)
    } else {
      ''
    }

    if (courseContext.currentCourse.responses[0].modulesResponse.length > 0 && !responseIsLoaded){
      for (let i = 0; i < courseContext.currentCourse.responses[0].modulesResponse.length; i++){
        if (courseContext.currentCourse.responses[0].modulesResponse[i].moduleId === moduleDetails.id){
          setResponseIsLoaded(true)
          setResponseExist(true)
          if (courseContext.currentCourse.responses[0].modulesResponse[i].validated === true){
            setIsValidated(true)
          } else {
            setIsValidated(false)
          }
        }
      }
    }

    const validateModule = (async (quizResultats?: any, quizWin?: any) => {
      if (quizResultats == undefined){
        quizResultats = 'NO'
      } else {
        if(quizResultats.questions == undefined){
          quizResultats = 'NO'
        }
      }

      if (!responseExist && !isValidated){
        const createResponse = await createResponseModule({
          responseId: courseContext.currentCourse.responses[0].id,
          courseId: courseContext.currentCourse.id,
          moduleId: moduleDetails.id, 
          quizResponse: quizResultats, 
          quizzValidated: quizWin
        })
  
        if (createResponse && createResponse.status === 200){
          setResponseIsLoaded(true)
          setResponseExist(true)
          setIsValidated(true)


        
          courseContext.getCurrentCourseWab(params.courseId);
          getModuleDetails(`${params.moduleId}`).then(response => {
              if (response) {
                  setModuleDetails({...response.data})
              }
          })
        } /* else {
          toast.error('Une erreur est survenue ...')
        } */
      }

      if (responseExist){
        if (isValidated && quizResultats === 'NO'){
          const updateResponse = await updateResponseModule({
            responseId: courseContext.currentCourse.responses[0].id,
            userId: authContext.authState.user.id,
            moduleId: moduleDetails.id, 
            validated: false,
          })
    
          if (updateResponse && updateResponse.status === 200){
            setResponseIsLoaded(true)
            setResponseExist(true)
            setIsValidated(false)


        
            courseContext.getCurrentCourseWab(params.courseId);
            getModuleDetails(`${params.moduleId}`).then(response => {
                if (response) {
                    setModuleDetails({...response.data})
                }
            })
          } /* else {
            toast.error('Une erreur est survenue ...')
          } */
        }

        if (!isValidated && quizResultats === 'NO'){
          const updateResponse = await updateResponseModule({
            responseId: courseContext.currentCourse.responses[0].id,
            userId: authContext.authState.user.id,
            moduleId: moduleDetails.id, 
            validated: true,
          })
    
          if (updateResponse && updateResponse.status === 200){
            setResponseIsLoaded(true)
            setResponseExist(true)
            setIsValidated(true)


        
            courseContext.getCurrentCourseWab(params.courseId);
            getModuleDetails(`${params.moduleId}`).then(response => {
                if (response) {
                    setModuleDetails({...response.data})
                }
            })
          } /* else {
            toast.error('Une erreur est survenue ...')
          } */
        }

        if (quizResultats && quizResultats !== 'NO'){
          const updateResponse = await updateResponseModule({
            responseId: courseContext.currentCourse.responses[0].id,
            userId: authContext.authState.user.id,
            moduleId: moduleDetails.id, 
            validated: quizWin,
            quizResponse: quizResultats, 
          })
    
          if (updateResponse && updateResponse.status === 200){
            setResponseIsLoaded(true)
            setResponseExist(true)
            setIsValidated(true)


        
            courseContext.getCurrentCourseWab(params.courseId);
            getModuleDetails(`${params.moduleId}`).then(response => {
                if (response) {
                    setModuleDetails({...response.data})
                }
            })
          } /* else {
            toast.error('Une erreur est survenue ...')
          } */
        }
      }
    })


    const setQuizResult = (obj: any) => {
      if (obj.numberOfCorrectAnswers > 0 || obj.numberOfIncorrectAnswers > 0){
        let quizWin = true
        if (moduleDetails.conditions.type === 'percent' && ((obj.numberOfCorrectAnswers / obj.numberOfQuestions) * 100) < parseInt(moduleDetails.conditions.conditionValue)){
          quizWin = false
        }
        validateModule(obj, quizWin)
      }
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
    
                            
    const reponseComment  = (reponse:string,commentId:string) => {  
       
        createreponse({
          userId: `${authContext.authState.user.id}`,
          moduleId:`${params.moduleId}`,
          commentId:commentId,
          comment:reponse,
          time:date,
          
      }).then(response => {
          if(response && response.status === 200) {
            setreponse('');
            toast.success('reponse !')
            window.location.reload()
            
            
          }
      })
      
      
  }
    const submitComment  = (e: FormEvent) => {
      e.preventDefault();
     createcomment({
          userId: `${authContext.authState.user.id}`,
          moduleId:`${params.moduleId}`,
          comment:commentairess,
          time:date,
      }).then(response => {
        
          if(response && response.status === 200) {
            setComment('');
            toast.success('commentaire !')
            window.location.reload()           
          
            
          }
      })
  }
    const fileSubmit = async (file:any) => {
      if (file){
          setFileLoading(true)

          const dataForm = new FormData()
          dataForm.append('file', file)

          const user = authService.getCurrentUser()
          if (!user) return;

          try {
            return await axios.post(`${process.env.REACT_APP_API_FILE_URL}/upload/correction`, dataForm, {
              headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
              }
            }).then ((res) => {
              postUserCorrection(res.data, courseContext.currentCourse.id, authContext.authState.user.id, moduleDetails.id).then(response => {
                if (response?.status === 200) {
        
                  if (!isValidated){
                    validateModule()
                  }

                  setFileLoading(false)
                  setFileUploadError(false)
                  setFileUploaded(true)
                }
              })
            })
          } catch (e) {
                setFileLoading(false)
                setFileUploadError(true)
                setFileUploaded(false)
            }
          }
    };


    const onSubmit = handleSubmit(async (data) => { 
      setFileLoading(true)

      const supportMessage = await postUserCorrection(data.filePath, courseContext.currentCourse.id, authContext.authState.user.id, moduleDetails.id)

      if (supportMessage && supportMessage.status === 200) {
        if (!isValidated){
          validateModule()
        }

        setFileLoading(false)
        setFileUploadError(false)
        setFileUploaded(true)
      } else if (supportMessage && (supportMessage.status > 400)) {
        setFileLoading(false)
        setFileUploadError(true)
        setFileUploaded(false)
      }
    });
    
     
    const onlyValidateModule = (async () => {
      if (!responseExist) {
        const createResponse = await createResponseModule({
          responseId: courseContext.currentCourse.responses[0].id,
          courseId: courseContext.currentCourse.id,
          moduleId: moduleDetails.id
        })

        if (createResponse && createResponse.status === 200){
          setResponseIsLoaded(true)
          setResponseExist(true)
          setIsValidated(true)


          courseContext.getCurrentCourseWab(params.courseId);
          getModuleDetails(`${params.moduleId}`).then(response => {
              if (response) {
                  setModuleDetails({...response.data})
              }
          })
        }
      } else {
        const updateResponse = await updateResponseModule({
          responseId: courseContext.currentCourse.responses[0].id,
          userId: authContext.authState.user.id,
          moduleId: moduleDetails.id, 
          validated: true,
        })

        if (updateResponse && updateResponse.status === 200){
          setResponseIsLoaded(true)
          setResponseExist(true)
          setIsValidated(true)

      
          courseContext.getCurrentCourseWab(params.courseId);
          getModuleDetails(`${params.moduleId}`).then(response => {
              if (response) {
                  setModuleDetails({...response.data})
              }
          })
        }
      }
    })

    const timeValidationModule = (async () => {
      if (moduleDetails.type === 'video' && duration > 0 && !isValidated && moduleDetails.conditions.type === 'viewing') {
        const timeToValidate = setTimeout(async () => {
          onlyValidateModule()
        }, ((duration * 1000) * 0.9));
      }
    })
    
  
    return (
        <AdminLayout backLink={`/formations/${courseContext.currentCourse.id}`}>
            <div className="row">
                  <div className="col-xl-8 col-xxl-9 mb-4">
                      {moduleDetails.type === 'video' && (
                        <>
                        <div className="card border-0 mb-0 rounded-lg overflow-hidden noMobile">
                            <ReactPlayer
                                controls={true} 
                                width={"100%"}
                                height={440}
                                loop={false}
                                url={moduleDetails.filePath}
                                onStart={() => timeValidationModule()}
                                onEnded={() => onlyValidateModule()}
                                onDuration={(duration) => setDurationVideo(duration)}
                            />
                        </div>

                        <div className="card border-0 mb-0 rounded-lg overflow-hidden forMobile">
                            <ReactPlayer
                                controls={true} 
                                width={"100%"}
                                height={230}
                                loop={false}
                                url={moduleDetails.filePath}
                                onStart={() => timeValidationModule()}
                                onEnded={() => onlyValidateModule()}
                                onDuration={(duration) => setDurationVideo(duration)}
                            />
                        </div>
                        </>
                      )}

                    <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss mb-3">
                        <h2 className="fw-700 font-md d-block lh-4 mb-0 custom-pr-220">
                          {moduleDetails.title} {responseExist && (isValidated && (<i className="feather-check text-success ml-1"></i>))}
                        </h2>
                        <span className="font-xssss fw-600 text-grey-500 d-inline-block">
                          {courseContext.currentCourse.title}
                        </span>
                        <span className="dot ml-2 mr-2 d-inline-block btn-round-xss bg-grey"></span>
                        <span className="font-xssss fw-600 text-grey-500 d-inline-block ml-1">
                          {actualSection && actualSection.title}
                        </span>

                        <div
                            className="font-xsss fw-500 lh-24 text-grey-600 mb-0 mt-3"
                            dangerouslySetInnerHTML={{
                            __html: moduleDetails.description.replace(/<a href=/g, '<a target="_blank" href=')
                        }}>
                        </div>

                        <div className='validationButton'>
                          {(canValidate) && (
                            (moduleDetails.conditions.type === 'percent' || moduleDetails.conditions.type === 'viewdding' || moduleDetails.type === 'correction' || moduleDetails.type === 'correction-url') ? (
                              ''
                            ) : (
                              responseExist ? (
                                (isValidated ? (
                                  <a
                                    className="btn p-2 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-transparent border-success text-success font-xsss fw-600"
                                    onClick={validateModule}
                                  >
                                    <i className="feather-check mr-1"></i> Module Validé
                                  </a>
                                ) : (
                                  <a
                                    className="btn p-2 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-transparent border-primary font-xsss fw-600 text-primary"
                                    onClick={validateModule}
                                  >
                                    <i className="feather-check mr-1"></i> Valider le Module
                
                                  </a>
                                )
                              )) : (
                                <a
                                  className="btn p-2 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-transparent border-primary font-xsss fw-600 text-primary"
                                  onClick={validateModule}
                                >
                                  
                                   Valider le Module
                                </a>
                                
                              )
                            )
                          )}
                        </div>
                        <br />
                        <br />
                        <div>
                          {(authContext.authState.user.role=="user")&&(
                          <div>
                            <form onSubmit={submitComment}>
                          <label htmlFor="product_sku" className="form-label">Commentaire
                                        </label>
                                        <input
                                            onChange={(e) => setComment(e.target.value)}
                                            value={commentairess}
                                            className="form-control style2-input bg-color-none text-grey-700"
                                            type="text"
                                            placeholder="Commentaire *"
                                            required
                                            defaultValue="Reset"
                                        />
                            <br />
                            <br />
                            <button
                              type="submit"
                              className="p-0 btn p-3 lh-24 pr-4 pl-4 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-600 ls-lg text-white mt-2 pb-2"
                            >
                              Envoyer le commentaire
                            </button>
                          </form>
                          </div>
                          )}
                          <br />
                          {(b!="")&&(
                              <div>
                                <h1>Commentaires</h1>
                              <br />
                              </div>
                              
                            )}
                            
                            {moduleDetails.comments.map((cmmnt:any, key:number)=>(
                              <div>
                                {(cmmnt.validated=="pending")&&(
                                  <div>
                                    {(cmmnt.userId.id==authContext.authState.user.id)&&(
                                      <div>
                                        <div className=' row'>
                                        <div className='col-sm-6 bg-dark  rounded-pill p-3  border'>
                                          <h3 className='text-white'><strong>{cmmnt.userId.firstName}</strong> - <Moment format='DD MMMM à HH:mm'>{cmmnt.time}</Moment></h3>
                                          <h4 className='text-white'>{b=cmmnt.comment}</h4>
                                          <h4 className='text-white' >En cours de validation</h4>
                                        </div>
                                        <div className='col-sm-6'></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            <br />
                            {(authContext.authState.user.role=="user")&&(
                               <hr className="bg-skype"/>
                            )}
                          
                          {validat.map((cmment:any, key:number)=>(
                          <div>
                            <div className=' row'>
                              <div className='col-sm-6 bg-dark  text-white rounded-pill p-3 border'>
                                <h3 className='text-white'><strong>{cmment.userId.firstName}</strong> - <Moment format='DD MMMM à HH:mm'>{cmment.time}</Moment></h3>
                                <h4 className='text-white'>{cmment.comment}</h4>
                              </div>
                              <div className='col-sm-6'></div>
                              <br />
                              {(authContext.authState.user.role=="teacher")&&(
                                            <div>
                                            <label htmlFor="product_sku" className="form-label">Repondre
                                                          </label>
                                                          <br />
                                                          <input
                                                              
                                                              onChange={((e) => setreponse(e.target.value))}
                                                              type="text"
                                                              placeholder="repondre *"
                                                              required
                                                              
                                                          />
                    
                                              <button
                                                type="submit"
                                                className="text-white pull-center bg-skype  border-1 pr-3 rounded-right "
                                                onClick={(()=> reponseComment(reponsesss,`${cmment._id}`))}
                                              >
                                                <FaPaperPlane  />
                                              </button>
                                            </div>
                              )}
                  {}
                            </div>
                              
                              {cmment.responses.map((reponse: any, index: number)=>(
                                <div className=' row'>
                                  <div className='col-sm-6'></div>   
                                  <div className='col-sm-6 bg-skype rounded-pill p-3  border'> 
                                  <h4 className='text-white'><strong>{reponse.userId.firstName}</strong> - <Moment format='DD MMMM à HH:mm'>{reponse.time}</Moment></h4>
                                  <h4 className='text-white'>{reponse.comment}</h4>
                                  </div>
                                 
                                </div>
                              ))}
                              <br />
                            </div>

                          ))}
                          <h3></h3>
                        </div>

                      </div>

                      {moduleDetails.type === 'correction' && (
                        <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss">
                            <div className='col-md-12'>
                              <div className="form-group mb-3 md-mb-2">

                                {Object.keys(lastCorrection).length > 0 ? (
                                  <>
                                    <label className="mont-font fw-600 font-xsss">
                                        Vous avez déjà envoyé un fichier sur ce module que vous pouvez retrouver ici : 
                                    </label>
                                    <p>
                                      <a
                                        href={lastCorrection.filePath}
                                        target='_blank'
                                      >
                                        <i className='feather feather-link mr-2'></i>
                                        Votre Fichier
                                      </a>
                                    </p>
                                  </>
                                ) : (
                                  ''
                                )}

                                <div className="card-body d-flex justify-content-between align-items-end p-0">
                                  <div className="form-group mb-0 w-100">
                                    <label className="mont-font fw-600 font-xsss">
                                        Envoyez le Fichier à corriger ici :
                                    </label>

                                    {(!fileLoading && !fileUploaded && !fileUploadError) && (
                                      <>
                                        <input
                                          onChange={(e:any) => fileSubmit(e.target.files[0])}
                                          type="file"
                                          name="file"
                                          id="file"
                                          className="input-file"
                                        />
                                        <label
                                          htmlFor="file"
                                          className="rounded-lg text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed"
                                          style={{ lineHeight: '25px'}}
                                        >
                                          <i className="ti-cloud-down large-icon mr-3 d-block mb-3"></i>
                                          <span className="js-fileName">
                                            Cliquez ici pour Sélectionner et Envoyer votre Fichier
                                          </span>
                                        </label>
                                      </>
                                    )}

                                  </div>
                                </div>


                                {(fileLoading && !fileUploaded && !fileUploadError) && (
                                    <div className='mt-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                                        <Spinner /> <p className='mb-0 ml-3'>Téléchargement en cours ... </p>
                                    </div>
                                )}
                                {
                                    (fileUploaded && !fileUploadError) && (
                                        <p className='text-success lh-3'> <i className="feather-check mr-2"></i> 
                                            Votre Fichier a bien été envoyé à votre Formateur !
                                        </p>
                                    )
                                }
                                {
                                    (!fileUploaded && fileUploadError) && (
                                        <p className='text-danger lh-3'> <i className="feather-x mr-2"></i> 
                                            Un Problème est survenu et votre fichier n'a pas été envoyé ... <br/> Assurez-vous que le format soit correct et qu'il ne dépasse pas les 50Mo
                                        </p>
                                    )
                                }
                              </div>
                            </div>
                        </div>
                      )}

                      {moduleDetails.type === 'correction-url' && (
                        <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss">
                            <div className='col-md-12'>
                              <div className="form-group mb-3 md-mb-2">

                                {Object.keys(lastCorrection).length > 0 ? (
                                  <>
                                    <label className="mont-font fw-600 font-xsss mb-0">
                                        Vous avez déjà envoyé un lien pour ce module ! <br />
                                    </label>
                                    <label className="mont-font fw-600 font-xssss mb-4">
                                    <br /><br />Vous pouvez envoyer un nouveau fichier si besoin juste en dessous !
                                    </label>
                                  </>
                                ) : (
                                  ''
                                )}

                                <div className="card-body d-flex justify-content-between align-items-end p-0">
                                  <div className="form-group mb-0 w-100">
                                    <label className="mont-font fw-600 font-xsss">
                                        Envoyez le lien de votre Fichier à corriger ici :
                                    </label>

                                    {(!fileLoading && !fileUploaded && !fileUploadError) && (
                                      <>                                          
                                          <form onSubmit={onSubmit}>
                                            <div className="row">
      
                                              <div className="col-12">
                                                <div className="form-group mb-3 md-mb-2">
                                                  <input
                                                    {...register("filePath", { required: true })}
                                                    type="text"
                                                    className="form-control form_control"
                                                    placeholder="Ex: https://docs.google.com/..."
                                                    required
                                                  />
                                                </div>
                                              </div>
      
                                              <div className="col-md-12">
                                                <div className="form-group">
                                                    <button
                                                      className="btn p-3 lh-24 pr-5 pl-5 ls-3 d-inline-block rounded-xl bg-skype font-xssss fw-600 ls-lg text-white mt-0 pb-2"
                                                    >
                                                      <i className='feather feather-check mr-2'></i> Envoyer
                                                    </button>
                                                  
                                                </div>
                                              </div>
                                            </div>
                                          </form>
                                      </>
                                    )}

                                  </div>
                                </div>


                                {(fileLoading && !fileUploaded && !fileUploadError) && (
                                    <div className='mt-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                                        <Spinner /> <p className='mb-0 ml-3'>Envoi en cours ... </p>
                                    </div>
                                )}
                                {
                                    (fileUploaded && !fileUploadError) && (
                                        <p className='text-success lh-3'> <i className="feather-check mr-2"></i> 
                                            Le lien de votre fichier a bien été envoyé à votre Formateur !
                                        </p>
                                    )
                                }
                                {
                                    (!fileUploaded && fileUploadError) && (
                                        <p className='text-danger lh-3'> <i className="feather-x mr-2"></i> 
                                            Un Problème est survenu et votre fichier n'a pas été envoyé ... Réessayez plus tard
                                        </p>
                                    )
                                }
                              </div>
                            </div>
                        </div>
                      )}

                      {moduleDetails.type === 'text' && (
                        <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss articleModule">
                            <div
                            className='pt-2'
                              dangerouslySetInnerHTML={{
                                __html: moduleDetails.content.replace(/<a href=/g, '<a target="_blank" href=')
                              }}>
                            </div>
                        </div>
                      )}

                      {moduleDetails.type === 'pdf' && (
                        <>
                          <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss">
                            <a className='font-sm fw-600 text-primary' href={moduleDetails.filePath} target="_blank">
                              <i className='feather-file-text mr-3'></i> Accèdez au document en cliquant ici !
                            </a>
                          </div>
                        </>
                      )}

                      {moduleDetails.type === 'fichier' && (
                        <>
                          <div className="card d-block border-0 rounded-lg overflow-hidden p-4 shadow-xss">
                            <p className='text-right'>
                              <a href={moduleDetails.filePath} target='_blank'>
                                <i className='feather feather-chevron-right mr-2'></i> 
                                Ouvrir en plein écran
                              </a>
                            </p>
                            <object data={moduleDetails.filePath} type="application/pdf" width="100%" style={{ minHeight: '60vh'}}>
                              <p>Lien vers le fichier PDF : <a href={moduleDetails.filePath}>Juste ici !</a></p>
                            </object>
                          </div>
                        </>
                      )}

                      {(moduleDetails.type === 'quizz' && moduleDetails.quizContent.questions.length > 0) && (
                        <div className="card d-block border-0 rounded-lg overflow-hidden shadow-xss p-4">

                          {responseExist && (isValidated && (
                            <h2 className="fw-500 font-s text-success d-block lh-4 mb-0">
                              <i className="feather-check text-success mr-2"></i> Vous avez Validé ce Quiz !
                            </h2>
                          ))}
                           <Quiz 
                              quiz={moduleDetails.quizContent} 
                              showInstantFeedback 
                              onComplete={setQuizResult}
                           />
                        </div>
                      )}
                  
                    {moduleDetails.type === 'tejhff' && (
                      <>
                      <h2 className="fw-700 font-md d-block lh-4 mb-3 mt-4 ml-2">
                        Espace Commentaires - POST COMMENT MANQUANT
                      </h2>

                      <div className="card w-100 d-block chat-body p-0 border-0 shadow-xss rounded-3 mb-3 position-relative">
                        <div className="messages-content chat-wrapper scroll-bar p-3">

                        <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                             
                            </div>
                            <div className="message-wrap">
                              Très intéressante comme vidéo, il y a d’autres façons de le dire ?
                            </div>
                          </div>
                          <div className="message-item outgoing-message">
                            <div className="message-user">
                              <div>
                                <h5>Vous</h5>
                                <div className="time">11 Mars - 9h41</div>
                              </div>
                            </div>
                            <div className="message-wrap">
                              EEETrès intéressante comme vidéo, il y a d’autres façons de le dire ?EEE
                            </div>
                          </div>


                        </div>
                        <form className="chat-form position-absolute bottom-0 w-100 left-0 bg-white z-index-1 p-3 shadow-xs theme-dark-bg ">
                          <div className="form-group">
                            <input 
                              className="form-control form_control pl-4"
                              type="text" 
                              placeholder="Écrire un commentaire" />
                          </div>
                          <button className="bg-skype">
                            <i className="ti-arrow-right text-white"></i>
                          </button>
                        </form>
                      </div>
                      </>
                    )}
                  </div>


                  <div className="col-xl-4 col-xxl-3">

                    {(nextModuleId && nextModuleName && nextModuleId !== 'END2') && (
                      <div className="card pl-4 pr-4 pt-2 pb-2 mb-4 border-0 shadow-xss rounded-lg mb-4">
                        <div className="card-body">
                          {nextModuleId === "END" ? '' : (
                            <p className="fw-600 font-xssss d-block lh-4 mb-3 text-center">Prochain Module :</p>
                          )}
                          <h2 className="fw-700 font-xs d-block lh-4 mb-4 text-center">
                            {nextModuleName && nextModuleName}
                          </h2>
                          {nextModuleId === "END" ? (
                            <a
                              href={`/formations/${courseContext.currentCourse.id}`}
                              className="btn btn-block border-0 w-100 bg-skype p-3 text-white fw-600 rounded-lg d-inline-block font-xssss btn-light"
                            >
                              Retour au Sommaire
                            </a>
                          ) : (
                            nextModuleAccessible && (
                              <a
                                href={`/formations/${courseContext.currentCourse.id}/module/${nextModuleId}`}
                                className="btn btn-block border-0 w-100 bg-skype p-3 text-white fw-600 rounded-lg d-inline-block font-xssss btn-light"
                              >
                                Aller au Module Suivant
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="card d-block border-0 rounded-lg overflow-hidden">
                      { actualSection && (
                      
                      <Accordion
                        defaultActiveKey={actualSection && actualSection.id}
                        className="accordian mb-3 accordian-course"
                        >
                        {
                            courseContext.currentCourse.sections.map((section: any, key:number) => {
                                return (
                                    <Accordion.Item
                                        key={key}
                                        eventKey={section.id}
                                        className="accordion-item border-0 mb-3 shadow-xs rounded-sm bg-white"
                                    >
                                        <Accordion.Header className='shadow-xs border radius-0 mb-0'>
                                            {section.title}
                                        </Accordion.Header>
                                        <Accordion.Body className='border'>
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
                                                              <span className="font-xssss fw-500 text-grey-800 ml-2">
                                                                  {module.type === "video" && <i className="feather-youtube mr-2"></i>}
                                                                  {module.type === "quizz" && <i className="feather-help-circle mr-2"></i>}
                                                                  {module.type === "pdf" && <i className="feather-file-text mr-2"></i>}
                                                                  {module.type === "text" && <i className="feather-align-left mr-2"></i>}
                                                                  

                                                                  <a className='tooltipText text-grey-800' data-tip data-for={module.accessConditions.conditionValue}><i className="feather-lock mr-1"></i>{module.title} </a>

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
                                                                <a
                                                                  href={`/formations/${courseContext.currentCourse.id}/module/${module.id}`}
                                                                >
                                                                <span className="bg-skype btn-round-s rounded-lg font-xssss text-white fw-600">
                                                                    {key+1}
                                                                </span>
                                                                <span className={`text-grey-800 ml-2 ${module.id === moduleDetails.id ? 'fw-700 font-xsss' : 'fw-500 font-xssss'}`}>
                                                                    {module.title}<i className="feather-check text-success ml-1"></i>
                                                                </span>
                                                                </a>
                                                               
                                                            </div>
                                                        )
                                                      }
                                                    }
                                                  }
                                                }
                                                return (
                                                    <div className="card-body d-flex p-2" key={key}>
                                                        <a
                                                          href={`/formations/${courseContext.currentCourse.id}/module/${module.id}`}
                                                        >
                                                          
                                                        <span className="bg-skype btn-round-s rounded-lg font-xssss text-white fw-600">
                                                            {key+1}
                                                        </span>
                                                        <span className={`text-grey-800 ml-2 ${module.id === moduleDetails.id ? 'fw-700 font-xsss' : 'fw-500 font-xssss'}`}>
                                                            {module.title}
                                                        </span>
                                                        </a>

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
                        
                      )}
                        
                    </div>

                  </div>
                </div>
        </AdminLayout>
    );
};

export default DisplayModulePage;
