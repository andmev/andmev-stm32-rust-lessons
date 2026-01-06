import { config, type Language } from '@/config';

export const DEFAULT_LANGUAGE = config.languages.default;
export const SUPPORTED_LANGUAGES = config.languages.supported;
export const LANGUAGE_DISPLAY_NAMES = config.languages.names;
export type { Language };
