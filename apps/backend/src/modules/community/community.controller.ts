import { Controller, Get, Post, Param, Body, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CommunityService } from "./community.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

class CreatePostDto {
  content: string;
  imageUrl?: string;
  tags?: string[];
}

@ApiTags("community")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("community")
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @Get("posts")
  getPosts(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.service.getPosts(page, limit);
  }

  @Post("posts")
  createPost(@CurrentUser("id") userId: string, @Body() dto: CreatePostDto) {
    return this.service.createPost(userId, dto);
  }

  @Post("posts/:id/like")
  likePost(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.service.likePost(userId, id);
  }
}
