'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GradientText({
    children,
    className = '',
    from = '#4B7BF5',
    to = '#9181F2',
    animate = true,
    duration = 2,
}: {
    children: React.ReactNode;
    className?: string;
    from?: string;
    to?: string;
    animate?: boolean;
    duration?: number;
}) {
    return (
        <motion.span
            className={cn(
                'inline-block bg-clip-text text-transparent bg-gradient-to-r',
                className
            )}
            style={{
                backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
                backgroundSize: animate ? '200% 100%' : '100% 100%',
            }}
            animate={
                animate
                    ? {
                        backgroundPosition: ['0%', '100%', '0%'],
                    }
                    : undefined
            }
            transition={
                animate
                    ? {
                        duration,
                        repeat: Infinity,
                        ease: 'linear',
                    }
                    : undefined
            }
        >
            {children}
        </motion.span>
    );
} 