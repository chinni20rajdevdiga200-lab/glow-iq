import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private config: ConfigService) {
    this.region = this.config.get("AWS_REGION", "us-east-1");
    this.bucket = this.config.get("AWS_S3_BUCKET", "beautyiq-uploads");
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.config.get("AWS_ACCESS_KEY_ID", ""),
        secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY", ""),
      },
    });
  }

  async uploadBase64Image(
    base64: string,
    folder: string
  ): Promise<{ url: string; key: string }> {
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid base64 image");

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const ext = mimeType.split("/")[1] ?? "jpg";
    const key = `${folder}/${uuid()}.${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: "max-age=31536000",
      })
    );

    return {
      url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
      key,
    };
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
    );
    this.logger.log(`Deleted S3 object: ${key}`);
  }
}
