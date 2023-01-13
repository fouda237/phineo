import clsx from "clsx";
import React from 'react';

interface IButton {
    label?: string;
    action?: () => void;
    className?:string;
    type?:"button" | "submit" | "reset" | undefined;
}

const Button = ({label, action, className, type}: IButton) => {
    return (
        <button className="btn p-3 lh-24 pl-5 pr-5 ls-3 d-inline-block rounded-xl bg-current font-xsss fw-500 text-white mt-3"
                onClick={action} type={type}>{label}</button>
    );
};

export {Button};
