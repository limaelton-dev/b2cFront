import React from 'react';

interface AuthButtonProps {
    loading: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    type?: 'submit' | 'button';
}

export function AuthButton({ loading, onClick, children, type = 'submit' }: AuthButtonProps) {
    return (
        <button
            type={type}
            style={{
                backgroundColor: loading ? '#8cad8b' : '#349131',
                pointerEvents: loading ? 'none' : 'all'
            }}
            onClick={onClick}
            className="btn btn-primary btn-auth d-flex"
        >
            {loading ? (
                <div
                    className="spinner-border text-light"
                    style={{ fontSize: '8px', width: '24px', height: '24px' }}
                    role="status"
                >
                    <span className="visually-hidden"></span>
                </div>
            ) : (
                <p style={{ marginBottom: '0px', padding: '0px 0px' }}>{children}</p>
            )}
        </button>
    );
}

