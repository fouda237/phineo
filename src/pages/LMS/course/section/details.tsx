import {AdminLayout} from 'layouts';
import React, {FormEvent} from 'react';
import Icon from "assets/images/courses.png"
import clsx from 'clsx';
import {useAppStateContext, useCourseContext} from 'context';
import {AdminSideBar, Button, SideBar} from "components";
import {getSectionDetails, updateSection} from "services/course.service";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";


const SectionDetails = () => {
    const [sectionData, setSectionData] = React.useState({
        title: "",
        description: ""
    })
    const appStateContext = useAppStateContext();
    const courseContext = useCourseContext();
    const navigate = useNavigate();
    const params = useParams();

    React.useEffect(() => {
        if (!params) return;
        getSectionDetails(`${params.courseId}`, `${params.sectionId}`).then(response => {
            if (response) {
                setSectionData(response.data)
            }
        })
    }, [params])


    React.useEffect(() => {
        if (!params) return;
        courseContext.getCurrentCourse(params.courseId);
    }, [])



    if (!courseContext.currentCourse) return <h1>Loading...</h1>

    return (
        <AdminLayout>
            <section>
                <div className={"flex space-x-3 items-center "}>
                    <img src={Icon} alt={"icon"} className={"w-9"}/>
                    <h3 className={"text-gray-500"}>${courseContext.currentCourse.title}</h3>
                </div>
                <hr className={"my-6"}/>
                <section
                    className={clsx("course-module-container w-full relative transition-all", appStateContext.contentExtended ? "pl-64" : "pl-16")}>
                    <div className={"flex flex-col max-w-xl mx-auto"}>
                        <SideBar/>
                            <div className={'mt-3 flex flex-col space-y-4'}>
                                <div className={'mt-3 flex flex-col space-y-4'}>
                                    <h1>{sectionData.title}</h1>
                                    <p>{sectionData.description}</p>
                                    </div>
                            </div>

                    </div>

                </section>
            </section>
        </AdminLayout>
    );
};

export default SectionDetails;

