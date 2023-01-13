import {AxiosResponse} from 'axios';
import React, {createContext, useContext} from 'react';
import authService from "services/auth.service"
import {IEmrysLogin, ILogin, IRegister} from 'types/auth.types';

interface AuthContextType {
    authState: {
        isConnected: boolean;
        isLoading: boolean;
        isInitialized:boolean;
        error: boolean;
        errorMessage: string,
        access: {
            token: string
            expires: string
        };
        refresh: {
            token: string
            expires: string
        };
        user: {
            role: string,
            email: string,
            firstName: string,
            id: string,
            lastName: string,
        }
    }
    login: ({email, password}: ILogin) => void
    emryslogin: ({code}: IEmrysLogin) => void
    updateUserInformation: () => void
    register: ({username, email, password}: IRegister) => Promise<AxiosResponse<any, any>>
    logout: () => void
    checkTokenValidity: () => boolean
}

const initialState = {
    isConnected: false,
    isLoading: false,
    error: false,
    errorMessage: "",
    isInitialized: false,
    user: {
        role: "",
        email: "",
        firstName: "",
        id: "",
        lastName: "",
    },
    access: {
        token: '',
        expires: ''
    },
    refresh: {
        token: '',
        expires: ''
    },
}

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({children}: { children: JSX.Element }): JSX.Element => {
    const [authState, setAuthState] = React.useState(initialState)


    React.useEffect(() => {
        const user = authService.getCurrentUser();
        if(user){
            setAuthState({
                ...authState,
                error: false,
                errorMessage: "",
                isConnected: true,
                isInitialized: true,
                ...JSON.parse(user)
            })
        }
        else {
            setAuthState({
                ...authState,
                isInitialized:true
            })
        }
    }, [])

    const login = async ({email, password}: ILogin) => {
        setAuthState({
            ...authState,
            isLoading: true
        })
        try {
            const loginData = await authService.login({email, password})
            if (loginData.data?.user) {
                setAuthState({
                    ...authState,
                    error: false,
                    errorMessage: "",
                    isConnected: true,
                    isInitialized:true,
                    ...loginData.data
                })
            } else {
                console.log(loginData)
                setAuthState({
                    ...authState,
                    error: true,
                    errorMessage: loginData,
                    isInitialized:true
                })
            }

        } catch (e) {
            console.log("ERROR ===", e)
            setAuthState({
                ...authState,
                error: true,
                errorMessage: "Une erreur est survenue, veuillez réessayer"
            })
        }
    };

    const updateUserInformation = async () => {
        setAuthState({
            ...authState,
            isLoading: true
        })
        try {
            const user = await authService.getCurrentUserAndUpdateStorage()
            if (user.data) {
                setAuthState({
                    ...authState,
                    error: false,
                    errorMessage: "",
                    isConnected: true,
                    isInitialized:true,
                    ...user.data
                })
            } else {
                setAuthState({
                    ...authState,
                    error: true,
                    errorMessage: user,
                    isInitialized:true
                })
            }

        } catch (e) {
            console.log("ERROR ===", e)
            setAuthState({
                ...authState,
                error: true,
                errorMessage: "Une erreur est survenue, veuillez réessayer"
            })
        }
    };

    const register = ({username, email, password}: IRegister) => authService.register({username, email, password});

    const logout = () => authService.logout();

    const checkTokenValidity = () => authService.checkTokenValidity();



    const emryslogin = async ({code}: IEmrysLogin) => {
        setAuthState({
            ...authState,
            isLoading: true
        })
        try {
            const loginData = await authService.Emryslogin({code})
            if (loginData.data?.user) {
                setAuthState({
                    ...authState,
                    error: false,
                    errorMessage: "",
                    isConnected: true,
                    isInitialized:true,
                    ...loginData.data
                })
            } else {
                setAuthState({
                    ...authState,
                    error: true,
                    errorMessage: loginData,
                    isInitialized:true
                })
            }

        } catch (e) {
            console.log("ERROR ===", e)
            setAuthState({
                ...authState,
                error: true,
                errorMessage: "Une erreur est survenue, veuillez réessayer"
            })
        }
    };


    return (
        <AuthContext.Provider
            value={{
                authState,
                login,
                updateUserInformation,
                register,
                logout,
                checkTokenValidity,
                emryslogin,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuthContext = (): AuthContextType => {
    return useContext(AuthContext);
};

export {AuthProvider, useAuthContext};
