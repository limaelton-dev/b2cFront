
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastSideContextType } from '../interfaces/interfaces';
import { Alert, Slide, Snackbar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

const ToastSideContext = createContext<ToastSideContextType>({
    showToast: (message, type) => {}
});

export const useToastSide = () => {
    return useContext(ToastSideContext);
};
export const ToastSideProvider = ({ children }) => {
    const [toast, setToastSide] = useState({
        active: false,
        message: '',
        type: 'error'
    });

    const showToast = (message, type) => {
        setToastSide({
            active: true,
            message,
            type,
        });
    };

    const handleClose = () => {
        setToastSide((prevToast) => ({ ...prevToast, active: false }));
    };

    return (
        <ToastSideContext.Provider value={{ showToast }}>
            <>
                <Snackbar
                    sx={{ borderRadius: '3px'}}
                    open={toast.active}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    TransitionComponent={Slide}
                >   
                    <Alert 
                        icon={toast.type == 'error' ? <ErrorOutlineOutlinedIcon fontSize="inherit" /> : toast.type == 'warning' ? <WarningOutlinedIcon fontSize="inherit" /> : toast.type == 'success' ? <CheckIcon fontSize="inherit" /> : <ErrorOutlineOutlinedIcon fontSize="inherit" />}
                        severity={toast.type == 'error' ? 'error': toast.type == 'warning' ? 'warning' : toast.type == 'error' ? 'error' : 'error'} sx={{ 
                        width: '100%',
                        boxShadow: '0px 0px 1px 1px '+ (toast.type == 'error' ? 'red;' : toast.type == 'warning' ? '#ecdc42;' : toast.type == 'success' ? '#107c10' : 'red;'),
                        background: 'white',
                        color: toast.type == 'error' ? 'red' : toast.type == 'warning' ? '#ecdc42' : toast.type == 'success' ? '#107c10' : 'red',
                        '.MuiAlert-icon': {
                            color: toast.type == 'error' ? 'red' : toast.type == 'warning' ? '#ecdc42' : toast.type == 'success' ? '#107c10' : 'red',
                        }
                    }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
                {children}
            </>
        </ToastSideContext.Provider>
    );
};