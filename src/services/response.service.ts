import axios, {AxiosResponse, AxiosError} from "axios";
import {
    ICreateResponseModule,
    IUpdateResponseModule
} from "types/response.types"
import authService from "services/auth.service"


////////////
//  POST  //
//////////

 const createResponseModule = async ({responseId, courseId, moduleId, quizResponse, quizzValidated}: ICreateResponseModule): Promise<AxiosResponse | undefined> => {
    const user = authService.getCurrentUser()
    const validated = true
    if (quizzValidated == false){
        const validated = false;
    }

    if (!user) return;
    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/responses/${responseId}/addResponse`, {
            courseId,
            moduleResponse: {
                moduleId,
                validated: validated,
                quizResponse
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


/////////////
//  PATCH  //
///////////


const updateResponseModule = async ({responseId, userId, moduleId, validated, quizResponse}: IUpdateResponseModule) => {
    const user = authService.getCurrentUser()
    if (!user) return;
    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/responses/${responseId}`, {
            userId,
            modulesResponse: {
                moduleId,
                validated,
                quizResponse: quizResponse
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


export {
    createResponseModule,
    updateResponseModule
}
