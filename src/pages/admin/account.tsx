import wab from '../../assets/images/wab_formation.jpg'
import { Button } from "../../components";
import authService from '../../services/auth.service';

import { useAuthContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUser, updateUserPassword } from 'services/user.service';
import {createViewLog} from "services/user.service";
import { IUser } from 'types/user.types';

interface Inputs {
    firstName: string,
    lastName: string,
    email?: string,
    role?: string
}

const Account = () => {

    const authContext = useAuthContext();
    const [user, setUser] = React.useState<IUser>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    });
    const [password, setPassword] = useState({
        password: "",
        confirm: ""
    })
    const [changePassword, setChangePassword] = useState(false)
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userUpdateResponse = await updateUser({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        })

        if (userUpdateResponse && userUpdateResponse.data) {
            await authContext.updateUserInformation()
            window.location.reload()
            toast.success("Utilisateur mis à jour correctement")
        } else {
            toast.error('Une erreur est survenue')
        }
    };

    React.useEffect(() => {
        setUser(authContext.authState.user)
        createViewLog('account')
    }, [authContext])

    return (
        <AdminLayout>
            <div className="middle-sidebar-left">
                <div className="middle-wrap">
                  <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                    <div className="card-body p-4 w-100 bg-skype border-0 d-flex rounded-lg">
                      <Link
                        to="/parametres"
                        className="d-inline-block mt-2"
                      >
                        <i className="ti-arrow-left font-sm text-white"></i>
                      </Link>
                      <h4 className="font-xs text-white fw-600 ml-4 mb-0 mt-2">
                        Mes Informations Personnelles
                      </h4>
                    </div>
                    <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                      <div className="row justify-content-center">
                        <div className="col-lg-4 text-center">
                          <figure className="avatar ml-auto mr-auto mb-0 mt-0 w100">
                            <img
                              src={wab}
                              alt="avater"
                              className="shadow-sm rounded-lg w-100"
                            />
                          </figure>
                          <h2 className="fw-700 font-sm text-grey-900 mt-3 mb-4">
                          {authContext.authState.user.firstName} {authContext.authState.user.lastName}
                          </h2>
                        </div>
                      </div>


                      <form onSubmit={onSubmit}>
                        <div className="row">
                          <div className="col-lg-6 mb-1">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Mon Prénom
                              </label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={user.firstName}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                required={true}
                                placeholder="Entrez votre Prénom ici"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mb-1">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Mon Nom
                              </label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={user.lastName}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                required={true}
                                placeholder="Entrez votre Nom ici"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-12 mb-1">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Mon Email
                              </label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                required={true}
                                readOnly={true}
                                placeholder="Entrez votre Mail ici"
                              />
                            </div>
                          </div>

{/* 

                          <div className="col-lg-12 mb-3">
                            <div className="card border-0">
                              <div className="card-body d-flex justify-content-between align-items-end p-0">
                                <div className="form-group mb-0 w-100">
                                    <label className="mont-font fw-600 font-xsss">
                                        Ma Photo de Profil
                                    </label>
                                  <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className="input-file"
                                  />
                                  <label
                                    htmlFor="file"
                                    className="rounded-lg text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed"
                                    style={{ lineHeight: '25px'}}
                                  >
                                    <i className="ti-cloud-down large-wab mr-3 d-block mb-3"></i>
                                    <span className="js-fileName">
                                      Glissez et Déposez votre Nouvelle image ici ou Cliquez simplement ici <br />Format carré recommandé
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          */}

                          <div className="col-lg-12">
                            <button
                                type="submit"
                                className="bg-skype text-center text-white font-xsss fw-600 p-3 w300 rounded-lg d-inline-block"
                            >
                              Valider mes Modifications
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

        </AdminLayout>
    );
};

export default Account;
