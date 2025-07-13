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

    // Update the subscription to not cancel at period end
    const subscription = await getStripe().subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });

    // Note: Database dependency removed - subscription updates are now only logged
    // You can extend this to store data in your own data source if needed
    console.log('Subscription reactivated:', {
      subscriptionId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
    });

    return NextResponse.json({
      status: 'success',
      subscription: subscription
    });
  } catch (error) {
    console.error('Subscription reactivation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reactivate subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 