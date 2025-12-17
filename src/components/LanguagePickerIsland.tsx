import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  currentLang: string;
  availableLanguages: string[];
  languageNames: Record<string, string>;
  currentPath: string;
  basePath?: string;
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
        className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-sm text-muted transition hover:text-foreground hover:shadow-[0px_14px_25px_0px_rgba(0,0,0,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl bg-surface p-1 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-foreground/10"
        >
          <div className="flex flex-col">
            {availableLanguages.map((code) => {
              const displayName = languageNames[code] || code.toUpperCase();
              const isCurrent = code === currentLang;
              const normalizedBase = basePath.replace(/\/$/, '');
              const pathWithoutBase = normalizedBase && currentPath.startsWith(normalizedBase)
                ? currentPath.slice(normalizedBase.length)
                : currentPath;
              const pathWithoutLang = pathWithoutBase.replace(/^\/[a-z]{2}/, '');
              const target = `${normalizedBase}/${code}${pathWithoutLang}`.replace(/\/{2,}/g, '/');
              return (
                <a
                  key={code}
                  href={target}
                  role="menuitem"
                  className={[
                    'rounded-xl px-3 py-2 text-sm transition',
                    isCurrent ? 'text-foreground' : 'text-muted hover:text-foreground',
                    'hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20',
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
