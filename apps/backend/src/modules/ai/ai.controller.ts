import {
  Controller, Post, Body, Res, UseGuards, Get, Param
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { AiService } from "./ai.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

class AnalyzeFaceDto {
  imageBase64: string;
}

class AnalyzeIngredientsDto {
  ingredients: string[];
}

class OcrProductDto {
  imageBase64: string;
}

class ChatDto {
  message: string;
  sessionId: string;
}

@ApiTags("ai")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("analyze-face")
  @ApiOperation({ summary: "Analyze face image for skin profile" })
  async analyzeFace(@Body() dto: AnalyzeFaceDto) {
    return this.aiService.analyzeFace(dto.imageBase64);
  }

  @Post("analyze-ingredients")
  @ApiOperation({ summary: "Analyze ingredient list for safety" })
  async analyzeIngredients(@Body() dto: AnalyzeIngredientsDto) {
    return this.aiService.analyzeIngredients(dto.ingredients.join(", "));
  }

  @Post("ocr-product")
  @ApiOperation({ summary: "Extract and analyze ingredients from product image" })
  async ocrProduct(@Body() dto: OcrProductDto) {
    const ingredientText = await this.aiService.extractIngredientsFromImage(dto.imageBase64);
    const analysis = await this.aiService.analyzeIngredients(ingredientText);
    return { extractedText: ingredientText, ...analysis };
  }

  @Post("chat")
  @ApiOperation({ summary: "Stream AI beauty chatbot response" })
  async chat(
    @Body() dto: ChatDto,
    @CurrentUser() user: { skinProfile?: { skinTone?: string; skinType?: string; concerns?: string[] } },
    @Res() res: Response
  ) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    const context = {
      skinTone: user.skinProfile?.skinTone,
      skinType: user.skinProfile?.skinType,
      concerns: user.skinProfile?.concerns,
    };

    const stream = this.aiService.streamChat(dto.message, context, []);
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  }
}
