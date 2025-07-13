import Stripe from 'stripe';

// Singleton pattern to prevent multiple Stripe instances
let _stripe: Stripe | null = null;

/**
 * Returns an initialized Stripe client. If the secret key is missing, we delay throwing
 * the error until runtime (when the route is actually called) instead of at build time.
 * This prevents Next.js from crashing during the build/trace phase when env vars may
 * be absent.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Stripe secret key (STRIPE_SECRET_KEY) is not set.');
  }

  _stripe = new Stripe(secretKey);
  return _stripe;
} 