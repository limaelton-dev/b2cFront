import { useState } from 'react';
import { AlertColor } from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

/**
 * Hook personalizado para gerenciar notificações
 * Fornece funções para exibir e fechar notificações
 */
export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info'
  });

  /**
   * Exibe uma notificação
   * @param message Mensagem a ser exibida
   * @param severity Severidade da notificação (info, success, warning, error)
   */
  const showNotification = (message: string, severity: AlertColor = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  /**
   * Fecha a notificação atual
   */
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  /**
   * Exibe uma notificação de sucesso
   * @param message Mensagem a ser exibida
   */
  const showSuccess = (message: string) => {
    showNotification(message, 'success');
  };

  /**
   * Exibe uma notificação de erro
   * @param message Mensagem a ser exibida
   */
  const showError = (message: string) => {
    showNotification(message, 'error');
  };

  /**
   * Exibe uma notificação de aviso
   * @param message Mensagem a ser exibida
   */
  const showWarning = (message: string) => {
    showNotification(message, 'warning');
  };

  /**
   * Exibe uma notificação de informação
   * @param message Mensagem a ser exibida
   */
  const showInfo = (message: string) => {
    showNotification(message, 'info');
  };

  return {
    notification,
    showNotification,
    closeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}; 