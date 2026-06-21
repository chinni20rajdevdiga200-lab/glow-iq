import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";

const HARMFUL_INGREDIENTS = [
  { name: "Paraben (Methyl/Propyl/Butyl)", inci: "METHYLPARABEN", isParaben: true, riskLevel: "MODERATE", concerns: ["Hormone disruption", "Estrogenic activity"] },
  { name: "Sodium Lauryl Sulfate", inci: "SODIUM LAURYL SULFATE", isSulfate: true, riskLevel: "MODERATE", concerns: ["Skin irritation", "Strips natural oils"] },
  { name: "Sodium Laureth Sulfate", inci: "SODIUM LAURETH SULFATE", isSulfate: true, riskLevel: "MODERATE", concerns: ["Possible 1,4-dioxane contamination"] },
  { name: "Formaldehyde", inci: "FORMALDEHYDE", isFormaldehydeReleaser: true, riskLevel: "HIGH", concerns: ["Known carcinogen", "Skin sensitizer"] },
  { name: "Hydroquinone", inci: "HYDROQUINONE", riskLevel: "HIGH", concerns: ["Banned in EU", "Potential carcinogen", "Ochronosis"] },
  { name: "Triclosan", inci: "TRICLOSAN", riskLevel: "HIGH", concerns: ["Antibiotic resistance", "Hormone disruption", "Environmental toxin"] },
  { name: "Synthetic Fragrance", inci: "PARFUM", isSyntheticFragrance: true, riskLevel: "MODERATE", concerns: ["Allergen", "Undisclosed ingredients", "Irritant"] },
  { name: "BHT (Butylated Hydroxytoluene)", inci: "BHT", riskLevel: "MODERATE", concerns: ["Possible hormone disruptor", "Environmental concern"] },
  { name: "Oxybenzone", inci: "BENZOPHENONE-3", riskLevel: "HIGH", concerns: ["Hormone disruption", "Coral reef damage", "Systemic absorption"] },
  { name: "Dibutyl Phthalate", inci: "DIBUTYL PHTHALATE", isPhthalate: true, riskLevel: "HIGH", concerns: ["Reproductive toxicity", "Developmental toxicity"] },
];

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  async searchIngredients(query: string) {
    return this.prisma.ingredient.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { inci: { contains: query, mode: "insensitive" } },
          { aliases: { has: query } },
        ],
      },
      take: 20,
    });
  }

  async getIngredient(id: string) {
    return this.prisma.ingredient.findUnique({ where: { id } });
  }

  async getHarmfulList() {
    return this.prisma.ingredient.findMany({
      where: { riskLevel: { in: ["HIGH", "MODERATE"] } },
      orderBy: { riskLevel: "asc" },
    });
  }

  async checkIngredient(name: string) {
    const ingredient = await this.prisma.ingredient.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { inci: { equals: name, mode: "insensitive" } },
          { aliases: { has: name.toUpperCase() } },
        ],
      },
    });

    if (ingredient) return ingredient;

    // Check static list
    const match = HARMFUL_INGREDIENTS.find(
      (i) =>
        i.inci.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(i.inci.toLowerCase())
    );
    return match ? { ...match, id: "static", pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 8 } : null;
  }

  async seedHarmfulIngredients() {
    for (const ing of HARMFUL_INGREDIENTS) {
      await this.prisma.ingredient.upsert({
        where: { inci: ing.inci },
        create: {
          name: ing.name,
          inci: ing.inci,
          riskLevel: ing.riskLevel as never,
          concerns: ing.concerns,
          isParaben: ing.isParaben ?? false,
          isSulfate: ing.isSulfate ?? false,
          isPhthalate: ing.isPhthalate ?? false,
          isFormaldehydeReleaser: ing.isFormaldehydeReleaser ?? false,
          isSyntheticFragrance: ing.isSyntheticFragrance ?? false,
          pregnancySafe: false,
          sensitiveSkinSafe: false,
        },
        update: {},
      });
    }
  }
}
