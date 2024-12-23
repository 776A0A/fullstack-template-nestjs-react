import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomStr } from '../utils';

const {
  VITE_CLOUDFLARE_R2_ACCOUNT_ID,
  VITE_CLOUDFLARE_R2_BUCKET,
  VITE_CLOUDFLARE_R2_REGION,
  VITE_CLOUDFLARE_R2_ACCESS_KEY_ID,
  VITE_CLOUDFLARE_R2_ACCESS_KEY_SECRET,
  VITE_CLOUDFLARE_R2_IMAGE_VIEW_URL,
} = import.meta.env;

export class OSS {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = VITE_CLOUDFLARE_R2_BUCKET;

    this.client = new S3Client({
      region: VITE_CLOUDFLARE_R2_REGION,
      endpoint: `https://${VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: VITE_CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: VITE_CLOUDFLARE_R2_ACCESS_KEY_SECRET,
      },
    });
  }

  async upload(
    file: File | Blob,
    key: string = `${Date.now()}-${randomStr()}.`,
  ): Promise<string> {
    const filename = 't2i/' + key + file.type.split('/')[1];

    const presignedUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({ Key: filename, Bucket: this.bucket }),
      { expiresIn: 60 * 60 * 24 },
    );

    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    const url = this.getImageUrl(filename);

    return url;
  }

  getImageUrl(key: string): string {
    return `${VITE_CLOUDFLARE_R2_IMAGE_VIEW_URL}/${key}`;
  }
}
