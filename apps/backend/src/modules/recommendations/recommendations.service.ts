import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";
import { AiService } from "../ai/ai.service";

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async getRecommendations(userId: string, limit = 10) {
    return this.prisma.recommendation.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { matchScore: "desc" },
      take: limit,
    });
  }

  async generateAiRecommendations(userId: string, params: {
    categories?: string[];
    budget?: string;
  }) {
    const profile = await this.prisma.skinProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    const aiRecs = await this.aiService.generateProductRecommendations({
      skinTone: profile.skinTone?.toLowerCase() ?? "medium",
      skinType: profile.skinType?.toLowerCase() ?? "combination",
      concerns: profile.concerns,
      budget: params.budget ?? "medium",
      categories: params.categories ?? ["serum", "moisturizer", "cleanser", "sunscreen"],
    });

    // Save recommendations
    const saved = await Promise.all(
      aiRecs.map(async (rec) => {
        // Try to find matching product in DB
        const product = await this.prisma.product.findFirst({
          where: {
            name: { contains: rec.name, mode: "insensitive" },
            brand: { contains: rec.brand, mode: "insensitive" },
          },
        });

        return this.prisma.recommendation.create({
          data: {
            userId,
            productId: product?.id,
            category: rec.category,
            reason: rec.reason,
            matchScore: rec.matchScore,
          },
          include: { product: true },
        });
      })
    );

    return saved;
  }
}
