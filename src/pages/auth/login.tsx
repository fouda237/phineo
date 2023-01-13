
import WAB1 from '../../assets/images/logo_wab.png';
import {useAuthContext} from 'context';
import {redirectByRoleHooks} from "hooks/redirectByRole/RedirectByRole"
import React, { Fragment } from 'react';
import {Spinner} from "react-activity";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

interface Inputs {
    login: string,
    password: string,
};

const Login = () => {

    const navigate = useNavigate();
    const authContext = useAuthContext();
    const {register, handleSubmit, watch, formState: {errors}} = useForm<Inputs>();
    const onSubmit = handleSubmit(data => authContext.login({email: data.login, password: data.password}));
    const {redirectByRole} = redirectByRoleHooks();

    React.useEffect(() => {
        if (authContext.authState.isConnected) {
            redirectByRole(authContext.authState.user.role)
        }
    }, [authContext.authState.isConnected, authContext.authState.user.role])



    if ((window.location.host === 'laformationenchantee.wab.co')){
        return(
            <Fragment>
                <div className="main-wrap">
                    <div className="row">  
                    <div className="col-xl-12 vh-lg-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                        <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                        <div className="card-body rounded-0 text-left">
                            <img src={WAB1} className="logo mb-3"/>
                            <h2 className="fw-700 font-md text-center mb-4 mt-3">
                                Bienvenue sur <br /> La Formation Enchantée !
                            </h2>

                            <div className="form-group mb-1 mt-2">
                                <a
                                    href={`${process.env.REACT_APP_PROD_DOMAIN_EMRYS}oauth/authorize?response_type=code&scope[]=profile&client_id=${process.env.REACT_APP_CLIENT_ID}`}
                                    className="form-control text-center style2-input text-white rounded-xl fw-600 bg-emrys border-0 p-0"
                                >
                                    Me Connecter avec mon Compte Emrys
                                </a>
                            </div>

                            <div className="col-sm-12 p-0 text-center">
                                <img src={WAB1} className='logo mt-5 mb-0 w300' />
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </Fragment>
        )
    } else { 
        return (
            <Fragment>
                <div className="main-wrap">
                    <div className="row">  
                    <div className="col-xl-12 vh-lg-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                        <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                        <div className="card-body rounded-0 text-left">
                            <img src={WAB1} className="logo mb-3"/>
                            <h2 className="fw-700 text-center mb-4">
                            Bienvenue sur wab
                            </h2>
                                {errors.login && <span>Le username ou l'email est obligatoire</span>}
                                {errors.password && <span>Le mot de passe est obligatoire</span>}
                                {authContext.authState.error && <span className='text-red fw-600'>{authContext.authState.errorMessage}</span>}
                            <form onSubmit={onSubmit}>
                                <div className="form-group icon-input mb-2">
                                    <i className="font-sm ti-email text-grey-500 pr-0"></i>
                                    <input
                                    type="text"
                                    className="style2-input pl-5 form-control text-grey-900 font-xssss fw-600"
                                    placeholder="Votre Adresse Email"
                                    {...register("login", {required: true})}
                                    />
                                </div>
                                <div className="form-group icon-input mb-3">
                                    <input
                                    type="Password"
                                    className="style2-input pl-5 form-control text-grey-900 font-xssss ls-3"
                                    placeholder="Votre Mot de Passe"
                                    {...register("password", {required: true})}
                                    />
                                    <i className="font-sm ti-lock text-grey-500 pr-0"></i>
                                </div>
        
                                <div className="col-sm-12 p-0 text-left">
                                <div className="form-group mb-1">
                                    <button
                                        type="submit"
                                        className="form-control text-center style2-input text-white bg-skype fw-600   border-0 p-0"
                                        
                                    >
                                        {authContext.authState.isLoading ? <Spinner style={{ margin: 'auto' }}/> :  'Se Connecter'}
                                    </button>
                                </div>
                                <a
                                    href="/password-lost"
                                    className="fw-600 font-xssss text-grey-700 mt-1 float-right"
                                    >
                                    Mot de passe oublié ? 
                                    </a>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </Fragment>
        );
    }   
};

export {Login};
