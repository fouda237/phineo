import "./AutoSuggest.scss"

import { IUser, IUserAssignment } from "../../types/user.types";

import { Moment } from "moment";
import React, { useState } from "react";
import AutoSuggest from "react-autosuggest";
import Datetime from 'react-datetime';
import { toast } from "react-toastify";


interface IAutoSuggestInput {
    values: [IUser];
    onSelect?: (value: IUser, beginDate: Date) => void;
    valuesToFilter: IUserAssignment[] | [];
}

const AutoSuggestInput = ({ values, onSelect, valuesToFilter }: IAutoSuggestInput) => {
    const [currentValue, setCurrentValue] = useState("");
    const [suggestions, setSuggestions] = useState<IUser[] | []>([]);
    const [suggestionsList, setSuggestionsList] = useState<IUser[] | []>([]);
    const [beginDate, setBeginDate] = useState<Moment | string>();

    const lowerCasedValues = suggestions.map((value) => {
        return {
            id: value.id,
            firstName: value.firstName.toLowerCase(),
            lastName: value.lastName.toLowerCase(),
            fullName: value.firstName.toLowerCase() + ' ' + value.lastName.toLowerCase(),
            email: value.email.toLowerCase(),
            role: value.role,
            assignments: value.assignments

        };
    });

    const getSuggestions = (value: string) => {
        return lowerCasedValues.filter(user =>
            user.fullName.includes(value.trim().toLowerCase())
        );
    }


    React.useEffect(() => {
        const userToCheck = valuesToFilter.map(userDTO => { return userDTO.user })
        const userToAdd = values.filter((item) => !userToCheck.some(secondItem => item.id === secondItem.id))
        setSuggestions(userToAdd)
    }, [values])

    return (
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
                        Étape 2: Choisir le/les Nouveaux Élèves à Ajouter à cette Formation
                    </label>
                    <AutoSuggest
                    suggestions={suggestionsList}
                    onSuggestionsClearRequested={() => setSuggestionsList([])}
                    onSuggestionsFetchRequested={({ value }) => {
                        setCurrentValue(value);
                        setSuggestionsList(getSuggestions(value));
                    }}
                    onSuggestionSelected={(_, suggestionValue) => {
                        if (onSelect) {
                            if (beginDate) {
                                onSelect(suggestionValue.suggestion, new Date(beginDate.valueOf()))
                            } else {
                                toast.error('Veuillez sélectionner une date de début de formation')
                            }
                        }
                    }}
                    getSuggestionValue={suggestion => suggestion.firstName}
                    renderSuggestion={suggestion => <span>{suggestion.firstName} {suggestion.lastName}</span>}
                    inputProps={{
                        placeholder: "Rechercher un Étudiant",
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
        </div>
    );
};


export default AutoSuggestInput
