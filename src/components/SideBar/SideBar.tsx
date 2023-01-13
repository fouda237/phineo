import "./SideBar.scss"

import {useCourseContext} from "../../context";

import clsx from 'clsx';
import {Button, Container} from 'components';
import {useAppStateContext} from 'context/AppStateContext';
import React, {ReactElement} from 'react'
import {FcBookmark} from "react-icons/fc"
import {RiMenuUnfoldFill} from "react-icons/ri"
import {useNavigate, useParams} from "react-router-dom";

interface ISidebarLink {
    children: ReactElement | ReactElement[];
    expended?: boolean;
    link: string;
    id?: string;

}


interface ISidebarLabelLink {
    children: string;
}


const SideBar = () => {
    const appStateContext = useAppStateContext();
    const navigate = useNavigate();
    const courseContext = useCourseContext();
    const [hover, setHover] = React.useState(false);
    const params = useParams();

    const _shouldContentRender = () => {
        return appStateContext.contentExtended || hover;
    }

    function SidebarLink({children, expended, link, id}: ISidebarLink) {
        const navigate = useNavigate();

        return <li
            className={clsx("text-left flex flex-row items-center w-full  transition-all rounded-md cursor-pointer",
                expended && "px-3 py-1",
                !expended && "justify-center",
                "hover:bg-gray-800",
                params.sectionId === id && 'bg-gray-800'
            )}
            onClick={() => navigate(link)}
        >

            {children}
        </li>;
    }

    function SidebarLabelLink({children}: ISidebarLabelLink) {
        return <span className={"font-light ml-4"}>
                            {children}
                        </span>;
    }


    const contentSideBar = () => {
        console.log(appStateContext);
        return (
            <>
                {
                    courseContext.currentCourse.sections.map((section: any, key:number) => {
                        return (
                            <span key={key}>
                                <SidebarLink expended={_shouldContentRender()}
                                             link={`/LMS/course/${courseContext.currentCourse.id}/section/${section.id}`}
                                             id={section.id}
                                >
                                    <FcBookmark/>
                                    {
                                        _shouldContentRender() ?
                                            <SidebarLabelLink>{section.title}</SidebarLabelLink> : <></>
                                    }
                                </SidebarLink>
                                <ul className={"w-full pl-8"}>
                                    {
                                        section.modules.map((module: any, key: number) => {
                                            if (_shouldContentRender()) {
                                                return (
                                                    <li
                                                        key={key}
                                                        className={clsx("p-2 rounded-lg font-light text-sm text-left w-full cursor-pointer hover:bg-gray-800", params.moduleId === module.id && 'bg-gray-800')}
                                                        onClick={() => navigate(`/LMS/course/${courseContext.currentCourse.id}/section/${section.id}/module/${module.id}`)}>
                                                        {module.title}
                                                    </li>)
                                            }
                                        })
                                    }
                                </ul>
                            </span>
                        )
                    })
                }
            </>
        )
    }


    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={clsx('left-0 absolute flex flex-col items-center justify-center transition-all z-50', _shouldContentRender() ? 'w-64' : 'w-14')}>
            <aside
                className={clsx('admin-sidebar min-h-full bg-stone-900 w-11/12 rounded-2xl p-3 flex flex-col space-y-6 transition-all ', (hover && !appStateContext.contentExtended) && 'bg-stone-900/80')}>
                <header className={"flex items-center justify-between text-dark text-2xl"}>
                    {
                        _shouldContentRender() &&
                        <h1 onClick={() => navigate(`/LMS/course/${courseContext.currentCourse.id}`)}
                            className={"cursor-pointer"}>{courseContext.currentCourse.title}</h1>
                    }
                    <span className={'cursor-pointer'} onClick={() => appStateContext.handleContentExtended()}>
                    <RiMenuUnfoldFill/>
                </span>
                </header>
                <Container>
                    <ul className={'w-full flex flex-col items-center justify-center space-y-6 text-dark '}>
                        {
                            contentSideBar()
                        }
                    </ul>
                </Container>
            </aside>
        </div>
    );
};

export {SideBar};
