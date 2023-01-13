export interface IRegister{
    username:string;
    email:string;
    password:string;
}

export interface ILogin{
    email:string;
    password:string;
}

export interface IEmrysLogin{
    code:string;
}

export interface IForgot{
    email:string;
}
