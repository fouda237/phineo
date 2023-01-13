import {getCourseDetails, getCourseWab} from "../services/course.service";

import React from 'react';


interface NewCourseContextType {
    currentCourse?: any
    getCurrentCourse?: any
    getCurrentCourseWab?: any
    refreshCurrentCourse?: any
}

const CourseContext = React.createContext({} as NewCourseContextType);

const CourseProvider = ({children}: { children: JSX.Element }): JSX.Element => {
    const [currentCourse, setCurrentCourse] = React.useState<any>();

    const getCurrentCourse = (id: string) => {
        getCourseDetails(`${id}`).then(response => {
            if (response) setCurrentCourse(response.data)
        })
    }


    const getCurrentCourseWab = (id: string) => {
        getCourseWab(`${id}`).then(response => {
            if (response) setCurrentCourse(response.data)
        })
    }

    const refreshCurrentCourse = () => {
        if(!currentCourse) return;
        getCourseDetails(`${currentCourse.id}`).then(response => {
            if (response) setCurrentCourse(response.data)
        })
    }

    return (
        <CourseContext.Provider value={{currentCourse, getCurrentCourse, getCurrentCourseWab, refreshCurrentCourse}}>{children}</CourseContext.Provider>
    );
};

const useCourseContext = (): NewCourseContextType => {
    return React.useContext(CourseContext);
};

export {CourseProvider, useCourseContext};
