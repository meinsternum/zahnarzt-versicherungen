// Jede Komponente wird einzeln nach vorhandenen Umgebungsvariablen gewählt.
// So kann eine Vorschau z. B. echten Speicher (Supabase) mit simuliertem Kalender kombinieren.
import os from 'node:os';
import path from 'node:path';

export const onNetlify = () => Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
export const useSupabase = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) && process.env.STORE !== 'file';
export const useGoogle = () => Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) && process.env.CALENDAR !== 'demo';
export const useSmtp = () => Boolean(process.env.SMTP_HOST) && process.env.MAIL !== 'log';
export const testMode = () => !useGoogle() || !useSmtp();
export const dataDir = () => process.env.DATA_DIR || (onNetlify() ? path.join(os.tmpdir(), 'termin-data') : path.join(process.cwd(), '.data'));
