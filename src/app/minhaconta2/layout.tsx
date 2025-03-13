"use client"
import React from 'react';
import { NotificationProvider } from './context/NotificationContext';

// Importações de CSS necessárias para o header
import '../assets/css/--globalClasses.css';
import '../assets/css/home.css';
import '../assets/css/home/header.css';
import '../assets/css/home/cart.css';
import '../assets/css/home/footer.css';
import '../assets/css/home/categorias.css';

interface MinhaContaLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout para a seção Minha Conta
 * Inclui o provedor de notificações e importa os estilos necessários
 */
export default function MinhaContaLayout({ children }: MinhaContaLayoutProps) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
} 