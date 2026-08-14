import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';

export default class R2StorageService {
  constructor() {
    // Cloudflare R2 uses account ID endpoint format: https://<account-id>.r2.cloudflarestorage.com
    const endpoint = process.env.R2_ENDPOINT || (process.env.R2_ACCOUNT_ID 
      ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined);

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || 'mock_key',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'mock_secret',
      },
    });
    this.bucketName = process.env.R2_BUCKET_NAME || 'mock_bucket';
  }

  async uploadFile(localFilePath, filename, mimeType) {
    const fileBuffer = fs.readFileSync(localFilePath);
    
    // Naming pattern to prevent collisions: publications/<timestamp>/<unique-id>-<safe-name>
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const objectKey = `publications/${Date.now()}/${uniqueId}-${safeFilename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.client.send(command);

    // Clean up local temp file
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.warn(`Could not clean up temporary file ${localFilePath}:`, err);
      }
    }

    return objectKey;
  }

  async getFileUrl(objectKey) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    // Generate signed URL expiring in 15 minutes (900 seconds)
    const signedUrl = await getSignedUrl(this.client, command, { expiresIn: 900 });
    return signedUrl;
  }

  async deleteFile(objectKey) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    await this.client.send(command);
    return true;
  }

  async fileExists(objectKey) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });
      await this.client.send(command);
      return true;
    } catch (err) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }
}
