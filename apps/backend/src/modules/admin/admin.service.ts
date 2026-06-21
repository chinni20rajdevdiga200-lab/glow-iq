import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalScans, totalProducts, activeSubscriptions, recentUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.scan.count(),
      this.prisma.product.count(),
      this.prisma.subscription.count({ where: { status: "ACTIVE" } }),
      this.prisma.user.findMany({
        take: 10, orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, plan: true, createdAt: true },
      }),
    ]);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [newUsersThisWeek, scansThisWeek] = await Promise.all([
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.scan.count({ where: { createdAt: { gte: weekAgo } } }),
    ]);

    const planDistribution = await this.prisma.user.groupBy({
      by: ["plan"],
      _count: { plan: true },
    });

    return {
      totalUsers,
      totalScans,
      totalProducts,
      activeSubscriptions,
      newUsersThisWeek,
      scansThisWeek,
      planDistribution: planDistribution.reduce((acc, p) => {
        acc[p.plan] = p._count.plan;
        return acc;
      }, {} as Record<string, number>),
      recentUsers,
      mrr: activeSubscriptions * 9.99,
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { email: { contains: search, mode: "insensitive" as const } }] }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: "desc" },
        include: { profile: true, _count: { select: { scans: true } } },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, total, page, limit };
  }

  async getAnalytics() {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    const dailyScans = await Promise.all(
      last30Days.map(async (date) => {
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        const count = await this.prisma.scan.count({ where: { createdAt: { gte: start, lte: end } } });
        return { date: start.toISOString().split("T")[0], count };
      })
    );

    return { dailyScans };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldScans() {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const deleted = await this.prisma.scan.deleteMany({
      where: { createdAt: { lt: cutoff }, s3Key: null },
    });
    console.log(`Cleaned up ${deleted.count} old scans`);
  }
}
