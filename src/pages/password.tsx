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

    const onSubmitPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (password.password != password.confirm) {
            toast.error('Les mots de passes sont différents')
            return
        }

        const userUpdatePasswordResponse = await updateUserPassword(user.id, password.password)

        if (userUpdatePasswordResponse && userUpdatePasswordResponse.data) {
            setChangePassword(!changePassword)
            setPassword({password: "",confirm: ""})
            toast.success("Mot de passe mis à jour correctement")
        } else {
            toast.error('Une erreur est survenue')
        }
    };

    React.useEffect(() => {
        setUser(authContext.authState.user)
        createViewLog('change-password')
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
                        Modifier mon Mot de Passe
                      </h4>
                    </div>
                    <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                    
                      <form onSubmit={onSubmitPassword}>
                        <div className="row">
                          <div className="col-lg-12 mb-1">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Nouveau Mot de Passe
                              </label>
                              <input 
                                type="password" 
                                className="form-control" 
                                value={password.password}
                                onChange={(e) => setPassword({ ...password, password: e.target.value })}
                                required={true}
                              />
                            </div>
                          </div>

                          <div className="col-lg-12 mb-3">
                            <div className="form-group">
                              <label className="mont-font fw-600 font-xsss">
                                Confirmer le Nouveau Mot de Passe
                              </label>
                              <input 
                                type="password" 
                                className="form-control" 
                                value={password.confirm}
                                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                required={true}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-12">
                            <button
                                type="submit"
                                className="bg-skype text-center text-white font-xsss fw-600 p-3 w400 rounded-lg d-inline-block"
                            >
                              Valider mon Nouveau Mot de Passe
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            {/* 
            <section>
                <div className={"flex flex-col max-w-xl mx-auto"}>
                    {!changePassword ?
                        <form onSubmit={onSubmit}>
                            <div className={'mt-3 flex flex-col'}>
                                <label className={'mt-4'}>Prénom :</label>
                                <input placeholder="Prénom" value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    required={true}
                                    className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'} />
                                <label className={'mt-4'}>Nom :</label>
                                <input placeholder="Nom" value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    required={true}
                                    className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'} />
                                <label className={'mt-4'}>Email :</label>
                                <input placeholder="Rôle" value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    required={true}
                                    readOnly={true}
                                    className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'} />
                                <div className="flex justify-center mt-10">
                                    <Button label={"Mettre à jour"} />
                                </div>
                            </div>
                        </form>
                        :
                        <form onSubmit={onSubmitPassword}>
                            <div className={'mt-3 flex flex-col'}>
                                <label className={'mt-4'}>Mot de passe :</label>
                                <input placeholder="Mot de passe..." value={password.password}
                                    onChange={(e) => setPassword({ ...password, password: e.target.value })}
                                    required={true}
                                    className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'} />
                                <label className={'mt-4'}>Confirmer le mot de passe :</label>
                                <input placeholder="Confirmer le mot de passe..." value={password.confirm}
                                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                    required={true}
                                    className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'} />
                                <div className="flex justify-center mt-10">
                                    <Button label={"Valider"} />
                                </div>
                            </div>
                        </form>
                    }
                    <div className="flex justify-center mt-10">
                        <Button label={changePassword ? "Annuler" : "Modifier le mot de passe"} action={() => setChangePassword(!changePassword)}/>
                    </div>
                </div>
            </section>
            */}

        </AdminLayout>
    );
};

export default Account;
