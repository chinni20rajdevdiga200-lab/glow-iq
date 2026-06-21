import { Module } from "@nestjs/common";
import { ScansController } from "./scans.controller";
import { ScansService } from "./scans.service";
import { AiModule } from "../ai/ai.module";
import { S3Service } from "../../common/s3.service";

@Module({
  imports: [AiModule],
  controllers: [ScansController],
  providers: [ScansService, S3Service],
  exports: [ScansService],
})
export class ScansModule {}
