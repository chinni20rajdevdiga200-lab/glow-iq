import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IngredientsService } from "./ingredients.service";
import { ClerkAuthGuard } from "../../common/guards/clerk-auth.guard";

@ApiTags("ingredients")
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly service: IngredientsService) {}

  @Get()
  search(@Query("q") q: string) {
    return this.service.searchIngredients(q ?? "");
  }

  @Get("harmful")
  getHarmful() {
    return this.service.getHarmfulList();
  }

  @Get("check/:name")
  check(@Param("name") name: string) {
    return this.service.checkIngredient(name);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.getIngredient(id);
  }
}
