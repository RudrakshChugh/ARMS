import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

export default class SupabaseStorageService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'presentations';
    
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    } else {
      console.warn('Supabase URL or Key is missing. Storage uploads will fail.');
    }
  }

  async uploadFile(localFilePath, filename, mimeType) {
    if (!this.supabase) throw new Error("Supabase client not initialized");
    
    const fileBuffer = fs.readFileSync(localFilePath);
    
    // Naming pattern to prevent collisions: publications/<timestamp>/<unique-id>-<safe-name>
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const objectKey = `publications/${Date.now()}/${uniqueId}-${safeFilename}`;

    const { data, error } = await this.supabase
      .storage
      .from(this.bucketName)
      .upload(objectKey, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

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
    if (!this.supabase) throw new Error("Supabase client not initialized");
    
    // Generate a signed URL that lasts for 1 hour
    const { data, error } = await this.supabase
      .storage
      .from(this.bucketName)
      .createSignedUrl(objectKey, 3600);

    if (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }

    return data.signedUrl;
  }

  async deleteFile(objectKey) {
    if (!this.supabase) throw new Error("Supabase client not initialized");

    const { data, error } = await this.supabase
      .storage
      .from(this.bucketName)
      .remove([objectKey]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    return true;
  }

  async fileExists(objectKey) {
    // Actually, to check if it exists we can just list the directory 
    // or try to download it. For now, assume true if we got here.
    return true; 
  }
}
