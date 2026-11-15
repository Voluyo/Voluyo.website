'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buttonStyles, cx } from '@/components/ui/primitives';
import type { Locale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavLinks, type NavItem } from './NavLinks';

export interface MobileNavLabels {
  primaryLabel: string;
  openMenu: string;
  closeMenu: string;
  languageLabel: string;
  login: string;
  signup: string;
}

export function MobileNav({
  locale,
  items,
  labels,
}: {
  locale: Locale;
  items: readonly NavItem[];
  labels: MobileNavLabels;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after any navigation, including language switches.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink"
      >
        <span className="sr-only">{open ? labels.closeMenu : labels.openMenu}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
        </svg>
      </button>

      <div
        id="mobile-menu"
        className={cx(
          'absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-line bg-paper shadow-card',
          open ? 'block' : 'hidden',
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
          <nav aria-label={labels.primaryLabel}>
            <NavLinks items={items} orientation="vertical" onNavigate={close} />
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <LanguageSwitcher locale={locale} label={labels.languageLabel} />
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/login`} onClick={close} className={buttonStyles.secondary}>
                {labels.login}
              </Link>
              <Link href={`/${locale}/signup`} onClick={close} className={buttonStyles.primary}>
                {labels.signup}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
