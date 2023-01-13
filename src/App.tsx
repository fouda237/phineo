import { getCoursesNTeachers } from './services/course.service'

import { useAuthContext } from 'context';
import { cpSync } from 'fs';
import React from 'react';
import OneSignal from 'react-onesignal';
import {ToastContainer} from 'react-toastify';
import Router from 'router/Router';

function App() {
    const authContext = useAuthContext();

    React.useEffect(() => {
        if (localStorage.user){
            const userDatas = JSON.parse(localStorage.user);

            // Filtre user admin a enlevé dès que c'est ok 
            // ! \\ -- ANTICIPER AUSSI LE DOUBLE APP ID EMRYS 

            if (userDatas.user && userDatas.user.role === 'admin') {
                OneSignal.init({ appId: '237c6336-acf3-4c83-9e9b-3d7ee0d72bff' });
                OneSignal.setExternalUserId(userDatas.user.id);
                OneSignal.sendTags({
                    userId: userDatas.user.id, 
                    userEmail: userDatas.user.email, 
                    userFirstName: userDatas.user.firstName, 
                    userLastName: userDatas.user.lastName
                });
            }
        }

        getCoursesNTeachers().then(response => {
            if (response) {
                localStorage.setItem('interractionsList', JSON.stringify(response.data));
            }
        });
    }, [])
    
    if (localStorage.user){
        const userDatas = JSON.parse(localStorage.user);
        if (userDatas.user.role === "emrys") {
            document.title = 'La Formation Enchantée by WAB';
        } else {
            document.title = 'WAB - La Plateforme de Formation'
        }
    } else if (window.location.host === 'laformationenchantee.WAB.co') {
        document.title = 'La Formation Enchantée by WAB'
    } else {
        document.title = 'WAB - La Plateforme de Formation'
    }


    return (
        <>
            <Router/>
            <ToastContainer/>
        </>

    );
}

export default App;
