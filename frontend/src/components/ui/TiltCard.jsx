import React, { useRef, useState } from 'react';

/**
 * TiltCard - A React component that creates a 3D tilt effect on hover
 * The card tilts based on mouse position, creating a holographic/premium feel
 */
const TiltCard = ({
    children,
    className = '',
    tiltAmount = 10,
    glareEnabled = true,
    scale = 1.02
}) => {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});
    const [glareStyle, setGlareStyle] = useState({});

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / (rect.height / 2)) * -tiltAmount;
        const rotateY = (mouseX / (rect.width / 2)) * tiltAmount;

        // Update CSS variables for inner light effect
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
            '--mouse-x': `${percentX}%`,
            '--mouse-y': `${percentY}%`,
        });

        if (glareEnabled) {
            setGlareStyle({
                opacity: 0.15,
                background: `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            });
        }
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
            '--mouse-x': '50%',
            '--mouse-y': '50%',
        });
        setGlareStyle({ opacity: 0 });
    };

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            style={{
                ...style,
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {glareEnabled && (
                <div
                    className="tilt-card-glare"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        pointerEvents: 'none',
                        transition: 'opacity 0.3s ease',
                        ...glareStyle,
                    }}
                />
            )}
        </div>
    );
};

export default TiltCard;
