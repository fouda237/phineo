
import authService from "../../services/auth.service";
import WAB1 from '../../assets/images/logo_wab.png';
import clsx from 'clsx';
import { Container, MainContainer } from 'components';
import React, { Fragment, useState } from 'react';
import { Spinner } from "react-activity";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Inputs {
    password: string,
};

const ConfirmEmail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const onSubmit = handleSubmit(data => {
        if (!params) return;
        if (params.token) {
            setIsLoading(true)
            authService.verifyEmail(params.token, data.password).then(response => {
                console.log(response);
                setIsLoading(false)
                if (response && response.status === 204) {
                    toast.success('Votre Compte est bien validé, vous pouvez vous connecter !');
                    navigate("/")
                } else {
                    toast.error('Une erreur est survenue');
                }
            })
        }
    });


    return (
        <Fragment>
          <div className="main-wrap">
            <div className="row">  
              <div className="col-xl-12 vh-lg-100 align-items-center d-flex bg-white rounded-lg overflow-hidden">
                <div className="card shadow-none border-0 ml-auto mr-auto login-card">
                  <div className="card-body rounded-0 text-left">
                    <img src={WAB1} className="logo mb-3"/>
                    <h2 className="fw-700 text-center mb-2">
                      Créez votre Mot de Passe Wab :
                    </h2>
                    <p className="font-xsssss text-center">
                        Doit Contenir min 8 caractères dont au moins 1 lettre et 1 chiffre
                    </p>
                    <form onSubmit={onSubmit}>
                        {errors.password && <span className="text-danger">Le mot de passe est obligatoire</span>}

                        <div className="form-group icon-input mb-2">
                            <i className="font-sm ti-lock text-grey-500 pr-0"></i>
                            <input
                            type="password"
                            className="style2-input pl-5 form-control text-grey-900 font-xssss fw-600"
                            placeholder="Votre Mot de Passe *"
                            minLength={8}
                            {...register("password", {required: true})}
                            />
                        </div>
                        <div className="form-group mb-1">
                            <button
                                type="submit"
                                className="form-control text-center style2-input text-white fw-600 bg-skype border-0 p-0"
                            >
                                {isLoading ? <Spinner style={{ margin: 'auto' }}/> :  'Valider mon Compte'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
    );
};

export { ConfirmEmail };
