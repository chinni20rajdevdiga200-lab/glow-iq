import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
  ParseIntPipe, DefaultValuePipe, Request
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";

class AnalyzeIngredientsDto {
  text: string;
}

class ScanProductDto {
  imageBase64: string;
  skinTone?: string;
  skinType?: string;
}

@ApiTags("products")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("category") category?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number
  ) {
    return this.productsService.getProducts({ search, category, page, limit });
  }

  @Get("barcode/:barcode")
  findByBarcode(@Param("barcode") barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  @Post("scan")
  scanProduct(@Body() dto: ScanProductDto, @Request() req: { userId?: string }) {
    return this.productsService.scanProduct(dto.imageBase64, {
      skinTone: dto.skinTone,
      skinType: dto.skinType,
      userId: req.userId,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.getProduct(id);
  }

  @Post("analyze-ingredients")
  analyzeIngredients(@Body() dto: AnalyzeIngredientsDto) {
    return this.productsService.analyzeIngredientText(dto.text);
  }
}
