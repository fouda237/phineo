import clsx from 'clsx';
import CourseCard from 'components/LMS/CourseCard';
import {AdminLayout} from 'layouts';
import React from 'react';
import { Spinner } from 'react-activity';
import {useNavigate} from 'react-router-dom';
import {getUserCourses} from 'services/user.service';
import {createViewLog} from "services/user.service";


const CourseList = () => {
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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


    React.useEffect(() => {
        getUserCourses().then(response => {
            if (response){
                setCourses(response.data);
                setLoading(false)
            }
        });
        createViewLog('courses')
    }, [])

    if (loading) return (
        <AdminLayout>
            <Spinner />
        </AdminLayout>
    )
    
    return (
        <AdminLayout>
            <div className='row'>
                <div className='col-md-12'>
                    <h2 className="fw-400 font-lg mb-3">
                        Mes <b>Formations</b>
                    </h2>
                </div>

                {courses.length > 0 ?
                    courses.map((course: { id: string, title:string, description:string, image:string}, key: number) => {
                        return (
                            <CourseCard value={course} />
                        )
                    })
                    :
                    <p className="text-black leading-none">Vous n'êtes inscris à aucune formation</p>
                }
                    
            </div>
        </AdminLayout>
    );
};

export default CourseList;
