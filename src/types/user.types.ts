export interface IGetUser {
    id: string,
}

export interface ICreateUser {
    email: string,
    firstName: string,
    lastName: string,
    role: string
}

export interface ICreateEmrysUser {
    email: string,
    firstName: string,
    lastName: string, 
    role: string
}

export interface IUserUpdate {
    userId: string,
    firstName?: string,
    lastName?: string,
    role?: string
}


export interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    courses?: Array<any>,
    assignments?:  [string]
}

export interface IUserAssignment {
    beginDate: Date;
    user: IUser;
    progression?: any
}


export interface ITeacher {
    id: string,
    firstName: string,
    lastName: string,
    email: string
}


export interface ISupport {
    userId: string,
    firstName: string,
    email: string,
    message: string,
}


export interface ITeacherSupport {
    userId: string,
    firstName: string,
    email: string,
    message: string,
    teacherId: string,
}


export interface IInscriptionCourse {
    userId: string,
    fullname: string,
    cpf: string,
    file: string,
    temps: string,
    offre: any,
    offre_name: string, 
    offre_description: string, 
    offre_price: number,
    email: string
}

export interface IRemoveAssignment {
    userId: string,
    courseId: string,
}