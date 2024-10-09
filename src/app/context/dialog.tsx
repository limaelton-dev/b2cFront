"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText } from '@mui/material';
import { AlertDialogContextType } from '../interfaces/interfaces';

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const useAlertDialog = (): AlertDialogContextType => {
    const context = useContext(AlertDialogContext);
    if (context === undefined) {
        throw new Error('useAlertDialog must be used within an AlertDialogProvider');
    }
    return context;
};

export const AlertDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [msgDialog, setMessage] = useState('');
    const [titleDialog, setTitle] = useState('');
    const [btnTxtLeft, setBtnTxtLeft] = useState('');
    const [btnTxtRight, setBtnTxtRight] = useState('');
    const [onConfirm, setOnConfirm] = useState<(value: boolean) => void>(() => {});

    const openDialog = (titleDialog: string, msgDialog: string, btnTxtLeft: string, btnTxtRight: string, onConfirm: (value: boolean) => void) => {
        setTitle(titleDialog);
        setBtnTxtLeft(btnTxtLeft);
        setBtnTxtRight(btnTxtRight);
        setMessage(msgDialog);
        setOnConfirm(() => onConfirm);
        setOpen(true);
    };

    const closeDialog = (value: boolean) => {
        setOpen(false);
        onConfirm(value);
    };

  return (
    <AlertDialogContext.Provider value={{ openDialog }}>
        {children}
        <Dialog open={open} onClose={() => closeDialog(false)}>
            <DialogTitle id="alert-dialog-title">{titleDialog}</DialogTitle>
            <DialogContent style={{padding: '0px 24px'}}>
                <DialogContentText id="alert-dialog-description">
                    {msgDialog}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="outlined" style={{color: '#cf6363', borderColor: '#cf6363'}} onClick={() => closeDialog(false)}>
                    {btnTxtLeft}
                </Button>
                <Button variant="outlined" onClick={() => closeDialog(true)} autoFocus>
                    {btnTxtRight}
                </Button>
            </DialogActions>
        </Dialog>
    </AlertDialogContext.Provider>
  );
};