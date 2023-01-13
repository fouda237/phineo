import background from '../../assets/images/bg_register.png'

import WAB1 from '../../assets/images/logo_wab.png'
import { useAppStateContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import {routes} from 'router/routes';
import authService from "services/auth.service"
import { createEmrysUser } from 'services/user.service';

interface Inputs {
    email: string,
    firstName: string,
    lastName: string
}

const PasswordForgot = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const onSubmit = handleSubmit(async (data) => {
        const forgot = await authService.forgotPassword({ email: data.email })
        

        if (forgot && forgot.status === 204) {
            setError('');
            setIsRegister(true);
        } 

        if (forgot === "No users found with this email") {
            setError("Aucun Utilisateur n'appartient à ce Mail !")
        }
    });

    return (
        <>
            <Fragment>
                <div className="main-wrap">
                    <div className="row">
                        
                        {!isRegister ? (
                            <div className="col-xl-12 vh-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                                <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                                    <div className="card-body rounded-0 text-left">
                                        <img src={WAB1} className='logo mb-4' />
                                    <h2 className="fw-700 text-center mb-1">
                                        Mot de Passe Oublié ?
                                    </h2>
                                    <p className='text-center  mb-2'>
                                        Entrez votre adresse mail de connexion :
                                    </p>
                                    <form onSubmit={onSubmit} className="text-center">
                                        {error && (
                                            <span className='text-danger'>{error}</span>
                                        )}
                                        
                                        <div className="form-group icon-input mb-3 mt-2">
                                        <i className="font-sm ti-email text-grey-500 pr-0"></i>
                                        <input
                                            {...register("email", { required: true })}
                                            type="email"
                                            className="style2-input pl-5 form-control text-grey-900 font-xsss fw-600 mt-2"
                                            placeholder="Votre Adresse Mail *"
                                            required
                                        />
                                        </div>

                                        <div className="col-sm-12 p-0 text-center">
                                            <div className="form-group mb-1">
                                            <button
                                                type="submit"
                                                className="form-control text-center style2-input text-white fw-600 bg-skype border-0 p-0 "
                                            >
                                                Récupérer mon Mot de Passe !
                                            </button>
                                            </div>

                                            <h6 className="text-grey-500 font-xssss text-center mt-3 fw-500 mt-0 mb-0 lh-32">
                                                Vous vous en souvenez ?{' '}
                                            <a href="/login" className="fw-700 ml-1">
                                                Connectez-vous ici !
                                            </a>
                                            </h6>
                                        </div>

                                    </form>
                                    </div>
                                </div>
                            </div>
                        ) : ( 
                            <div className="col-xl-12 vh-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                                <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                                    <div className="card-body rounded-0 text-left">
                                        <img src={WAB1} className='logo mb-4' />
                                    <h2 className="fw-700 font-xl text-center mb-2">
                                        <i className='feather feather-check mr-3 text-success'/>
                                        Email Envoyé !
                                    </h2>
                                    <p className='text-center  mb-4'>
                                        Un Mail vient de vous être envoyé pour récupérer votre mot de passe !
                                    </p>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Fragment>
        </>
    );
};

export {PasswordForgot};

