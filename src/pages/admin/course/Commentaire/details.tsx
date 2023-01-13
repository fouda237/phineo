
import React, { FormEvent } from 'react';
import Moment from 'react-moment';
import {useParams} from 'react-router-dom';
import {getComment, Valnncomment,updateCourseSections, updateSectionModules, Valcomment} from "services/course.service";
import { useCourseContext} from 'context';
import {  Reorder } from "../../../../components/DraggableComponent/utils";
import { toast } from 'react-toastify';
const CommentaireDetails = () => {
    
    const courseContext = useCourseContext();
   
    const [getcommenta, setCommentaire] = React.useState({
        firstName:"",
        lastName:"",
    }
        
    );
    const [sections, setSections] = React.useState(courseContext.currentCourse.sections)
    const [comments, setComment] =React.useState("");
    const params = useParams();
    const validat: any[] = [];
    const validate: any[] = [];
    sections?.map((section: any, index: any) => {
        section.modules.map((module: any, index: number) => {
            validat.push(module);
            module.comments.map((cmmnt:any,key:number)=>{
            if(cmmnt.validated=="pending"){
            validate.push(cmmnt);
            }
        
      })
        })
    });
    // module.comments.map((cmment: any, index: number) => {
    //   if(cmment.validated=="true"){
    //     validat.push(cmment);
    //   }
      
    // })
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

    
    
    
        // This represents the unmount function, in which you need to clear your interval to prevent me,
    const submitComment  = (moduleid:string,commentid:string) => {
        
       Valcomment({
            moduleId:moduleid,
            commentId:commentid,
        }).then(response => {
            if(response && response.status === 200) {
              window.location.reload()  
              setComment('');
              toast.success('le commentaire est validé!')
              
            }
        })
    }
    const onsubmitComment  = (moduleid:string,commentid:string) => {
        
        Valnncomment({
             moduleId:moduleid,
             commentId:commentid,
         }).then(response => {
             if(response && response.status === 200) {
               window.location.reload()
               setComment('');
               toast.success('le commentaire est non validé!')
               
             }
         })
     }
    return (
        <>
             <div className="row">
             {validat.map((module:any,key:number)=>(
                     <div className='col-md-12'>
                            {validate.map((cmment: any, index: number) => {
                             return(
                                <div className='mb-3'>
                                        
                                       <h1 className="fw-500 font-sm d-block lh-4 mb-3 custom-pr-220">
                                        <strong>Module: </strong>{module.title}
                                        </h1>
                        
                                  
                                          <div><h2 className='mb-0'>
                                            {cmment.userId.firstName}  - <Moment format='DD MMMM à HH:mm'>{cmment.time}</Moment>
                                        </h2>
                                        </div>  
                                        
                                     <div>
                                            
                                            
                                             <h2 className='mb-0'>
                                             {cmment.comment} 
                                              </h2>
                                            
                                             </div> 
                                             <br /> 
                                              
                                            <div>
                                               <button className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-600 ls-lg text-white" onClick={(()=> submitComment(`${module.id}`,`${cmment._id}`))}>
                                                  <i className="feather-check mr-1"></i>
                                                  Valider
                                              </button>
                                              {             }
                                              <button className="ml-auto p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-600 ls-lg text-white" onClick={(()=> onsubmitComment(`${module.id}`,`${cmment._id}`))}>
                                                  <i className='feather feather-x ml-2 text-danger'></i>
                                                  Supprimer
                                              </button>
                                              </div>
                                              <hr className="bg-skype"/>

                                </div>
                             );

                            })}
                </div>
             ))}                    
             </div>
            
        </>
    );
};

export default CommentaireDetails;

