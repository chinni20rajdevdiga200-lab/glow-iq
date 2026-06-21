import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../config/prisma.service";
import Stripe from "stripe";

const PRICE_MAP: Record<string, string> = {
  premium: "price_premium_monthly",
  pro: "price_pro_monthly",
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private readonly stripe: Stripe;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.stripe = new Stripe(this.config.get("STRIPE_SECRET_KEY", ""), {
      apiVersion: "2024-06-20",
    });
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
  }

  async createCheckoutSession(userId: string, plan: "premium" | "pro") {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const priceId = PRICE_MAP[plan];
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, plan },
      success_url: `${this.config.get("WEB_URL")}/profile?upgraded=true`,
      cancel_url: `${this.config.get("WEB_URL")}/profile?cancelled=true`,
    });

    return { url: session.url };
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.config.get("STRIPE_WEBHOOK_SECRET", "");
    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, plan } = session.metadata ?? {};
        if (userId && plan) {
          await this.prisma.user.update({ where: { id: userId }, data: { plan: plan.toUpperCase() as never } });
          await this.prisma.subscription.create({
            data: {
              userId,
              plan: plan.toUpperCase() as never,
              status: "ACTIVE",
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "CANCELLED" },
        });
        break;
      }
    }

    return { received: true };
  }

  async createPortalSession(userId: string) {
    const sub = await this.prisma.subscription.findFirst({ where: { userId } });
    if (!sub?.stripeCustomerId) throw new Error("No active subscription");

    const session = await this.stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${this.config.get("WEB_URL")}/profile`,
    });
    return { url: session.url };
  }
}
