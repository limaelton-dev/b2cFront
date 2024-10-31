import React, { useEffect, useState } from 'react';

const ScrollTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button onClick={handleScrollToTop} style={
        {   
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1000,
            pointerEvents: isVisible ? 'all' : 'none',
            opacity: isVisible ? '1' : '0',
            transition: 'all ease 0.3s'
        }}>
            Voltar ao topo
        </button>
    )
};

export default ScrollTopButton;