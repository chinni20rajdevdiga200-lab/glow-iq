import { Controller, Get, Post, Body, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { RecommendationsService } from "./recommendations.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

class GenerateRecsDto {
  categories?: string[];
  budget?: string;
}

@ApiTags("recommendations")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("recommendations")
export class RecommendationsController {
  constructor(private readonly service: RecommendationsService) {}

  @Get()
  findAll(
    @CurrentUser("id") userId: string,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.service.getRecommendations(userId, limit);
  }

  @Post("ai")
  generateAi(@CurrentUser("id") userId: string, @Body() dto: GenerateRecsDto) {
    return this.service.generateAiRecommendations(userId, dto);
  }
}
