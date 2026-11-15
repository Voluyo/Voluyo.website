'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { cx } from '@/components/ui/primitives';
import { LOCALES, LOCALE_NAMES, localizePathname, type Locale } from '@/i18n/config';

/** Switches the locale prefix of the current URL and keeps the search query (e.g. Explore filters). */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function keepQuery(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const query = window.location.search;
    if (!query) return;
    event.preventDefault();
    router.push(`${href}${query}`);
  }

  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-full border border-line bg-white p-0.5">
        {LOCALES.map((target) => {
          const href = localizePathname(pathname, target);
          const active = target === locale;
          return (
            <li key={target}>
              <Link
                href={href}
                hrefLang={target}
                lang={target}
                title={LOCALE_NAMES[target]}
                aria-current={active ? 'true' : undefined}
                onClick={(event) => keepQuery(event, href)}
                className={cx(
                  'block min-w-10 rounded-full px-2.5 py-1.5 text-center text-xs font-bold tracking-wider transition-colors',
                  active ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink',
                )}
              >
                <span aria-hidden="true">{target.toUpperCase()}</span>
                <span className="sr-only">{LOCALE_NAMES[target]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
