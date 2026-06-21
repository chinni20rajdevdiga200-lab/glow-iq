import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";
import { redisStore } from "cache-manager-ioredis-yet";

import { PrismaModule } from "./config/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ScansModule } from "./modules/scans/scans.module";
import { ProductsModule } from "./modules/products/products.module";
import { IngredientsModule } from "./modules/ingredients/ingredients.module";
import { RecommendationsModule } from "./modules/recommendations/recommendations.module";
import { AiModule } from "./modules/ai/ai.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { CommunityModule } from "./modules/community/community.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 10 },
      { name: "medium", ttl: 10000, limit: 50 },
      { name: "long", ttl: 60000, limit: 200 },
    ]),

    // Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.get("REDIS_HOST", "localhost"),
          port: config.get("REDIS_PORT", 6379),
          password: config.get("REDIS_PASSWORD"),
          ttl: 300,
        }),
      }),
    }),

    // Scheduler for cron jobs
    ScheduleModule.forRoot(),

    // Core
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ScansModule,
    ProductsModule,
    IngredientsModule,
    RecommendationsModule,
    AiModule,
    SubscriptionsModule,
    CommunityModule,
    AdminModule,
  ],
})
export class AppModule {}
