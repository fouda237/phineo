import "./EditorModule.scss";

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';

const EditorModule = (props: { onChange: (arg0: string) => void, value?:string, title?: string }) => {
    return (
        <div className="col-md-12 articleModule">
            {props.title ? '' : (
                <h2 className="text-grey-900 font-xs fw-700">Article</h2>
            )}
            <div className="form-group mb-1">
                <label
                    htmlFor="product_sku"
                    className="form-label"
                >
                    {props.title ? props.title : 'Écrivez directement votre article ici :'}
                    
                </label>
                <CKEditor
                    editor={ ClassicEditor }
                    data={props.value}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        props.onChange(data)
                    } }
                />
            </div>
        </div>
    );
};

export default EditorModule;
