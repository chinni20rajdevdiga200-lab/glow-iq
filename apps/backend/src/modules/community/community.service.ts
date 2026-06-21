import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getPosts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        skip, take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
      this.prisma.communityPost.count(),
    ]);
    return { data: posts, total, page, limit };
  }

  async createPost(userId: string, data: { content: string; imageUrl?: string; tags?: string[] }) {
    return this.prisma.communityPost.create({
      data: { userId, ...data, tags: data.tags ?? [] },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async likePost(userId: string, postId: string) {
    return this.prisma.communityPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
  }
}
