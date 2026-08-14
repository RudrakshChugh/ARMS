import LocalStorageService from './LocalStorageService.js';
import SupabaseStorageService from './SupabaseStorageService.js';

const provider = process.env.STORAGE_PROVIDER || 'local';

let storageService;

if (provider === 'supabase') {
  storageService = new SupabaseStorageService();
} else {
  storageService = new LocalStorageService();
}

export default storageService;
export { LocalStorageService, SupabaseStorageService };
