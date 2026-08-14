import fs from 'fs';
import path from 'path';

export default class LocalStorageService {
  async uploadFile(localFilePath, filename, mimeType) {
    // For local storage, the file is already uploaded to uploads/ by Multer
    // We simply return the public uploads path
    return `/uploads/${filename}`;
  }

  async getFileUrl(objectKey) {
    // For local storage, the objectKey is already the path (e.g. /uploads/filename)
    // Return it as is, frontend resolves it with host
    return objectKey;
  }

  async deleteFile(objectKey) {
    const filename = path.basename(objectKey);
    const localPath = path.join('uploads', filename);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return true;
  }

  async fileExists(objectKey) {
    const filename = path.basename(objectKey);
    const localPath = path.join('uploads', filename);
    return fs.existsSync(localPath);
  }
}
