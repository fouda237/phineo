import { Button } from 'components';
import React from 'react';

interface IFileInput {
    label?: string;
}


const FileInput = (label: string, path: (path: File) => void) => {

    const [fileName, setFileName] = React.useState("")

    return (
        <div className="flex justify-center">
            <div className="w-full rounded-lg shadow-xl bg-gray-50">
                <div className="m-4">
                    <label className="inline-block mb-2 text-gray-500">{label ? label : "Upload du fichier"}</label>
                    <div className="flex items-center justify-center w-full">
                        <label
                            className="flex flex-col w-full h-36 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300 cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-7">
                                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                    {fileName ? fileName : "Choisir le fichier"}</p>
                            </div>
                            <input type="file" className="opacity-0" onChange={(e) => {
                                e.target.files ? path(e.target.files[0]) : console.log("File Error", e)
                                setFileName(e.target.files ? e.target.files[0].name : "")
                                }}/>
                        </label>
                    </div>
                </div>
                {/* <div className="flex justify-center p-2">
                    <Button label={"Valider"} />
                </div> */}
            </div>
        </div>
    );
};

export default FileInput;
