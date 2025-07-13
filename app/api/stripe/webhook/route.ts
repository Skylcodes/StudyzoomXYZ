import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type StripeType from 'stripe';
import { withCors } from '@/utils/cors';
import { getStripe } from '@/utils/stripe';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

// Helper function for consistent logging
function logWebhookEvent(message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] WEBHOOK: ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

// Need to disable body parsing for Stripe webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

// Currently Handled Events:
// 1. checkout.session.completed - When a customer completes checkout
// 2. customer.subscription.created - When a new subscription is created
// 3. customer.subscription.updated - When a subscription is updated
// 4. customer.subscription.deleted - When a subscription is cancelled/deleted
// 5. customer.subscription.pending_update_applied - When a pending update is applied
// 6. customer.subscription.pending_update_expired - When a pending update expires
// 7. customer.subscription.trial_will_end - When a trial is about to end

// Other Important Events You Might Want to Handle:
// Payment Related:
// - invoice.paid - When an invoice is paid successfully
// - invoice.payment_failed - When a payment fails
// - invoice.upcoming - When an invoice is going to be created
// - payment_intent.succeeded - When a payment is successful
// - payment_intent.payment_failed - When a payment fails

// Customer Related:
// - customer.created - When a new customer is created
// - customer.updated - When customer details are updated
// - customer.deleted - When a customer is deleted

// Subscription Related:
// - customer.subscription.paused - When a subscription is paused
// - customer.subscription.resumed - When a subscription is resumed
// - customer.subscription.trial_will_end - 3 days before trial ends

// Checkout Related:
// - checkout.session.async_payment_succeeded - Async payment success
// - checkout.session.async_payment_failed - Async payment failure
// - checkout.session.expired - When checkout session expires

export const POST = withCors(async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not set');
    }

    logWebhookEvent('Received webhook request');
    logWebhookEvent('Stripe signature', sig);

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    logWebhookEvent(`Event received: ${event.type}`, event.data.object);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as StripeType.Checkout.Session;
        
        logWebhookEvent('Processing checkout.session.completed', {
          sessionId: session.id,
          clientReferenceId: session.client_reference_id,
          customerId: session.customer,
          subscriptionId: session.subscription
        });

        if (!session.client_reference_id || !session.customer || !session.subscription) {
          logWebhookEvent('Missing required session data', {
            clientReferenceId: session.client_reference_id,
            customerId: session.customer,
            subscriptionId: session.subscription
          });
          return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
        }

        // Update user role to 'paid' in the users table
        try {
          const supabaseAdmin = getSupabaseAdmin();
          const { error } = await supabaseAdmin
            .from('users')
            .update({ role: 'paid' })
            .eq('id', session.client_reference_id);
          
          if (error) {
            logWebhookEvent('Failed to update user role', error);
            throw error;
          }
          
          logWebhookEvent('User role updated to paid', {
            userId: session.client_reference_id
          });
        } catch (error) {
          logWebhookEvent('Error updating user role', error);
        }
        
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as StripeType.Subscription;
        
        logWebhookEvent('Processing customer.subscription.created', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status
        });
        
        // If we have metadata with the user ID, update their role
        if (subscription.metadata?.userId) {
          try {
            const supabaseAdmin = getSupabaseAdmin();
            const { error } = await supabaseAdmin
              .from('users')
              .update({ role: 'paid' })
              .eq('id', subscription.metadata.userId);
            
            if (error) {
              logWebhookEvent('Failed to update user role', error);
            } else {
              logWebhookEvent('User role updated to paid from subscription metadata', {
                userId: subscription.metadata.userId
              });
            }
          } catch (error) {
            logWebhookEvent('Error updating user role from subscription metadata', error);
          }
        }
        
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.pending_update_applied':
      case 'customer.subscription.pending_update_expired':
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as StripeType.Subscription;
        
        logWebhookEvent(`Processing ${event.type}`, {
          subscriptionId: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
        });
        
        // Handle subscription cancellation by updating user role back to free
        if (event.type === 'customer.subscription.deleted' && subscription.metadata?.userId) {
          try {
            const supabaseAdmin = getSupabaseAdmin();
            const { error } = await supabaseAdmin
              .from('users')
              .update({ role: 'free' })
              .eq('id', subscription.metadata.userId);
            
            if (error) {
              logWebhookEvent('Failed to update user role to free', error);
            } else {
              logWebhookEvent('User role updated to free after subscription cancellation', {
                userId: subscription.metadata.userId
              });
            }
          } catch (error) {
            logWebhookEvent('Error updating user role after subscription cancellation', error);
          }
        }
        
        break;
      }

      // Note: You might want to add handlers for these common events:
      // case 'invoice.paid': {
      //   const invoice = event.data.object as StripeType.Invoice;
      //   // Handle successful payment
      // }

      // case 'invoice.payment_failed': {
      //   const invoice = event.data.object as StripeType.Invoice;
      //   // Handle failed payment, notify user
      // }

      // case 'customer.subscription.trial_will_end': {
      //   const subscription = event.data.object as StripeType.Subscription;
      //   // Notify user about trial ending
      // }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logWebhookEvent('Webhook error', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}); 