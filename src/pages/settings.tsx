import { AdminLayout } from 'layouts';
import React, { Component,FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {createViewLog} from "services/user.service";


const Settings = () => {
  React.useEffect(() => {
      createViewLog('settings')
  }, [])
  
  return (
        <AdminLayout>
          <div className="middle-wrap">
                  <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                    <div className="card-body p-lg-5 p-4 w-100 border-0">
                      <div className="row">
                        <div className="col-lg-12">
                          <h4 className="mb-4 font-lg fw-700 mont-font mb-2">
                            Paramètres
                          </h4>
                          <div className="nav-caption fw-600 font-xssss text-grey-500 mb-2">
                            Mon Compte
                          </div>
                          <ul className="list-inline mb-4">
                            <li className="list-inline-item d-block border-bottom mr-0">
                              <Link
                                to="/parametres/mon-compte"
                                className="pt-2 pb-2 d-flex"
                              >
                                <i className="btn-round-md bg-skype text-white feather-home font-md mr-3"></i>
                                <h4 className="fw-600 font-xssss mb-0 mt-3">
                                  Mes Informations Personnelles
                                </h4>
                                <i className="ti-angle-right font-xsss text-grey-500 ml-auto mt-3"></i>
                              </Link>
                            </li>
                            <li className="list-inline-item d-block  mr-0">
                              <Link to="/parametres/secret" className="pt-2 pb-2 d-flex">
                                <i className="btn-round-md bg-skype text-white feather-lock font-md mr-3"></i>{' '}
                                <h4 className="fw-600 font-xssss mb-0 mt-3">
                                  Modifier mon Mot de Passe
                                </h4>
                                <i className="ti-angle-right font-xsss text-grey-500 ml-auto mt-3"></i>
                              </Link>
                            </li>
                          </ul>
                          <div className="nav-caption fw-600 font-xssss text-grey-500 mb-2">
                            Autres
                          </div>
                          <ul className="list-inline">
                            <li className="list-inline-item d-block mr-0">
                              <a
                                href="/notifications"
                                className="pt-2 pb-2 d-flex"
                              >
                                <i className="btn-round-md bg-gold-gradiant text-white feather-bell font-md mr-3"></i>{' '}
                                <h4 className="fw-600 font-xssss mb-0 mt-3">
                                  Notifications
                                </h4>
                                <i className="ti-angle-right font-xsss text-grey-500 ml-auto mt-3"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </AdminLayout>
    );
};


export default Settings;
