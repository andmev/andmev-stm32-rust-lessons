import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  currentLang: string;
  availableLanguages: string[];
  languageNames: Record<string, string>;
  currentPath: string;
  basePath?: string;
}

/**
 * Builds a safe language-switching URL with path traversal prevention
 * Takes the current page path, extracts the language prefix, and replaces it with the target language
 * while preserving the rest of the path structure
 *
 * @param currentPath - The current page path (e.g., "/en/getting-started/" or "/base/es/about/")
 * @param lang - The target language code to switch to
 * @param basePath - The site's base path (empty for root, "/my-site" for subdirectory)
 * @param validLangs - Array of valid language codes for validation
 * @returns The new URL with the target language prefix
 *
 * @example
 * // Without base path
 * buildLanguageUrl('/en/about/', 'es', '', ['en', 'es']) // returns "/es/about/"
 *
 * @example
 * // With base path
 * buildLanguageUrl('/base/en/lesson/', 'uk', '/base', ['en', 'uk']) // returns "/base/uk/lesson/"
 */
function buildLanguageUrl(
  currentPath: string,
  lang: string,
  basePath: string,
  validLangs: string[]
): string {
  // Sanitize inputs - remove path traversal attempts
  const safePath = currentPath.replace(/\.\./g, '').replace(/\/+/g, '/');
  const normalizedBase = basePath.replace(/\/$/, '');

  // Extract path without base
  const pathWithoutBase =
    normalizedBase && safePath.startsWith(normalizedBase)
      ? safePath.slice(normalizedBase.length)
      : safePath;

  // More robust language removal using segment parsing
  const pathSegments = pathWithoutBase.split('/').filter(Boolean);
  const [firstSegment, ...restSegments] = pathSegments;

  // Validate first segment is a known language code
  const pathWithoutLang = validLangs.includes(firstSegment)
    ? '/' + restSegments.join('/')
    : pathWithoutBase;

  return `${normalizedBase}/${lang}${pathWithoutLang}`.replace(/\/+/g, '/');
}

export default function LanguagePickerIsland({
  currentLang,
  availableLanguages,
  languageNames,
  currentPath,
  basePath = '',
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
        className="bg-surface text-muted hover:text-foreground focus-visible:ring-foreground/20 focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition hover:shadow-[0px_14px_25px_0px_rgba(0,0,0,0.10)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {languageNames[currentLang] || currentLang.toUpperCase()}
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="size-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="bg-surface ring-foreground/10 absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl p-1 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] ring-1"
        >
          <div className="flex flex-col">
            {availableLanguages.map((code) => {
              const displayName = languageNames[code] || code.toUpperCase();
              const isCurrent = code === currentLang;
              const target = buildLanguageUrl(currentPath, code, basePath, availableLanguages);
              return (
                <a
                  key={code}
                  href={target}
                  role="menuitem"
                  className={[
                    'rounded-xl px-3 py-2 text-sm transition',
                    isCurrent ? 'text-foreground' : 'text-muted hover:text-foreground',
                    'hover:bg-foreground/5 focus-visible:ring-foreground/20 focus-visible:ring-2 focus-visible:outline-none',
                  ].join(' ')}
                >
                  {displayName}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
