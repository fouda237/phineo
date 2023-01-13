import "./PDFModule.scss";

import React from 'react';


const PDFModule = (props: { onChange: (arg0: string) => void, value?:string }) => {

    return (
        <div className="col-md-12">
            <h2 className="text-grey-900 font-xs fw-700">Informations du Fichier à Partager</h2>
            <div className="form-group mb-1">
                <label
                    htmlFor="product_sku"
                    className="form-label"
                >
                    Lien Externe du Document à Partager 
                </label>
                <input 
                    placeholder="Lien Externe du Document à Partager *"
                    className="form-control form_control"
                    onChange={(e) => props.onChange(e.target.value)}
                    value={props.value}
                    required
                />
            </div>
        </div>
    );


};

export default PDFModule;
