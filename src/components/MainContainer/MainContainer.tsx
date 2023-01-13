import clsx from 'clsx';
import React, { ReactChild } from 'react';
import './MainContainer.scss'

interface IMainContainer {
    children:ReactChild | ReactChild[];
    className?:string;
}

const MainContainer = ({children, className}:IMainContainer) => {
    return (
        <main className={clsx('main-container',className )}>
            {children}
        </main>
    );
};

export {MainContainer};
