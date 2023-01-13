import "./VideoModule.scss"

import Duration from "./Duration";

import React from 'react';
import ReactPlayer from 'react-player';


const VideoModule = (props: { onChange: (arg0: string) => void, value?:string },label: string, path: (path: File) => void) => {
    const [previewLoaded, setPreviewLoaded] = React.useState(false)
    const [errorVideo, setErrorVideo] = React.useState(false)
    const [duration, setDurationVideo] = React.useState(0)
    const [fileName, setFileName] = React.useState("")
    return (
        <>
            <div className="col-md-12">
                <h2 className="text-grey-900 font-xs fw-700">Informations de la Vidéo</h2>
                <div className="form-group mb-1">
                    <label
                        htmlFor="product_sku"
                        className="form-label"
                    >
                        Lien de la Vidéo
                    </label>
                    {/* <input 
                        placeholder="Lien de la Vidéo *"
                        className="form-control form_control"
                        onChange={(e) => (
                            props.onChange(e.target.value),
                            setPreviewLoaded(false)
                        )}
                        value={props.value}
                        required
                    /> */}
                    <br />
                     <input type="file" className="opacity-0" onChange={(e) => {
                                e.target.files ? path(e.target.files[0]) : console.log("File Error", e)
                                setFileName(e.target.files ? e.target.files[0].name : "")
                                }}/>
                    { props.value && errorVideo ? (
                        <p className="font-xsss">Le lien de la vidéo n'est pas valide ou n'est pas pris en charge</p>
                    ) : ''}
                </div>
            </div>

            <ReactPlayer
                controls={true} 
                width={"0%"}
                height={0}
                url={props.value}
                onReady={() => (
                    setPreviewLoaded(true),
                    setErrorVideo(false)
                )}
                onError={() => setErrorVideo(true)}
                onDuration={(duration) => setDurationVideo(duration)}
            />

            { (previewLoaded && !errorVideo) && (
                <div className="col-md-12">
                    <div className="form-group mb-1">
                        <label
                            htmlFor="product_sku"
                            className="form-label"
                        >
                            Aperçu de la Vidéo - <Duration seconds={duration} />
                        </label>

                        <ReactPlayer
                            controls={true} 
                            width={"100%"}
                            height={440}
                            url={props.value}
                            onReady={() => setPreviewLoaded(true)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoModule;
