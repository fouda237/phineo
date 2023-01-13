
import WAB1 from '../../assets/images/logo_wab.png'
import {useAuthContext} from 'context';
import {redirectByRoleHooks} from "hooks/redirectByRole/RedirectByRole"
import React, { Fragment } from 'react';
import {Spinner} from "react-activity";
import {useForm} from "react-hook-form";
import { useNavigate } from 'react-router-dom';


const EmrysLogin = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const authContext = useAuthContext();
    const {redirectByRole} = redirectByRoleHooks();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authContext.authState.isConnected) {
            redirectByRole(authContext.authState.user.role)
        }

        if (queryParams.get('code') !== null){
            if ( localStorage.user === undefined ){
                const codeEmrys = queryParams.get('code');
                authContext.emryslogin({code: codeEmrys || ''});
            }
        } else {
            navigate('/')
        }
    }, [authContext.authState.isConnected, authContext.authState.user.role])
    

    return(
        <Fragment>
            <div className="main-wrap">
                <div className="row">  
                <div className="col-xl-12 vh-lg-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                    <div className="card shadow-none border-0 ml-auto mr-auto login-card text-center">
                        <div className="card-body rounded-0 text-center">
                            <img src={WAB1} className="logo mb-5"/>
                            {
                                authContext.authState.error ? (
                                    <>
                                        <p className='text-red fw-600 mb-4'>{authContext.authState.errorMessage}</p>
                                        {
                                            authContext.authState.errorMessage == "Cet Email est déjà utilisé pour un compte Wab.co !" ? (
                                                <a 
                                                href='https://plateforme.Wab.co'
                                                className="form-control rounded-xl text-center style2-input text-white fw-600 bg-primary border-0"
                                                >
                                                    <i className="feather-chevron-right mr-2"></i>

                                                    Connectez-vous sur Wab.co 
                                                </a>
                                            ) : (
                                                <a 
                                                    href='/'
                                                    className="form-control rounded-xl text-center style2-input text-white fw-600 bg-emrys border-0"
                                                >
                                                    <i className="feather-chevron-right mr-2"></i>
        
                                                    Reconnectez-vous ici
                                                </a>
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        <Spinner style={{ margin: '0 auto 7px auto' }}/>
                                        <span>Connexion en cours...</span>
                                    </>

                                )
                            }
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </Fragment>
    );
};

export {EmrysLogin};
