'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

interface StripeBuyButtonProps {
  className?: string;
  buyButtonId: string;
  publishableKey: string;
}

export function StripeBuyButton({ className, buyButtonId, publishableKey }: StripeBuyButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!buyButtonId || !publishableKey) {
      setError('Missing Stripe configuration');
      setIsLoading(false);
      return;
    }

    if (!user?.id) {
      setError('You must be logged in to make a purchase');
      setIsLoading(false);
      return;
    }

    // Load Stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => {
      try {
        // @ts-expect-error - Stripe Buy Button is not typed
        const stripe = window.Stripe(publishableKey);
        
        // Create Buy Button
        stripe.buyButton('#stripe-buy-button', {
          buyButtonId: buyButtonId,
          // Include user ID as client reference ID
          clientReferenceId: user.id,
          defaults: {
            quantity: 1
          },
          onComplete: () => {
            // Redirect to profile page with success message
        router.push('/profile?payment=success');
          }
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        setError('Failed to initialize payment system');
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setError('Failed to load payment system');
      setIsLoading(false);
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [buyButtonId, publishableKey, user?.id, router]);

  if (error) {
    return (
      <div className={className}>
        <div className="p-4 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}
      <div id="stripe-buy-button" className={isLoading ? 'hidden' : ''}></div>
    </div>
  );
} 
