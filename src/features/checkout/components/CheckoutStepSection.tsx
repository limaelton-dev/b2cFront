"use client";
import React from 'react';
import { Box } from '@mui/material';
import styles from '../CheckoutPage.module.css';

interface CheckoutStepSectionProps {
    title: string;
    stepNumber: number;
    currentStep: number;
    icon: React.ReactNode;
    onStepClick: (step: number) => void;
    children: React.ReactNode;
    className?: string;
}

const CheckoutStepSection: React.FC<CheckoutStepSectionProps> = ({
    title,
    stepNumber,
    currentStep,
    icon,
    onStepClick,
    children,
    className = ''
}) => {
    const isActive = currentStep === stepNumber;
    const isEditable = stepNumber !== 3;

    return (
        <div className={`${styles.stepSection} ${className}`}>
            <span 
                className={`${styles.stepTitle} ${isActive ? styles.stepTitleActive : ''}`}
                onClick={() => onStepClick(stepNumber)}
            >
                {title}
                {!isActive && isEditable && (
                    <span className={styles.editHint}>(clique para editar)</span>
                )}
            </span>
            
            <div className={styles.stepContentWrapper}>
                {!isActive && (
                    <button 
                        type="button" 
                        className={styles.stepButton}
                        onClick={() => onStepClick(stepNumber)}
                        aria-label={`Editar ${title}`}
                    >
                        {icon}
                    </button>
                )}
                
                <Box className={`${styles.stepContent} ${isActive ? styles.stepContentActive : styles.stepContentInactive}`}>
                    {isActive && children}
                </Box>
            </div>
        </div>
    );
};

export default CheckoutStepSection;

