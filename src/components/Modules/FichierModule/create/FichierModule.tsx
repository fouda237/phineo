import axios from "axios";
import React from 'react';
import { Spinner } from "react-activity";
import {useForm} from 'react-hook-form';
import authService from "services/auth.service"

interface Inputs {
    file?: File
}

interface File {
    file?: File
}

const FichierModule = (props: { onChange: (arg0: string) => void, value?:string }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [fileLoading, setFileLoading] = React.useState(false);
    const [fileUploaded, setFileUploaded] = React.useState(false);
    const [filePast, setFilePast] = React.useState(false);
    const [fileUploadError, setFileUploadError] = React.useState(false);

    const fileSubmit = async (file:any) => {
    
        if (file){
            setFileLoading(true)

            const dataForm = new FormData()
            dataForm.append('file', file)

            const user = authService.getCurrentUser()
            if (!user) return;

            try {
                    return await axios.post(`${process.env.REACT_APP_API_FILE_URL}/upload/file`, dataForm, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${JSON.parse(user).tokens.access.token.toString()}`
                    }
                }).then ((res) => {
                    props.onChange(res.data)

                    setFileLoading(false)
                    setFileUploadError(false)
                    setFileUploaded(true)
                })
            } catch (e) {
                    setFileLoading(false)
                    setFileUploadError(true)
                    setFileUploaded(false)
                }
            }
    };

    if (!filePast && props.value) {
        props.onChange(props.value)
        setFilePast(true)
    }


    return (
        <div className="col-md-12">
            <h2 className="text-grey-900 font-xs fw-700">Informations du Fichier à Partager</h2>

            <div className="form-group mb-1">      

                    {props.value ? (
                        <>
                            <p className="font-xss">
                                Fichier actuel:  
                                <a href={props.value} target='_blank'>
                                    <i className="feather feather-link ml-2"></i>
                                </a>
                            </p>
                            <label
                                htmlFor="product_sku"
                                className="form-label"
                            >
                                Télécharger le Fichier ici et Attendez que son téléchargement soit finaliser pour valider la modification du module !
                            </label>
                        </>
                    ) : (
                        <label
                            htmlFor="product_sku"
                            className="form-label"
                        >
                            Télécharger le Fichier ici et Attendez que son téléchargement soit finaliser pour créer le module !
                        </label>
                    )}
                    <input 
                        onChange={(e:any) => fileSubmit(e.target.files[0])}
                        className='form-control form_control' 
                        type="file" 
                    />
                    {(fileLoading && !fileUploaded && !fileUploadError) && (
                        <div className='mt-2 mb-4' style={{ display: 'flex', alignItems: 'center'}}>
                            <Spinner /> <p className='mb-0 ml-3'>Téléchargement en cours ... </p>
                        </div>
                    )}
                    {
                        (fileUploaded && !fileUploadError) && (
                            <p className='text-success'> <i className="feather-check mr-2"></i> 
                                Votre Fichier a bien été téléchargé ! Vous pouvez maintenant créer le module !
                            </p>
                        )
                    }
                    {
                        (fileUploadError) && (
                            <p className='text-danger'> <i className="feather-check mr-2"></i> 
                                Petit soucis avec votre fichier, veuillez réessayer plus tard. <br />
                                PS: Il doit faire moins de 50 Mo 
                            </p>
                        )
                    }
            </div>
        </div>
    );


};

export default FichierModule;
