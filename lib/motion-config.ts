/**
 * NR-OS v5.0 Motion Engine Configuration
 * Standardized spring and transition presets for a premium, orchestrated feel.
 */

export const transitions = {
    spring: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
    },
    smooth: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1
    },
    gentle: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
    }
};

export const variants = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    },
    fadeInScale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 }
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }
};

export const haptic = {
    tap: { scale: 0.98 },
    hover: { scale: 1.01, y: -2 }
};
