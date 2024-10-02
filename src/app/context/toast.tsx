"use client"
import { Snackbar } from '@mui/material';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface ToastContextType {
    setToastShow: Dispatch<SetStateAction<boolean>>;
    setDurationToast: Dispatch<SetStateAction<number>>;
    setToastMessage: Dispatch<SetStateAction<string>>;
    actionToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
    setToastShow: () => {},
    setDurationToast: () => {},
    setToastMessage: () => {},
    actionToast: () => {},
});

export const useToast = () => {
    return useContext(ToastContext);
};
    
export const ToastProvider = ({ children }) => {
    const [toastShow, setToastShow] = useState(false);
    const [durationToast, setDurationToast] = useState(6000);
    const [toastMessage, setToastMessage] = useState('');

    const actionToast = () => {
        
    };

    return (
        <ToastContext.Provider value={{ setToastShow, setDurationToast, setToastMessage, actionToast }}>
            <Snackbar
                open={toastShow}
                autoHideDuration={durationToast}
                // onClose={handleClose}
                message={toastMessage}
                // action={actionToast}
            />
            {children}
        </ToastContext.Provider>
    );
};