import axios, {AxiosResponse, AxiosError} from "axios";
import {
    ICreateCourse,
    IModuleComment,
    ICreateInteraction,
    IUpdateInteraction,
    ICreateModule,
    ICreateSection,
    IUpdateModule,
    IUpdateSection,
    IValComment,
    IModuleresponse 
} from "types/course.types"
import authService from "services/auth.service"
import {IUser, IUserAssignment} from "../types/user.types";

//TODO utiliser un fetch interceptor plutôt que de passer le tokenn dans chaque requête

////////////
//  POST  //
//////////


/**
 * @name createCourse
 * @param title:string
 * @param description:string
 * @param image:string
 * @param category:string
 */
const createCourse = async ({
                                title,
                                description,
                                image,
                                category
                            }: ICreateCourse): Promise<AxiosResponse | undefined> => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses`, {
            title,
            description,
            image: image,
            category,
            teacher: JSON.parse(user).user.id
        }, {
            headers: {
                'accept': 'application/json',
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`,
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name createSection
 * @param title:string
 * @param description:string
 * @param courseId: FK string
 */
const createSection = async ({title, description, courseId}: ICreateSection) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/section`, {
            title,
            description,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name createModule
 * @param courseId: FK string -> source
 * @param sectionId: FK string -> section
 * @param title:string
 * @param description:string
 * @param type:string
 * @param filePath:FormData
 * @param content:string
 */
const createModule = async ({
                                courseId,
                                sectionId,
                                title,
                                description,
                                type,
                                filePath,
                                content,
                                conditions,
                                accessConditions,
                                quizContent
                            }: ICreateModule) => {
    const user = authService.getCurrentUser()
    const condition=JSON.stringify(conditions);
    const accessCondition=JSON.stringify(accessConditions);
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/section/${sectionId}/module`, 
           filePath
        , {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`,   
                title, 
                description, 
                type,
                content,
               condition,
                accessCondition,
                quizContent
            },
            
        })
        
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            // authService.logout()
            console.log(error)
        }
    }
}


/**
 *
 * @param courseId
 * @param daysAfter
 * @param hourOfTheDay
 * @param nodes
 * @param edges
 */
const createInteraction = async ({courseId, daysAfter, hourOfTheDay, minuteOfTheDay, title, nodes, edges}: ICreateInteraction) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interaction`, {
            daysAfter,
            hourOfTheDay,
            minuteOfTheDay,
            title,
            content: {
                nodes,
                edges
            }
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name postComment
 * @param title:string
 * @param description:string
 * @param image:string
 * @param category:string
 */
const postComment = async (comment: string, courseId: string): Promise<AxiosResponse | undefined> => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/knowledge`, {
            comment: comment,
            userId: JSON.parse(user).user.id
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name postComment
 * @param title:string
 * @param description:string
 * @param image:string
 * @param category:string
 */
const postUserResponseInteraction = async (data:any, courseId:string, userId:string, interactionId:string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interactions/user/${userId}`, {
            data,
            interactionId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}



/**
 * @name postUserCorrection
 */
const postUserCorrection = async (filePath:string, courseId:string, userId:string, moduleId:string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/correction`, {
            filePath,
            courseId, 
            userId, 
            moduleId
        }, {
            headers: {
                'accept': 'application/json',
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`,
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}



/**
 * @name duplicateCourseById
 */
 const duplicateCourseById = async (courseId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/duplication`, {
            courseId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        /*
        if (error.response?.status === 511){
            authService.logout()
        }
        */
    }
}


const createTag = async (courseId:any, tag:string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/tag`, {
            tag
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}



////////////
//  GET  //
//////////


/**
 * @name getCourseDetails
 * @param id:string
 */
 const getCourseDetails = async (id: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const getcommentVal = async (moduleId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/modules/commentValidated/${moduleId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name getCourseWab
 * @param id:string
 */
const getCourseWab = async (id: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/${id}/phineo`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const getComment = async (userid: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name getSectionDetails
 * @param courseId: FK string -> course
 * @param sectionId: string
 */
const getSectionDetails = async (courseId: string, sectionId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/sections/${sectionId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getSectionDetails
 * @param moduleId: string
 */
const getModuleDetails = async (moduleId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/modules/${moduleId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getSectionDetails
 * @param moduleId: string
 */
const getModuleTitle = async (moduleId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/modules/${moduleId}/title`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name getCourses
 */
const getCourses = async () => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


const getInteraction = async (courseId: string, id: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interaction/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }

}

const getInteractions = async (courseId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interaction`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }

}


/**
 * @name getCoursesNTeachers
 */
 const getCoursesNTeachers = async () => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/interactions`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}



/**
 * @name getCoursesNTeachers
 */
 const getInteractionWab = async (courseId: string, userId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interactions/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getOneCourseDetailInteraction
 */
 const getOneCourseDetailInteraction = async (courseId:string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/interaction-info/${courseId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getSpecificLastCorrection
 */
 const getSpecificLastCorrection = async (userId: string, courseId: string, moduleId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/correction/user/${userId}/course/${courseId}/module/${moduleId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getCorrectionByCourse
 */
 const getCorrectionByCourse = async (courseId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/correction/course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


const getTagsCourse = async (courseId:any) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/tag`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getCoursesNTeachers
 */
 const getSuitInteractionWab = async (data:any, courseId:string, userId:string, interactionId:string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interactions/user/${userId}/suit`, {
            data,
            interactionId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name getCoursesNTeachers
 */
 const getSuitInteractionWabAfterPersonalizedMessage = async (data:any, courseId:string, userId:string, interactionId:string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interactions/user/${userId}/suitAfterPersonalizedMessage`, {
            data,
            interactionId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/////////////
//  PATCH  //
///////////


/**
 * @name updateSection
 * @param title
 * @param description
 * @param courseId
 * @param sectionId
 */
const updateSection = async ({title, description, courseId, sectionId}: IUpdateSection) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/sections/${sectionId}`, {
            title,
            description,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const createcomment= async({userId, moduleId,comment,time}:  IModuleComment) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/modules/${moduleId}/comments`, {
            userId,
            comment,
            time,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const createreponse= async({userId, moduleId,commentId,comment,time,}:  IModuleresponse ) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/modules/${moduleId}/commentReply/${commentId}`, {
            userId,
            comment,
            time,
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const Valcomment= async({ moduleId,commentId}:  IValComment) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/modules/${moduleId}/${commentId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const Valnncomment= async({ moduleId,commentId}:  IValComment) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/modules/${moduleId}/${commentId}/close`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const updateModule = async ({moduleId, type, filePath, content, title, description, quizContent, conditions, accessConditions}: IUpdateModule) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/modules/${moduleId}`, {
            type, filePath, content, title, description, conditions, quizContent, accessConditions
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateCourse = async ({courseId, title, category, description}: any) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/courses/${courseId}`, {
            title, category, description
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateTeacher = async ({courseId, teacher}: any) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/teacher`, {
            teacher
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateCourseSections = async (courseId: number, sections: any[]) => {
    const user = authService.getCurrentUser()
    if (!user) return;


    try {
        const sectionsId = sections.map(item => {
            return item.id
        });

        return await axios.patch(`${process.env.REACT_APP_API_URL}/courses/${courseId}`, {
            sections: sectionsId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateSectionModules = async (sectionId: number, modules: any[]) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        const modulesId = modules.map(item => {
            return item.id
        });

        return await axios.patch(`${process.env.REACT_APP_API_URL}/sections/${sectionId}`, {
            modules: modulesId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}
const updateCourseComments = async (courseId: string, comments: any[]) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {

        return await axios.patch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/knowledge`, {
            knowledge: comments
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateCourseAssignments = async (courseId: number, assignments: IUserAssignment[]) => {
    const user = authService.getCurrentUser()
    if (!user) return;


    try {

        const userId = assignments.map(userDTO => {
            return {beginDate: userDTO.beginDate, user: userDTO.user.id}
        });
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/assignments`, {
            assignments: userId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateCourseAssignmentsFromUserPage = async (courseId: number, assignments: any) => {
    const user = authService.getCurrentUser()
    if (!user) return;

    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/assignments`, {
            assignments: assignments
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateInteraction = async ({courseId, interactionId, daysAfter, hourOfTheDay, minuteOfTheDay, title, nodes, edges}: IUpdateInteraction) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interaction/${interactionId}`, {
            daysAfter,
            hourOfTheDay,
            minuteOfTheDay,
            title,
            content: {
                nodes,
                edges
            }
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            },
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateImageCourse = async ({courseId, imageUrl}: any) => {
    const user = authService.getCurrentUser()
    if (!user) return;

    try {
            return await axios.patch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/image`, {
                courseId,
                imageUrl
            }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
        
        return e
    }
}


/////////////
//  DELETE  //
///////////


/**
 * @name removeCourse
 * @param sectionId: string
 * @param moduleId: string
 */
 const removeCourse = async (courseId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name deleteSection
 * @param sectionId: string
 * @param moduleId: string
 */
 const deleteSection = async (courseId: string, sectionId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}/section/${sectionId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name deleteModule
 * @param sectionId: string
 * @param moduleId: string
 */
 const deleteModule = async (courseId: string, sectionId: string, moduleId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}/section/${sectionId}/module/${moduleId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


/**
 * @name deleteKnowledge
 * @param courseId: string
 * @param knowledgeId: string
 */
 const deleteKnowledgeCourse = async (courseId: string, commentId: string) => {
     console.log('commentId', commentId)
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}/knowledge/${commentId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

/**
 * @name deleteInteraction
 * @param courseId: string
 * @param interactionId: string
 */
 const deleteInteraction = async (courseId: string, interactionId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}/interaction/${interactionId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}


export {
    createcomment,
    createreponse,
    createCourse,
    getCourseDetails,
    getcommentVal,
    Valcomment,
    Valnncomment,
    getComment ,
    getCourseWab,
    getCourses,
    getCoursesNTeachers,
    createSection,
    createModule,
    getSectionDetails,
    updateSection,
    getModuleDetails,
    getModuleTitle,
    getInteractionWab,
    updateModule,
    updateCourseAssignments,
    updateCourseAssignmentsFromUserPage,
    updateCourse,
    updateCourseSections,
    updateSectionModules,
    updateCourseComments,
    createInteraction,
    getInteraction,
    getInteractions,
    updateInteraction,
    deleteSection,
    deleteModule,
    deleteKnowledgeCourse,
    deleteInteraction,
    postComment,
    updateImageCourse,
    getOneCourseDetailInteraction,
    postUserResponseInteraction, 
    removeCourse,
    updateTeacher, 
    postUserCorrection, 
    getSpecificLastCorrection, 
    getCorrectionByCourse,
    duplicateCourseById, 
    createTag,
    getTagsCourse,
    getSuitInteractionWab,
    getSuitInteractionWabAfterPersonalizedMessage
}

