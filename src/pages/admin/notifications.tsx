import icon from '../../assets/images/wab_formation.jpg'

import { useAuthContext } from 'context';
import { AdminLayout } from 'layouts';
import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import {createViewLog} from "services/user.service";

const Notifications = () => {

    const authContext = useAuthContext();

    React.useEffect(() => {
        createViewLog('notifications')
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
                        Notifications
                      </h4>
                    </div>
                    <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                      <div className="row">
                        <div className="col-md-12">
                            <h2>Gérer mes Notifications</h2>
                            <div className='onesignal-customlink-container'></div>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>

        </AdminLayout>
    );
};

export default Notifications;
