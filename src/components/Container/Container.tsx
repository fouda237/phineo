import clsx from 'clsx';
import React, { ReactChild } from 'react';


interface IContainer {
    children:ReactChild | ReactChild[];
    className?:string;
}

const Container = ({children, className}:IContainer) => {
    return (
        <div className={clsx(className)}>
            {children}
        </div>
    );
};

export {Container};
