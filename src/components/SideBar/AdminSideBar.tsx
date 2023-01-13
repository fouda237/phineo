import "./SideBar.scss";

import { useCourseContext } from "../../context";

import { Button } from 'components';
import { SectionsDraggable } from 'components/DraggableComponent/sectionsDraggable';
import { useNavigate } from "react-router-dom";


const AdminSideBar = () => {
    const navigate = useNavigate();
    const courseContext = useCourseContext();

    return (
        <>
            {courseContext.currentCourse.sections.length > 0 && (
                <a
                href={`/admin/course/${courseContext.currentCourse.id}/section`}
                className="mt-0 p-0 btn p-3 pr-4 pl-4 lh-24 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-500 ls-lg text-white mb-4"
                >
                    <i className="feather-plus mr-1"></i> Créer une Nouvelle Section
                </a>
            )}
            
            <SectionsDraggable />

            <a
            href={`/admin/course/${courseContext.currentCourse.id}/section`}
            className="mt-0 p-0 btn p-3 pr-4 pl-4 lh-24 ls-3 d-inline-block rounded-xl bg-skype font-xsss fw-500 ls-lg text-white"
            >
                <i className="feather-plus mr-1"></i> Créer une Nouvelle Section
            </a>
        </>
    );
};

export { AdminSideBar };
