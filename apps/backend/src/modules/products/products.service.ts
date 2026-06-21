import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";
import { AiService } from "../ai/ai.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import type { Cache } from "cache-manager";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}

  async getProducts(params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, category, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { brand: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category: { equals: category.toUpperCase() as never } }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ overallRating: "desc" }, { reviewCount: "desc" }],
        include: {
          productIngredients: {
            include: { ingredient: { select: { name: true, riskLevel: true } } },
            take: 5,
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: products, total, page, limit, hasMore: skip + limit < total };
  }

  async getProduct(id: string) {
    const cacheKey = `product:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productIngredients: {
          orderBy: { position: "asc" },
          include: { ingredient: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    await this.cache.set(cacheKey, product, 3600);
    return product;
  }

  async findByBarcode(barcode: string) {
    const cacheKey = `barcode:${barcode}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    let product = await this.prisma.product.findUnique({
      where: { barcode },
      include: { productIngredients: { include: { ingredient: true } } },
    });

    if (!product) {
      // Try Open Food Facts / Open Beauty Facts fallback
      product = await this.lookupExternalBarcode(barcode);
    }

    if (!product) throw new NotFoundException("Product not found for this barcode");

    await this.cache.set(cacheKey, product, 86400);
    return product;
  }

  private async lookupExternalBarcode(barcode: string) {
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`, { timeout: 5000 });
      const p = res.data?.product;
      if (!p) return null;

      // Save to DB
      return this.prisma.product.upsert({
        where: { barcode },
        create: {
          barcode,
          name: p.product_name ?? "Unknown Product",
          brand: p.brands ?? "Unknown Brand",
          category: "MOISTURIZER" as never,
          description: p.product_name_en,
          safetyScore: 0,
        },
        update: {},
        include: { productIngredients: { include: { ingredient: true } } },
      });
    } catch {
      return null;
    }
  }

  async analyzeIngredientText(text: string) {
    const analysis = await this.aiService.analyzeIngredients(text);
    return analysis;
  }

  async scanProduct(
    imageBase64: string,
    context: { skinTone?: string; skinType?: string; userId?: string }
  ) {
    this.logger.log("Scanning product image for ingredients");

    // Step 1: OCR — extract ingredient text from image
    const ingredientText = await this.aiService.extractIngredientsFromImage(imageBase64);

    if (!ingredientText || ingredientText.trim().length < 5) {
      return {
        scanId: `scan_${Date.now()}`,
        ingredientText: "",
        ingredients: [],
        safetyScore: 0,
        pregnancySafetyScore: 0,
        sensitiveSkinScore: 0,
        harmfulChemicals: [],
        skinToneMatch: null,
        summary: "No ingredient list detected in the image. Please point the camera at the ingredient label.",
      };
    }

    // Step 2: Analyze ingredients
    const analysis = await this.aiService.analyzeIngredients(ingredientText);

    // Step 3: Extract harmful chemicals for prominent display
    const harmfulChemicals = analysis.ingredients
      .filter((ing) => ing.isHarmful || ing.riskLevel === "high")
      .map((ing) => ({
        name: ing.name,
        inci: ing.inci,
        riskLevel: ing.riskLevel,
        concerns: ing.concerns,
        description: ing.description,
      }));

    // Step 4: Skin-tone match score (skin-type compatibility check via AI summary)
    let skinToneMatch: { score: number; message: string } | null = null;
    if (context.skinTone || context.skinType) {
      const profile = [context.skinTone, context.skinType].filter(Boolean).join(", ");
      const hasIrritants = harmfulChemicals.length > 0;
      const baseScore = analysis.safetyScore;
      const skinScore = hasIrritants ? Math.max(baseScore - 15, 0) : baseScore;
      skinToneMatch = {
        score: skinScore,
        message: skinScore >= 80
          ? `Great match for your ${profile} skin`
          : skinScore >= 60
          ? `Use with caution for your ${profile} skin`
          : `Not recommended for your ${profile} skin`,
      };
    }

    const scanId = `scan_${Date.now()}`;

    return {
      scanId,
      ingredientText,
      ingredients: analysis.ingredients,
      safetyScore: analysis.safetyScore,
      pregnancySafetyScore: analysis.pregnancySafetyScore,
      sensitiveSkinScore: analysis.sensitiveSkinScore,
      harmfulChemicals,
      skinToneMatch,
      summary: analysis.summary,
    };
  }
}
