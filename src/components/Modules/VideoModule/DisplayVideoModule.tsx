import React from 'react';
import ReactPlayer from 'react-player/youtube'

const DisplayVideoModule = (url:string) => {

    return (
        <div className={"w-full flex items-center justify-center"}>
            <ReactPlayer url={url} controls={true} width={"100%"} height={800}/>
        </div>
    );
};

export default DisplayVideoModule;
