import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger
} from "@nestjs/common";
import { createClerkClient } from "@clerk/backend";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../config/prisma.service";
import type { Request } from "express";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);
  private readonly clerk: ReturnType<typeof createClerkClient>;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {
    this.clerk = createClerkClient({
      secretKey: this.config.get("CLERK_SECRET_KEY"),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException("No authorization token provided");

    try {
      const payload = await this.clerk.verifyToken(token);
      const clerkId = payload.sub;

      // Find or create user in our DB
      let user = await this.prisma.user.findUnique({
        where: { clerkId },
        include: { profile: true },
      });

      if (!user) {
        const clerkUser = await this.clerk.users.getUser(clerkId);
        user = await this.prisma.user.create({
          data: {
            clerkId,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Beauty User",
            avatar: clerkUser.imageUrl,
          },
          include: { profile: true },
        });
      }

      request.user = user;
      return true;
    } catch (error) {
      this.logger.error("Auth guard error:", error);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private extractToken(request: Request): string | undefined {
    const auth = request.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.substring(7);
    return undefined;
  }
}
