import React, { ReactElement } from 'react';
import {BsFillPlusCircleFill} from "react-icons/bs"

interface ICardModule {
    label: string;
    onClick: () => void;
    icon?:ReactElement<any, any>;
}

const CardAddModule = ({label, onClick, icon}: ICardModule) => {
    return (
        <div key={label} className="col-md-3" onClick={() => onClick()}>
            <div
            className={`card mb-4 border-0 pt-4 pb-4 text-center alert-primary align-items-center rounded-10`}
            style={{ cursor: 'pointer' }}
            >
                <i
                    className={`feather-${icon} psor text-white btn-round-md font-md bg-skype mb-1`}
                ></i>
                <span className="font-xs ls-0 text-grey-900 fw-600 mt-2">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default CardAddModule;
