
export interface AlertDialogContextType {
  openDialog: (titleDialog: string, msgDialog: string, btnTxtLeft: string, btnTxtRight: string, onConfirm: (value: boolean) => void) => void;
}
