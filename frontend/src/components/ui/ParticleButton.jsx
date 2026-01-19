import React, { useState, useCallback } from 'react';

/**
 * ParticleButton - A button that fires particle explosions on click
 * Creates a satisfying visual "haptic" feedback effect
 */
const ParticleButton = ({
    children,
    onClick,
    className = '',
    particleColor = '#a855f7', // Purple default
    particleCount = 12,
    disabled = false,
    ...props
}) => {
    const [particles, setParticles] = useState([]);
    const [isExploding, setIsExploding] = useState(false);

    const createParticles = useCallback((e) => {
        if (disabled) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            angle: (360 / particleCount) * i + Math.random() * 30,
            velocity: 2 + Math.random() * 3,
            size: 4 + Math.random() * 4,
            opacity: 1,
        }));

        setParticles(newParticles);
        setIsExploding(true);

        // Clear particles after animation
        setTimeout(() => {
            setParticles([]);
            setIsExploding(false);
        }, 600);
    }, [particleCount, disabled]);

    const handleClick = (e) => {
        createParticles(e);
        if (onClick) onClick(e);
    };

    return (
        <button
            className={`particle-button relative overflow-visible ${className}`}
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            {/* Ripple effect on click */}
            {isExploding && (
                <span
                    className="absolute inset-0 animate-ping rounded-xl opacity-30"
                    style={{ backgroundColor: particleColor }}
                />
            )}

            {/* Particles */}
            {particles.map((particle) => (
                <span
                    key={particle.id}
                    className="particle-burst"
                    style={{
                        '--particle-x': `${particle.x}px`,
                        '--particle-y': `${particle.y}px`,
                        '--particle-angle': `${particle.angle}deg`,
                        '--particle-velocity': `${particle.velocity * 20}px`,
                        '--particle-size': `${particle.size}px`,
                        '--particle-color': particleColor,
                    }}
                />
            ))}

            {/* Button content */}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default ParticleButton;
