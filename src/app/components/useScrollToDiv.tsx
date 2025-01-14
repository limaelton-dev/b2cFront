import { useCallback } from 'react';

const useScrollToDiv = () => {
    const scrollTo = useCallback((targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            });
        } else {
            console.warn(`Elemento com o ID "${targetId}" não foi encontrado.`);
        }
    }, []);

    return scrollTo;
};

export default useScrollToDiv;