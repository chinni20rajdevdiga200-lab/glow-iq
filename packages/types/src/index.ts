// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
  plan: SubscriptionPlan;
  createdAt: Date;
  profile?: SkinProfile;
}

export interface SkinProfile {
  id: string;
  userId: string;
  skinTone: SkinTone;
  undertone: Undertone;
  skinType: SkinType;
  concerns: SkinConcern[];
  hexColor?: string;
  rgb?: { r: number; g: number; b: number };
  beautyScore: number;
  skinHealthScore: number;
  updatedAt: Date;
}

// ─── Scan ────────────────────────────────────────────────────────────────────

export interface Scan {
  id: string;
  userId: string;
  imageUrl: string;
  beautyScore: number;
  skinHealthScore: number;
  skinTone: SkinTone;
  undertone: Undertone;
  skinType: SkinType;
  concerns: SkinConcernResult[];
  hexColor: string;
  rgb: { r: number; g: number; b: number };
  recommendations: string[];
  foundationShades: FoundationShade[];
  createdAt: Date;
}

export interface SkinConcernResult {
  type: SkinConcern;
  severity: Severity;
  score: number;
  description: string;
  tips: string[];
}

export interface FoundationShade {
  brand: string;
  shade: string;
  hex: string;
  matchScore: number;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl?: string;
  barcode?: string;
  ingredients: ProductIngredient[];
  safetyScore: number;
  pregnancySafetyScore: number;
  sensitiveSkinScore: number;
  overallRating: number;
  reviewCount: number;
  price?: number;
  currency?: string;
  createdAt: Date;
}

export interface ProductIngredient {
  name: string;
  inci: string;
  function: string;
  riskLevel: RiskLevel;
  description: string;
  concerns: string[];
  isHarmful: boolean;
  ewaScore?: number;
}

// ─── Ingredient ───────────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  name: string;
  inci: string;
  aliases: string[];
  function: string;
  riskLevel: RiskLevel;
  description: string;
  concerns: string[];
  isParaben: boolean;
  isSulfate: boolean;
  isPhthalate: boolean;
  isFormaldehydeReleaser: boolean;
  isSyntheticFragrance: boolean;
  pregnancySafe: boolean;
  sensitiveSkinSafe: boolean;
  ewaScore: number;
}

// ─── Community ────────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "avatar">;
  content: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "avatar">;
  productId: string;
  rating: number;
  content: string;
  helpful: number;
  createdAt: Date;
}

// ─── Routine ─────────────────────────────────────────────────────────────────

export interface Routine {
  id: string;
  userId: string;
  type: RoutineType;
  steps: RoutineStep[];
  generatedAt: Date;
}

export interface RoutineStep {
  order: number;
  category: ProductCategory;
  productName: string;
  instruction: string;
  duration?: string;
  tip?: string;
  productId?: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressPhoto {
  id: string;
  userId: string;
  imageUrl: string;
  scanId?: string;
  beautyScore?: number;
  skinHealthScore?: number;
  notes?: string;
  takenAt: Date;
}

export interface ProgressData {
  week: string;
  beautyScore: number;
  skinHealthScore: number;
  acneScore: number;
  pigmentationScore: number;
}

// ─── Subscription ────────────────────────────────────────────────────────────

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type SkinTone = "fair" | "light" | "medium" | "olive" | "tan" | "deep";
export type Undertone = "cool" | "warm" | "neutral";
export type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive";
export type SkinConcern =
  | "acne"
  | "dark_spots"
  | "pigmentation"
  | "wrinkles"
  | "eye_bags"
  | "pores"
  | "dryness"
  | "oiliness"
  | "redness"
  | "uneven_texture";
export type Severity = "none" | "mild" | "moderate" | "severe";
export type RiskLevel = "safe" | "moderate" | "high";
export type ProductCategory =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "sunscreen"
  | "foundation"
  | "concealer"
  | "blush"
  | "lipstick"
  | "eyeshadow"
  | "eyeliner"
  | "mascara"
  | "hair"
  | "treatment"
  | "mask"
  | "exfoliator"
  | "eye_cream";
export type RoutineType = "morning" | "night";
export type SubscriptionPlan = "free" | "premium" | "pro";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ScanAnalysisRequest {
  imageBase64: string;
  userId: string;
}

export interface ProductOCRRequest {
  imageBase64: string;
}

export interface RecommendationRequest {
  skinTone?: SkinTone;
  skinType?: SkinType;
  concerns?: SkinConcern[];
  budget?: "low" | "medium" | "high" | "luxury";
  categories?: ProductCategory[];
}
