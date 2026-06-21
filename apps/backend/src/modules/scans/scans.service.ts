import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";
import { AiService } from "../ai/ai.service";
import { S3Service } from "../../common/s3.service";

@Injectable()
export class ScansService {
  private readonly logger = new Logger(ScansService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private s3Service: S3Service
  ) {}

  async createScan(userId: string, imageBase64: string) {
    this.logger.log(`Creating scan for user ${userId}`);

    // Run AI analysis
    const analysis = await this.aiService.analyzeFace(imageBase64);

    // Upload image to S3
    let imageUrl: string | undefined;
    let s3Key: string | undefined;
    try {
      const result = await this.s3Service.uploadBase64Image(imageBase64, `scans/${userId}`);
      imageUrl = result.url;
      s3Key = result.key;
    } catch (err) {
      this.logger.warn("Failed to upload scan image to S3:", err);
    }

    // Save scan to DB
    const scan = await this.prisma.scan.create({
      data: {
        userId,
        imageUrl,
        s3Key,
        beautyScore: analysis.beautyScore,
        skinHealthScore: analysis.skinHealthScore,
        skinTone: analysis.skinTone,
        undertone: analysis.undertone,
        skinType: analysis.skinType,
        hexColor: analysis.hexColor,
        rgbR: analysis.rgb.r,
        rgbG: analysis.rgb.g,
        rgbB: analysis.rgb.b,
        concerns: analysis.concerns,
        recommendations: analysis.recommendations,
        foundationShades: analysis.foundationShades,
        rawAiResponse: analysis as object,
      },
    });

    // Update user skin profile
    await this.prisma.skinProfile.upsert({
      where: { userId },
      create: {
        userId,
        skinTone: analysis.skinTone.toUpperCase() as never,
        undertone: analysis.undertone.toUpperCase() as never,
        skinType: analysis.skinType.toUpperCase() as never,
        concerns: analysis.concerns.map((c) => c.type),
        hexColor: analysis.hexColor,
        rgbR: analysis.rgb.r,
        rgbG: analysis.rgb.g,
        rgbB: analysis.rgb.b,
        beautyScore: analysis.beautyScore,
        skinHealthScore: analysis.skinHealthScore,
        scanCount: 1,
        lastScanAt: new Date(),
      },
      update: {
        skinTone: analysis.skinTone.toUpperCase() as never,
        undertone: analysis.undertone.toUpperCase() as never,
        skinType: analysis.skinType.toUpperCase() as never,
        concerns: analysis.concerns.map((c) => c.type),
        hexColor: analysis.hexColor,
        rgbR: analysis.rgb.r,
        rgbG: analysis.rgb.g,
        rgbB: analysis.rgb.b,
        beautyScore: analysis.beautyScore,
        skinHealthScore: analysis.skinHealthScore,
        scanCount: { increment: 1 },
        lastScanAt: new Date(),
      },
    });

    return { ...scan, concerns: analysis.concerns, recommendations: analysis.recommendations, foundationShades: analysis.foundationShades };
  }

  async getScans(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [scans, total] = await Promise.all([
      this.prisma.scan.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true, beautyScore: true, skinHealthScore: true, skinTone: true,
          undertone: true, hexColor: true, concerns: true, createdAt: true, imageUrl: true,
        },
      }),
      this.prisma.scan.count({ where: { userId } }),
    ]);

    return { data: scans, total, page, limit, hasMore: skip + limit < total };
  }

  async getScan(userId: string, scanId: string) {
    const scan = await this.prisma.scan.findFirst({
      where: { id: scanId, userId },
    });

    if (!scan) throw new NotFoundException("Scan not found");

    return {
      ...scan,
      concerns: scan.concerns,
      recommendations: scan.recommendations,
      foundationShades: scan.foundationShades,
      rgb: { r: scan.rgbR, g: scan.rgbG, b: scan.rgbB },
    };
  }

  async deleteScan(userId: string, scanId: string) {
    const scan = await this.prisma.scan.findFirst({ where: { id: scanId, userId } });
    if (!scan) throw new NotFoundException("Scan not found");

    if (scan.s3Key) {
      await this.s3Service.deleteObject(scan.s3Key).catch(() => {});
    }

    return this.prisma.scan.delete({ where: { id: scanId } });
  }
}
