
export interface ICreateResponseModule {
    responseId: string,
    courseId:string,
    moduleId:string,
    quizResponse?:object, 
    quizzValidated?:boolean
}

export interface IUpdateResponseModule {
    responseId: string,
    moduleId:string,
    validated:boolean, 
    userId: string,
    quizResponse?:object, 
    quizzValidated?:boolean
}