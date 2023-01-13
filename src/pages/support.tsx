import { Button } from "../components";
import {supportEmail} from '../services/user.service'

import { useAuthContext } from "context";
import { AdminLayout } from 'layouts';
import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {createViewLog} from "services/user.service";

interface Inputs {
    email: string,
    firstName: string,
    message: string
}

const Support = () => {
  const authContext = useAuthContext()
  const userDatas = JSON.parse(localStorage.user);

  React.useEffect(() => {
    createViewLog('support-administration')
}, [])

  // IMPORT CHAYALL
  if (window.location.host === 'laformationenchantee.Wab.co') {
    const script = document.createElement('script');
    script.src = 'https://widgets.greenbureau.com/js/chayall.js';
    script.async = true;
    script.defer = true;
    script.type = 'text/javascript';
    script.setAttribute('data-chayall-account', '802d967d-0f73-45de-9347-348dfa40201e');
    document.body.appendChild(script);
  }


    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [isSend, setIsSend] = useState(false);
    const [error, setError] = useState(false);
    const onSubmit = handleSubmit(async (data) => {
      const supportMessage = await supportEmail({
          email: data.email,
          firstName: data.firstName,
          message: data.message,
          userId: authContext.authState.user.id
      })

      if (supportMessage && supportMessage.status === 204) {
          setError(false);
          setIsSend(true);
      } else if (supportMessage && supportMessage.status > 400) {
          setError(true);
      }
    });


    return (
        <AdminLayout>
            
        <div className="map-wrapper pt-lg--8 pt-5 pb-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="contact-wrap card bg-white shadow-lg rounded-lg position-relative top-0">
                  <h1 className="text-grey-900 fw-700 display1-size mb-2 lh-1">
                    Contactez {userDatas.user.role === "emrys" ? 'La Formation Enchantée' : "l'Administration Wab"}
                  </h1>
                  <p className="text-grey-600 mb-4 font-xsss lh-4">
                      Vous avez une question sur le fonctionnement de la plateforme ? Nous avons les réponses ! <br />
                      Pour tout ce qui concerne le fonctionnement de votre espace {userDatas.user.role === "emrys" ? 'La Formation Enchantée' : "Wab"} c'est ici que ça se passe !
                  </p>
                  {!isSend ? (
                    <form onSubmit={onSubmit}>
                      <div className="row">
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group mb-3">
                            <input
                              {...register("firstName", { required: true })}
                              type="text"
                              className="form-control style2-input bg-color-none text-grey-700"
                              placeholder="Votre Nom *"
                              value={authContext.authState.user.firstName + ' ' + authContext.authState.user.lastName}
                              readOnly
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                          <div className="form-group mb-3">
                            <input
                              {...register("email", { required: true })}
                              type="text"
                              className="form-control style2-input bg-color-none text-grey-700"
                              placeholder="Votre Email *"
                              value={authContext.authState.user.email}
                              readOnly
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group mb-3 md-mb-2">
                            <textarea 
                              {...register("message", { required: true })}
                              className="w-100 h125 style2-textarea p-3 form-control"
                              placeholder="Écrivez Votre Message ici *"
                              required
                              minLength={20}
                            >
                              
                            </textarea>
                          </div>
                          {error && (
                            <p className="text-danger">Un Problème est arrivé, merci de réessayer dans quelques instants ...</p>
                          )}
                          <div className="form-group">
                            <button
                              type="submit"
                              className="rounded-lg style1-input float-left bg-skype text-white text-center font-xss fw-500 border-2 border-0 p-0 w250"
                            >
                              Envoyer mon Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <h2>
                      <i className='feather feather-check mr-3 text-success'/>
                      Votre Message a bien été envoyé !
                    </h2>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        </AdminLayout>
    );
};

export default Support;
