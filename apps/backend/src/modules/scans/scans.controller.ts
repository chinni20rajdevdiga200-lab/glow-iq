import {
  Controller, Post, Get, Delete, Body, Param, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ScansService } from "./scans.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

class CreateScanDto {
  imageBase64: string;
}

@ApiTags("scans")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("scans")
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post()
  @ApiOperation({ summary: "Create a new AI skin scan" })
  create(@Body() dto: CreateScanDto, @CurrentUser("id") userId: string) {
    return this.scansService.createScan(userId, dto.imageBase64);
  }

  @Get()
  @ApiOperation({ summary: "Get user's scan history" })
  findAll(
    @CurrentUser("id") userId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.scansService.getScans(userId, page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific scan result" })
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.scansService.getScan(userId, id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a scan" })
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.scansService.deleteScan(userId, id);
  }
}
