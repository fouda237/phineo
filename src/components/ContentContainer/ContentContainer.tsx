import clsx from 'clsx';
import React, {ReactChild} from 'react';

interface IContentContainer {
    children: ReactChild | ReactChild[];
    className?: string;
}

const ContentContainer = ({children, className}: IContentContainer) => {
    return (
        <section className={clsx('main-container w-full min-h-screen transition-all', className)}>
            {children}
        </section>
    );
};

export {ContentContainer};
