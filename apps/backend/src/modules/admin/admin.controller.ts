import { Controller, Get, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get("stats")
  getStats() {
    return this.service.getDashboardStats();
  }

  @Get("users")
  getUsers(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("search") search?: string
  ) {
    return this.service.getUsers(page, limit, search);
  }

  @Get("analytics")
  getAnalytics() {
    return this.service.getAnalytics();
  }
}
