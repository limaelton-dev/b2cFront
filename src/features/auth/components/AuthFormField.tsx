import React from 'react';

interface AuthFormFieldProps {
    icon: React.ReactNode;
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    required?: boolean;
}

export function AuthFormField({
    icon,
    type,
    name,
    placeholder,
    value,
    onChange,
    error = false,
    required = false
}: AuthFormFieldProps) {
    return (
        <div className={`form-group icons-inputs ${error ? 'error' : ''}`}>
            <div style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }}>
                {icon}
            </div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="form-control"
                required={required}
            />
        </div>
    );
}

