import React from 'react';
import ReactPlayer from 'react-player/youtube'

const AudioModule = () => {
    return (
        <div className={"flex flex-col  mx-auto  w-full"}>
            <div className={'mt-3'}>
                <input placeholder="url de l'audio"
                       className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'}/>
            </div>
        </div>
    );
};

export default AudioModule;
