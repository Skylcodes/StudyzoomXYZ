import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { getStripe } from '@/utils/stripe';

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the subscription from Stripe
    const stripeSubscription = await getStripe().subscriptions.retrieve(subscriptionId);

    // Note: Database dependency removed - subscription sync is now only logged
    // You can extend this to store data in your own data source if needed
    console.log('Subscription synced from Stripe:', {
      subscriptionId: stripeSubscription.id,
      customerId: stripeSubscription.customer,
      status: stripeSubscription.status,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      priceId: stripeSubscription.items.data[0]?.price.id
    });

    return NextResponse.json({
      status: 'success',
      subscription: {
        id: stripeSubscription.id,
        customer_id: stripeSubscription.customer,
        status: stripeSubscription.status,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        price_id: stripeSubscription.items.data[0]?.price.id
      }
    });
  } catch (error) {
    console.error('Subscription sync failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 