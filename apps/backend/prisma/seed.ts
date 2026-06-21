import { PrismaClient, RiskLevel, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BeautyIQ database...");

  // ── Seed Ingredients ──────────────────────────────────────────────────────
  const ingredients = [
    // Safe ingredients
    { name: "Hyaluronic Acid", inci: "SODIUM HYALURONATE", function: "Humectant, anti-aging", riskLevel: RiskLevel.SAFE, description: "Powerful moisture-binding molecule that holds 1000x its weight in water.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: true, ewaScore: 1 },
    { name: "Niacinamide", inci: "NIACINAMIDE", function: "Vitamin B3, multi-benefit", riskLevel: RiskLevel.SAFE, description: "Reduces pores, brightens skin, controls oil, and strengthens barrier.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: true, ewaScore: 1 },
    { name: "Ceramide NP", inci: "CERAMIDE NP", function: "Skin barrier repair", riskLevel: RiskLevel.SAFE, description: "Lipid that maintains skin barrier integrity and prevents water loss.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: true, ewaScore: 1 },
    { name: "Glycerin", inci: "GLYCERIN", function: "Humectant, emollient", riskLevel: RiskLevel.SAFE, description: "Natural humectant that attracts moisture from the environment.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: true, ewaScore: 1 },
    { name: "Vitamin C (Ascorbic Acid)", inci: "ASCORBIC ACID", function: "Antioxidant, brightening", riskLevel: RiskLevel.SAFE, description: "Potent antioxidant that brightens skin and boosts collagen production.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: false, ewaScore: 1 },
    { name: "Retinol", inci: "RETINOL", function: "Anti-aging, cell turnover", riskLevel: RiskLevel.MODERATE, description: "Vitamin A derivative that accelerates cell renewal and reduces wrinkles.", concerns: ["Not safe during pregnancy", "Can cause initial irritation", "Increases sun sensitivity"], pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 5 },
    { name: "Zinc Oxide", inci: "ZINC OXIDE", function: "UV filter, anti-inflammatory", riskLevel: RiskLevel.SAFE, description: "Mineral sunscreen agent that physically blocks UV rays.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: true, ewaScore: 2 },
    { name: "Aloe Vera", inci: "ALOE BARBADENSIS LEAF JUICE", function: "Soothing, hydrating", riskLevel: RiskLevel.SAFE, description: "Natural plant extract with soothing and anti-inflammatory properties.", concerns: [], pregnancySafe: true, sensitiveSkinSafe: true, ewaScore: 1 },
    // Moderate risk
    { name: "Sodium Lauryl Sulfate", inci: "SODIUM LAURYL SULFATE", function: "Surfactant, cleansing", riskLevel: RiskLevel.MODERATE, description: "Detergent that creates lather but can be drying and irritating.", concerns: ["Skin irritation", "Strips natural oils", "Eye irritant"], isSulfate: true, pregnancySafe: true, sensitiveSkinSafe: false, ewaScore: 6 },
    { name: "Fragrance/Parfum", inci: "PARFUM", function: "Scent", riskLevel: RiskLevel.MODERATE, description: "A blend of undisclosed fragrance chemicals that can cause allergic reactions.", concerns: ["Potential allergen", "Undisclosed ingredients", "Irritant for sensitive skin"], isSyntheticFragrance: true, pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 8 },
    { name: "Methylparaben", inci: "METHYLPARABEN", function: "Preservative", riskLevel: RiskLevel.MODERATE, description: "Common paraben preservative with estrogenic activity concerns.", concerns: ["Possible hormone disruption", "Estrogenic activity", "Environmental persistence"], isParaben: true, pregnancySafe: false, sensitiveSkinSafe: true, ewaScore: 6 },
    // High risk
    { name: "Hydroquinone", inci: "HYDROQUINONE", function: "Skin lightening", riskLevel: RiskLevel.HIGH, description: "Potent skin lightener banned in EU. Risk of ochronosis with prolonged use.", concerns: ["Banned in EU and UK", "Potential carcinogen", "Ochronosis risk", "Not safe during pregnancy"], pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 9 },
    { name: "Formaldehyde", inci: "FORMALDEHYDE", function: "Preservative", riskLevel: RiskLevel.HIGH, description: "Known carcinogen and skin sensitizer. Often found in nail products.", concerns: ["Known carcinogen", "Strong allergen", "Occupational hazard"], isFormaldehydeReleaser: true, pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 10 },
    { name: "Oxybenzone", inci: "BENZOPHENONE-3", function: "UV filter", riskLevel: RiskLevel.HIGH, description: "Chemical UV filter with hormone disruption concerns and coral reef toxicity.", concerns: ["Hormone disruption", "Coral reef damage", "Detected in breast milk", "Systemic absorption"], pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 8 },
    { name: "Triclosan", inci: "TRICLOSAN", function: "Antimicrobial", riskLevel: RiskLevel.HIGH, description: "Antimicrobial agent linked to antibiotic resistance and hormone disruption.", concerns: ["Antibiotic resistance", "Hormone disruption", "Environmental toxin", "Banned in some products"], pregnancySafe: false, sensitiveSkinSafe: false, ewaScore: 7 },
  ];

  for (const ing of ingredients) {
    await prisma.ingredient.upsert({
      where: { inci: ing.inci },
      create: {
        name: ing.name,
        inci: ing.inci,
        function: ing.function,
        riskLevel: ing.riskLevel,
        description: ing.description,
        concerns: ing.concerns,
        isParaben: (ing as { isParaben?: boolean }).isParaben ?? false,
        isSulfate: (ing as { isSulfate?: boolean }).isSulfate ?? false,
        isSyntheticFragrance: (ing as { isSyntheticFragrance?: boolean }).isSyntheticFragrance ?? false,
        isFormaldehydeReleaser: ing.isFormaldehydeReleaser ?? false,
        pregnancySafe: ing.pregnancySafe,
        sensitiveSkinSafe: ing.sensitiveSkinSafe,
        ewaScore: ing.ewaScore,
      },
      update: {},
    });
  }
  console.log(`✅ Seeded ${ingredients.length} ingredients`);

  // ── Seed Sample Products ──────────────────────────────────────────────────
  const products = [
    { name: "Vitamin C 20% Serum", brand: "The Ordinary", category: ProductCategory.SERUM, safetyScore: 92, overallRating: 4.8, reviewCount: 2341, price: 12 },
    { name: "Hydrating Cleanser", brand: "CeraVe", category: ProductCategory.CLEANSER, safetyScore: 95, overallRating: 4.9, reviewCount: 5621, price: 15 },
    { name: "Niacinamide 10% + Zinc 1%", brand: "The Ordinary", category: ProductCategory.SERUM, safetyScore: 94, overallRating: 4.8, reviewCount: 3420, price: 7 },
    { name: "Ultra Repair Cream", brand: "First Aid Beauty", category: ProductCategory.MOISTURIZER, safetyScore: 88, overallRating: 4.7, reviewCount: 1823, price: 36 },
    { name: "Daily Sun Defense SPF50", brand: "Kiehl's", category: ProductCategory.SUNSCREEN, safetyScore: 90, overallRating: 4.6, reviewCount: 987, price: 45 },
    { name: "Pro-Filt'r Foundation", brand: "Fenty Beauty", category: ProductCategory.FOUNDATION, safetyScore: 82, overallRating: 4.7, reviewCount: 8932, price: 40 },
    { name: "Retinol 0.5% Serum", brand: "Paula's Choice", category: ProductCategory.TREATMENT, safetyScore: 78, overallRating: 4.6, reviewCount: 2190, price: 52 },
    { name: "Rose Water Toner", brand: "Mario Badescu", category: ProductCategory.TONER, safetyScore: 85, overallRating: 4.4, reviewCount: 4201, price: 18 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { barcode: `SEED-${product.name.replace(/\s+/g, "-").toUpperCase()}` },
      create: {
        ...product,
        barcode: `SEED-${product.name.replace(/\s+/g, "-").toUpperCase()}`,
        isVerified: true,
        pregnancySafetyScore: product.safetyScore * 0.9,
        sensitiveSkinScore: product.safetyScore * 0.85,
      },
      update: {},
    });
  }
  console.log(`✅ Seeded ${products.length} products`);

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
