import LocalStorageService from './LocalStorageService.js';
import SupabaseStorageService from './SupabaseStorageService.js';
import R2StorageService from './R2StorageService.js';

const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

let storageService;

if (provider === 'supabase') {
  storageService = new SupabaseStorageService();
} else if (provider === 'r2') {
  storageService = new R2StorageService();
} else {
  if (provider !== 'local') {
    console.warn(`Unknown STORAGE_PROVIDER "${provider}". Falling back to local disk storage.`);
  }
  storageService = new LocalStorageService();
}

export default storageService;
export { LocalStorageService, SupabaseStorageService, R2StorageService };
