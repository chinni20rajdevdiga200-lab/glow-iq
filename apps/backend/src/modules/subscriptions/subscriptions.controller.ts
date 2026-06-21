import {
  Controller, Get, Post, Body, Headers, RawBodyRequest, Req, UseGuards
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { Request } from "express";

class CreateCheckoutDto {
  plan: "premium" | "pro";
}

@ApiTags("subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  getSubscription(@CurrentUser("id") userId: string) {
    return this.service.getSubscription(userId);
  }

  @Post("checkout")
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  createCheckout(@CurrentUser("id") userId: string, @Body() dto: CreateCheckoutDto) {
    return this.service.createCheckoutSession(userId, dto.plan);
  }

  @Post("portal")
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  createPortal(@CurrentUser("id") userId: string) {
    return this.service.createPortalSession(userId);
  }

  @Post("webhook/stripe")
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") sig: string
  ) {
    return this.service.handleStripeWebhook(req.rawBody!, sig);
  }
}
