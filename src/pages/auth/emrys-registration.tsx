import background from '../../assets/images/bg_register.png'
import WAB1 from '../../assets/images/logo_wab.png'
import { useAppStateContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import {routes} from 'router/routes';
import { createEmrysUser } from 'services/user.service';

interface Inputs {
    email: string,
    firstName: string,
    lastName: string
}

const EmrysRegistration = () => {
    const appStateContext = useAppStateContext();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [isRegister, setIsRegister] = useState(false);
    const onSubmit = handleSubmit(async (data) => {
        const userCreatedResponse = await createEmrysUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email, 
            role: 'emrys'
        })

        if (userCreatedResponse && userCreatedResponse.status === 201) {
            setIsRegister(true);
        }
    });

    return (
        <>
            <Fragment>
                <div className="main-wrap">
                    <div className="row">
                        <div
                        className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{
                            backgroundImage: `url("${background}")`,
                        }}
                        ></div>
                        
                        {!isRegister ? (
                            <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                                <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                                    <div className="card-body rounded-0 text-left">
                                        <img src={WAB1} className='logo mb-5' />
                                    <h2 className="fw-700 text-center mb-1">
                                        Créez votre Compte !
                                    </h2>
                                    <p className='text-center  mb-4'>
                                        Et accédez en un Instant à la plateforme !
                                    </p>
                                    <form onSubmit={onSubmit}>
                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-user text-grey-500 pr-0"></i>
                                            <input
                                                {...register("firstName", { required: true })}
                                                type="text"
                                                className="style2-input pl-5 form-control text-grey-900 font-xsss fw-600"
                                                placeholder="Votre Prénom *"
                                                required
                                            />
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-user text-grey-500 pr-0"></i>
                                            <input
                                                {...register("lastName", { required: true })}
                                                type="text"
                                                className="style2-input pl-5 form-control text-grey-900 font-xsss fw-600"
                                                placeholder="Votre Nom *"
                                                required
                                            />
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                        <i className="font-sm ti-email text-grey-500 pr-0"></i>
                                        <input
                                            {...register("email", { required: true })}
                                            type="email"
                                            className="style2-input pl-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Votre Adresse Mail Emrys *"
                                            required
                                        />
                                        </div>

                                        <div className="col-sm-12 p-0 text-center">
                                            <div className="form-group mb-1">
                                            <button
                                                type="submit"
                                                className="form-control text-center style2-input text-white fw-600 bg-skype border-0 p-0 "
                                            >
                                                S'Inscrire !
                                            </button>
                                            </div>

                                            <img src={WAB1} className='logo mt-3 mb-0 w300' />
                                            <h6 className="text-grey-500 font-xssss text-center mt-1 fw-500 mt-0 mb-0 lh-32">
                                                Déjà un compte ?{' '}
                                            <a href="/login" className="fw-700 ml-1">
                                                Me connecter ici
                                            </a>
                                            </h6>
                                        </div>

                                    </form>
                                    </div>
                                </div>
                            </div>
                        ) : ( 
                            <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                                <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                                    <div className="card-body rounded-0 text-left">
                                        <img src={WAB1} className='logo mb-5' />
                                    <h2 className="fw-700 font-xl text-center mt-4 mb-2">
                                        <i className='feather feather-check mr-3 text-success'/>
                                        Félicitations !
                                    </h2>
                                    <h2 className="fw-700 font-xs text-center mb-3">
                                        Votre Compte vient d'être créé !
                                    </h2>
                                    <p className='text-center  mb-4'>
                                        Un Mail vient de vous être envoyé pour confirmer votre inscription et accéder directement à la plateforme !
                                    </p>

                                    <div className="col-sm-12 font-xss mt-5 p-0 text-center">
                                        <img src={WAB1} className='logo mt-3 mb-0 w300' />
                                    </div>

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

export {EmrysRegistration};

