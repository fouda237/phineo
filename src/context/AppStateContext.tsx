import React from 'react';


interface AppStateContextType {
    contentExtended: boolean;
    handleContentExtended: () => void;
}

const AppStateContext = React.createContext({} as AppStateContextType);

const AppStateProvider = ({children}: { children: JSX.Element }): JSX.Element => {
    const [contentExtended, setContentExtended] = React.useState(true);


    const handleContentExtended = () => {
        setContentExtended(contentExtended => !contentExtended)
    }


    return (
        <AppStateContext.Provider value={{contentExtended, handleContentExtended}}>{children}</AppStateContext.Provider>
    );
};

const useAppStateContext = (): AppStateContextType => {
    return React.useContext(AppStateContext);
};

export {AppStateProvider, useAppStateContext};
