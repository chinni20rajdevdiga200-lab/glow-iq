import { Controller, Get, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

class UpdateProfileDto {
  name?: string;
  avatar?: string;
}

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  getProfile(@CurrentUser("id") userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch("profile")
  updateProfile(@CurrentUser("id") userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get(":id/public")
  getPublicProfile(@Param("id") id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
