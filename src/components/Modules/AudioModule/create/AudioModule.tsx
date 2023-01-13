import FileInput from '../../../FileInput/FileInput';
import React from 'react';
import "./AudioModule.scss"
import {useForm} from 'react-hook-form';

interface Inputs {
    title: string,
}


const AudioModule = () => {
    const {register, handleSubmit, watch, formState: {errors}} = useForm<Inputs>();

    return (

        <div className={"flex flex-col max-w-xl mx-auto"}>
            {/* <FileInput label={"Upload de l'audio"}/> */}
            <div className={'mt-3'}>
                <input placeholder="Titre"{...register("title", {required: true})}
                       className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl'}/>
                <textarea className={'w-full bg-slate-50 rounded-lg p-3 drop-shadow-xl mt-4'} rows={6}
                          placeholder={"Description (optionnel)"}/>
            </div>
        </div>
    );
};

export default AudioModule;
