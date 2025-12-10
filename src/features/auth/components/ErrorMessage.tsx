import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <p
            style={{ textAlign: 'center', color: 'red' }}
            dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br />') }}
        />
    );
}

