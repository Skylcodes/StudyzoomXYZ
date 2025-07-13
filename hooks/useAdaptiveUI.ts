'use client';

import { useEffect, useState } from 'react';

// Define breakpoints that match Tailwind's default breakpoints
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof breakpoints;

// Define a type for the return value of the hook
export interface AdaptiveUIState {
  currentBreakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

/**
 * Custom hook for handling adaptive UI behavior
 * This hook provides information about the current viewport size and device type
 */
export function useAdaptiveUI(): AdaptiveUIState {
  // Initialize with default values for SSR
  const [state, setState] = useState<AdaptiveUIState>({
    currentBreakpoint: 'lg',
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: true,
    isXl: false,
    is2xl: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
    orientation: 'landscape',
  });

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Function to update the state based on window dimensions
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';

      // Determine current breakpoint
      let currentBreakpoint: Breakpoint = 'xs';
      if (width >= breakpoints['2xl']) currentBreakpoint = '2xl';
      else if (width >= breakpoints.xl) currentBreakpoint = 'xl';
      else if (width >= breakpoints.lg) currentBreakpoint = 'lg';
      else if (width >= breakpoints.md) currentBreakpoint = 'md';
      else if (width >= breakpoints.sm) currentBreakpoint = 'sm';

      // Update state with all relevant information
      setState({
        currentBreakpoint,
        isXs: width < breakpoints.sm,
        isSm: width >= breakpoints.sm && width < breakpoints.md,
        isMd: width >= breakpoints.md && width < breakpoints.lg,
        isLg: width >= breakpoints.lg && width < breakpoints.xl,
        isXl: width >= breakpoints.xl && width < breakpoints['2xl'],
        is2xl: width >= breakpoints['2xl'],
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
        width,
        height,
        orientation,
      });
    };

    // Initial update
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Add event listener for orientation change (mobile devices)
    window.addEventListener('orientationchange', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  return state;
}

export default useAdaptiveUI; 