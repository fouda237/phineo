import axios from "axios";
import {IRegister, ILogin, IForgot, IEmrysLogin} from "types/auth.types";
import { getCoursesNTeachers } from '../services/course.service'


const register = ({username, email, password}: IRegister) => {
    return axios.post(`${process.env.API_URL}/register`, {
        username,
        email,
        password,
    });
};


const login = ({email, password}: ILogin) => {
    return axios
        .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
            email,
            password,
        })
        .then((response) => {
            if (response.data?.user) {
                console.log("EMAIL"+email);
                localStorage.setItem("user", JSON.stringify(response.data));
                getCoursesNTeachers().then(responseIL => {
                    if (responseIL) {
                        localStorage.setItem('interractionsList', JSON.stringify(responseIL.data));
                    }
                });
            }
            return response;
        }).catch((error) => {
            return error.response.data.message;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
};

const getCurrentUser = () => {
    return localStorage.getItem("user");
};

const getCurrentUserAndUpdateStorage = async () => {
    const user = localStorage.getItem("user");
    if(!user) return;
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/users/${JSON.parse(user).user.id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
            }
        }).then((response) => {
            if (response.data) {
                const updatedUser = {
                    tokens: JSON.parse(user).tokens,
                    user: response.data
                }
                localStorage.setItem("user", JSON.stringify(updatedUser));
                getCoursesNTeachers().then(responseIL => {
                    if (responseIL) {
                        localStorage.setItem('interractionsList', JSON.stringify(responseIL.data));
                    }
                });
            }
            return response;
        }).catch((error) => {
            return error.response.data.message;
        });
    } catch (e) {
        console.log(e);
    }
};

const checkTokenValidity = () => {
    return true
}

const verifyEmail = (token: string, password: string) => {
    return axios
        .post(`${process.env.REACT_APP_API_URL}/auth/verify-email?token=${token}`, {password: password})
        .then((response) => {
            return response;
        }).catch((error) => {
            return error;
        });
}


const forgotPassword = ({email}: IForgot) => {
    return axios
        .post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
            email,
        })
        .then((response) => {
            return response;
        }).catch((error) => {
            return error.response.data.message;
        });
};

const recoveryPassword = (token: string, password: string) => {
    return axios
        .post(`${process.env.REACT_APP_API_URL}/auth/reset-password?token=${token}`, {password: password})
        .then((response) => {
            return response;
        }).catch((error) => {
            return error;
        });
}

const Emryslogin = ({code}: IEmrysLogin) => {
    return axios
        .post(`${process.env.REACT_APP_API_URL}/auth/emrys-login`, {
            code,
        })
        .then((response) => {
            if (response.data?.user) {
                localStorage.setItem("user", JSON.stringify(response.data));
                getCoursesNTeachers().then(responseIL => {
                    if (responseIL) {
                        localStorage.setItem('interractionsList', JSON.stringify(responseIL.data));
                    }
                });
            }
            return response;
        }).catch((error) => {
            return error.response.data.message;
        });
};



export default {
    register,
    login,
    logout,
    getCurrentUser,
    getCurrentUserAndUpdateStorage,
    checkTokenValidity,
    verifyEmail, 
    forgotPassword,
    recoveryPassword,
    Emryslogin
};
