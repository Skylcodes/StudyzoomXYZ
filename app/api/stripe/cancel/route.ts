import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { getStripe } from '@/utils/stripe';

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // Get the subscription ID from the request body
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // First, get the current subscription status
    const currentSubscription = await getStripe().subscriptions.retrieve(subscriptionId);
    
    // If subscription is already canceled, just return success
    if (currentSubscription.status === 'canceled') {
      return NextResponse.json({ status: 'success', alreadyCanceled: true });
    }

    // If subscription is active or trialing, cancel it
    if (['active', 'trialing'].includes(currentSubscription.status)) {
      const subscription = await getStripe().subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      // Note: Database dependency removed - subscription updates are now only logged
      // You can extend this to store data in your own data source if needed
      console.log('Subscription canceled:', {
        subscriptionId,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      });

      return NextResponse.json({
        status: 'success',
        subscription: subscription
      });
    }

    return NextResponse.json(
      { error: 'Subscription cannot be canceled in its current state' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to cancel subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 