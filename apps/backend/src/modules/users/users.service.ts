import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: { select: { scans: true, posts: true, followers: true, following: true } },
      },
    });
    if (!user) throw new NotFoundException("User not found");

    return {
      ...user,
      scanCount: user._count.scans,
      postCount: user._count.posts,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      skinTone: user.profile?.skinTone?.toLowerCase(),
      undertone: user.profile?.undertone?.toLowerCase(),
      skinType: user.profile?.skinType?.toLowerCase(),
      concerns: user.profile?.concerns ?? [],
      beautyScore: user.profile?.beautyScore ?? 0,
      skinHealthScore: user.profile?.skinHealthScore ?? 0,
      streak: user.profile?.streakDays ?? 0,
    };
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: { profile: true },
    });
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, avatar: true,
        profile: { select: { skinTone: true, beautyScore: true } },
        _count: { select: { scans: true, posts: true, followers: true } },
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
