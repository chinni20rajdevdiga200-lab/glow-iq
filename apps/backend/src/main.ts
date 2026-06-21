import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as compression from "compression";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [
      process.env.WEB_URL ?? "http://localhost:3000",
      "https://beautyiq.ai",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // API prefix
  app.setGlobalPrefix("api");

  // Swagger
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("BeautyIQ AI API")
      .setDescription("AI-powered beauty analysis platform API")
      .setVersion("1.0.0")
      .addBearerAuth()
      .addTag("auth", "Authentication endpoints")
      .addTag("users", "User management")
      .addTag("scans", "AI skin analysis scans")
      .addTag("products", "Product database and analysis")
      .addTag("ingredients", "Ingredient safety database")
      .addTag("recommendations", "AI product recommendations")
      .addTag("ai", "AI services and analysis")
      .addTag("community", "Community features")
      .addTag("subscriptions", "Subscription management")
      .addTag("admin", "Admin panel")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log(`Swagger: http://localhost:${process.env.PORT ?? 3001}/api/docs`);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`BeautyIQ API running on port ${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
}

bootstrap().catch((err) => {
  new Logger("Bootstrap").error("Failed to start application", err);
  process.exit(1);
});
