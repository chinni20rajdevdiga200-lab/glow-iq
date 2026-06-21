import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";
import { Webhook } from "svix";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService
  ) {}

  async handleClerkWebhook(payload: Buffer, headers: Record<string, string>) {
    const webhookSecret = this.config.get<string>("CLERK_WEBHOOK_SECRET");
    const wh = new Webhook(webhookSecret ?? "");

    let event: { type: string; data: { id: string; email_addresses: Array<{ email_address: string }>; first_name?: string; last_name?: string; image_url?: string } };
    try {
      event = wh.verify(payload, headers) as typeof event;
    } catch (err) {
      this.logger.error("Webhook verification failed", err);
      throw new Error("Invalid webhook signature");
    }

    this.logger.log(`Clerk webhook: ${event.type}`);

    switch (event.type) {
      case "user.created":
        await this.onUserCreated(event.data);
        break;
      case "user.updated":
        await this.onUserUpdated(event.data);
        break;
      case "user.deleted":
        await this.onUserDeleted(event.data.id);
        break;
    }

    return { received: true };
  }

  private async onUserCreated(data: { id: string; email_addresses: Array<{ email_address: string }>; first_name?: string; last_name?: string; image_url?: string }) {
    await this.prisma.user.upsert({
      where: { clerkId: data.id },
      create: {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "Beauty User",
        avatar: data.image_url,
      },
      update: {},
    });
    this.logger.log(`User created: ${data.id}`);
  }

  private async onUserUpdated(data: { id: string; email_addresses: Array<{ email_address: string }>; first_name?: string; last_name?: string; image_url?: string }) {
    await this.prisma.user.updateMany({
      where: { clerkId: data.id },
      data: {
        email: data.email_addresses[0]?.email_address,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        avatar: data.image_url,
      },
    });
  }

  private async onUserDeleted(clerkId: string) {
    await this.prisma.user.deleteMany({ where: { clerkId } });
    this.logger.log(`User deleted: ${clerkId}`);
  }
}
