import "./AutoSuggest.scss"

import { IUser, IUserAssignment } from "../../types/user.types";

import { Button } from "components/Button/Button";
import { Moment } from "moment";
import React, { useState } from "react";
import AutoSuggest from "react-autosuggest";
import Datetime from 'react-datetime';
import { toast } from "react-toastify";
import { updateCourseAssignments } from "services/course.service";


interface IAutoSuggestInput {
    values: [any];
    onSelect?: (value: any, beginDate: Date) => void
}

const AutoSuggestCoursesInput = ({ values, onSelect }: IAutoSuggestInput) => {
    const [currentValue, setCurrentValue] = useState("");
    const [suggestions, setSuggestions] = useState<any>([]);
    const [suggestionsList, setSuggestionsList] = useState<any>([]);

    const [selectedSuggestion, setSelectedSuggestion] = useState<any>();
    const [beginDate, setBeginDate] = useState<Moment | string>();

    const lowerCasedValues = suggestions.map((value: any) => {
        return {
            id: value.id,
            title: value.title.toLowerCase(),
            description: value.description.toLowerCase(),
            assignments: value.assignments
        };
    });

    const getSuggestions = (value: string) => {
        return lowerCasedValues.filter((user: any) =>
            user.title.includes(value.trim().toLowerCase())
        );
    }

    const addAssignment = () => {
        if (selectedSuggestion && beginDate && onSelect) {
            onSelect(selectedSuggestion, new Date(beginDate ? beginDate.valueOf() : new Date()));
        } else {
            toast.error("Veuillez sélectionner une formation et une date")
        }
    }

    React.useEffect(() => {
        setSuggestions(values)
    }, [values])

    return (
        <>
        <div className="row">
            <div className="col-md-12">
                <div className="form-group mb-1">
                    <label
                        htmlFor="product_sku"
                        className="form-label"
                    >
                        Étape 1: Choisir une Date d'Entrée à la Formation
                    </label>
                    <Datetime 
                        dateFormat="DD / MM / YYYY" 
                        timeFormat={false} 
                        onChange={(date) => setBeginDate(date)} 
                        locale="fr-fr" 
                        inputProps={{className: "form-control form_control", placeholder: "Date de début de formation *"}}
                    />
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group mb-1">
                    <label
                        htmlFor="product_sku"
                        className="form-label"
                    >
                        Étape 2: Choisir la Formations à Ajouter à cet Élève
                    </label>
                    
                <AutoSuggest
                    suggestions={suggestionsList}
                    onSuggestionsClearRequested={() => setSuggestionsList([])}
                    onSuggestionsFetchRequested={({ value }) => {
                        setCurrentValue(value);
                        setSuggestionsList(getSuggestions(value));
                    }}
                    onSuggestionSelected={(_, suggestionValue) => {
                        setSelectedSuggestion(suggestionValue.suggestion)
                    }}
                    getSuggestionValue={suggestion => suggestion.title}
                    renderSuggestion={suggestion => <span>{suggestion.title}</span>}
                    inputProps={{
                        placeholder: "Rechercher une formation",
                        value: currentValue,
                        className: 'form-control form_control',
                        onChange: (_, { newValue, method }) => {
                            setCurrentValue(newValue);
                        }
                    }}
                    highlightFirstSuggestion={true}
                />
                </div>
            </div>
            <div className="col-md-12">
                <Button action={addAssignment} label={"Mettre à jour"} />
            </div>
        </div>
        </>
    );
};


export default AutoSuggestCoursesInput
