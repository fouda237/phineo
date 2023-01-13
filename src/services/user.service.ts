import axios, {AxiosError} from "axios";
import { ICreateUser, ICreateEmrysUser, IRemoveAssignment, IGetUser, IUserUpdate, ISupport, IInscriptionCourse, ITeacherSupport } from "types/user.types";
import authService from "./auth.service";

const getUsers = async () => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
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

const getUser = async ({ id }: IGetUser) => {
    const user = authService.getCurrentUser();
    if(!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
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
 * @name getUserCourses
 */
 const getUserCourses = async () => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users/${JSON.parse(user).user.id}/courses`, {
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

const getUserFormations = async () => {
    const user = authService.getCurrentUser();
    if(!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
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



const getLogsCourse = async (courseId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/logs/course/${courseId}`, {
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



const getUserLogsCourse = async (courseId: string, userId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/logs/course/${courseId}/user/${userId}`, {
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


const getUserStats = async (userId: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/stats`, {
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



const createUser = async ({ email, firstName, lastName, role }: ICreateUser) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
            email,
            firstName,
            lastName,
            role
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

const createEmrysUser = async ({ email, firstName, lastName, role }: ICreateEmrysUser) => {
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/auth/register-emrys`, {
            email,
            firstName,
            lastName, 
            role,
        
        })
    } catch (e) {
        const error = e as AxiosError
        if (error.response?.status === 511){
            authService.logout()
        }
    }
}

const updateUser = async ({ userId, firstName, lastName, role }: IUserUpdate) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
            firstName,
            lastName,
            role
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
    } catch (error) {
        const errorA = error as AxiosError
        if (errorA.response?.status === 511){
            authService.logout()
        }
    }
}

const updateUserPassword = async (userId: string, password: string) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
            password
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


const supportEmail = ({email, firstName, message, userId}: ISupport) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    return axios
        .post(`${process.env.REACT_APP_API_URL}/email/support`, {
            email,
            firstName, 
            message, 
            userId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
        .then((response) => {
            return response;
        }).catch((error) => {
            const errorA = error as AxiosError
            if (errorA.response?.status === 511){
                authService.logout()
            }
            return error.response.data.message;
        })
};


const inscriptionCourseEmail = ({email, fullname, cpf, file, temps, offre, offre_name, offre_description, offre_price, userId}: IInscriptionCourse) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    return axios
        .post(`${process.env.REACT_APP_API_URL}/commandes`, {
            email,
            fullname, 
            cpf, 
            file,
            temps,
            offre,
            offre_name,
            offre_description,
            offre_price,
            userId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
        .then((response) => {
            return response;
        }).catch((error) => {
            const errorA = error as AxiosError
            if (errorA.response?.status === 511){
                authService.logout()
            }
            return error.response.data.message;
        })
};

const getCommandes = async () => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/commandes`, {
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

const updateStatusCommande = async (commandeBody: { id: any; }, status: string) => {
    const user = authService.getCurrentUser()
    if (!user) return; 
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/commandes/${commandeBody.id}`, {
            commandeBody, 
            status
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

const updateGlobalStatusCommande = async (commandeBody: { id: any; }, status: string) => {
    const user = authService.getCurrentUser()
    if (!user) return; 
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/commandes/${commandeBody.id}/global`, {
            commandeBody, 
            status
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




const teacherSupportEmail = ({email, firstName, message, userId, teacherId}: ITeacherSupport) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    return axios
        .post(`${process.env.REACT_APP_API_URL}/email/teacher-support`, {
            email,
            firstName, 
            message, 
            userId, 
            teacherId
        }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        })
        .then((response) => {
            return response;
        }).catch((error) => {
            const errorA = error as AxiosError
            if (errorA.response?.status === 511){
                authService.logout()
            }
            return error.response.data.message;
        })
};



const createLog = async (params:any, pageName:any) => { 
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/logs`, {
            params, 
            pageName
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


const createViewLog = async (pageName:any) => { 
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/logs/view`, {
            pageName
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



const createStayLog = async (courseId:any, moduleId:any, pageName:any) => { 
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/logs/module`, {
            courseId, 
            moduleId, 
            pageName
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

const removeCourseAssignment = async ( userId:any, courseId:any ) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/users/${userId}/remove-assignment`, {
            userId,
            courseId
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

export {
    createUser,
    createEmrysUser,
    updateUser,
    updateUserPassword,
    getUsers,
    getUser,
    getUserCourses,
    supportEmail, 
    inscriptionCourseEmail, 
    getCommandes,
    updateStatusCommande,
    teacherSupportEmail,
    createLog,
    createStayLog,
    createViewLog,
    removeCourseAssignment, 
    updateGlobalStatusCommande,
    getUserLogsCourse,
    getUserStats,
    getLogsCourse
}
