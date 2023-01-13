import {accessConditionsTypes,conditionsTypes} from "./enums/conditionsTypesEnum";

export interface ICreateCourse {
    title: string;
    image?: string;
    description?: string;
    category: string;
}
export interface IModuleComment {
    userId:string;
    moduleId: string;
    comment:string;
    time:any;
}
export interface IModuleresponse {
    userId:string;
    moduleId: string;
    commentId:string;
    comment:string;
    time:any;
}

export interface IValComment {
    
    moduleId: string;
    commentId:string;
    
}

export interface ICourseDetails {
    title: string;
    id:string;
    image?: string;
    description?: string;
    category: string;
    sections: Array<any>
}


export interface ICreateSection {
    title: string;
    description?:string;
    courseId:string;
}

export interface IUpdateSection {
    title: string;
    description?:string;
    courseId:string;
    sectionId:string;
}

export interface ICreateModule {
    title: string;
    description:string;
    courseId:string;
    sectionId:string;
    filePath?:FormData| null;
    content:string ;
    quizContent:string ;
    type:string;
    conditions:{
        type: conditionsTypes,
        conditionValue: string
    },
    accessConditions:{
        type: accessConditionsTypes,
        conditionValue: string,
    },
}

export interface IUpdateModule {
    moduleId:string;
    title: string;
    description:string;
    filePath?:string | null;
    content?:string | null;
    quizContent?:string | null | Record<string, unknown>;
    type?:string;
    conditions:{
        type: string,
        conditionValue: string
    },
    accessConditions:{
        type: string,
        conditionValue: string
    },
}


export interface ICreateInteraction {
    courseId: string;
    daysAfter:number,
    hourOfTheDay:number,
    minuteOfTheDay:number,
    title:string;
    nodes:Array<any>;
    edges:Array<any>;
}

export interface IUpdateInteraction {
    courseId: string;
    interactionId: string;
    daysAfter?:number,
    hourOfTheDay?:number,
    minuteOfTheDay?:number,
    title?:string,
    nodes?:Array<any>;
    edges?:Array<any>;
}
