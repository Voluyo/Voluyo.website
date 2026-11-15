import Link from 'next/link';
import { Container, buttonStyles } from '@/components/ui/primitives';
import type { Locale } from '@/i18n/config';
import { interpolate } from '@/i18n/format';
import type { Dictionary } from '@/i18n/get-dictionary';
import { LEGAL_DOCS } from '@/i18n/dictionaries/shared';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NavLinks, type NavItem } from './NavLinks';

function primaryNav(locale: Locale, dict: Dictionary): NavItem[] {
  return [
    { href: `/${locale}/explore`, label: dict.nav.explore },
    { href: `/${locale}/how-it-works`, label: dict.nav.howItWorks },
    { href: `/${locale}/become-a-host`, label: dict.nav.becomeHost },
    { href: `/${locale}/help`, label: dict.nav.help },
  ];
}

/**
 * PROVISIONAL text wordmark. The official voluyo logo exists but is not yet verified in
 * this repository — it must replace this component, not be redrawn here.
 */
export function Wordmark({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  return (
    <Link
      href={`/${locale}`}
      aria-label={label}
      className={`font-display text-[1.7rem] font-semibold leading-none tracking-tight ${className ?? 'text-ink'}`}
    >
      voluyo
    </Link>
  );
}

export function DemoBanner({ dict }: { dict: Dictionary }) {
  return (
    <div role="note" className="bg-demo-100 text-demo-800">
      <Container className="flex items-start gap-3 py-2 text-xs leading-relaxed sm:text-sm">
        <span className="mt-px shrink-0 rounded-full bg-demo-800 px-2 py-px text-[0.7rem] font-bold uppercase tracking-wider text-demo-100">
          {dict.demo.badge}
        </span>
        <p>{dict.demo.banner}</p>
      </Container>
    </div>
  );
}

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = primaryNav(locale, dict);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-6">
        <Wordmark locale={locale} label={dict.brand.homeLabel} />
        <nav aria-label={dict.nav.primaryLabel} className="hidden lg:block">
          <NavLinks items={items} />
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} label={dict.nav.languageLabel} />
          <Link href={`/${locale}/login`} className="rounded-full px-3 py-2 text-sm font-semibold text-ink hover:bg-sand-100">
            {dict.nav.login}
          </Link>
          <Link href={`/${locale}/signup`} className={buttonStyles.primary}>
            {dict.nav.signup}
          </Link>
        </div>
        <div className="ml-auto lg:hidden">
          <MobileNav
            locale={locale}
            items={items}
            labels={{
              primaryLabel: dict.nav.primaryLabel,
              openMenu: dict.nav.openMenu,
              closeMenu: dict.nav.closeMenu,
              languageLabel: dict.nav.languageLabel,
              login: dict.nav.login,
              signup: dict.nav.signup,
            }}
          />
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-sea-950 text-sea-100">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark locale={locale} label={dict.brand.homeLabel} className="text-paper" />
          <p className="mt-4 max-w-xs font-display text-xl italic leading-snug text-sea-100">{dict.brand.slogan}</p>
        </div>
        <nav aria-label={dict.footer.navTitle}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sea-200">{dict.footer.navTitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {primaryNav(locale, dict).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sea-100 underline-offset-4 hover:text-paper hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={dict.footer.legalTitle}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sea-200">{dict.footer.legalTitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {LEGAL_DOCS.map((doc) => (
              <li key={doc}>
                <Link href={`/${locale}/legal/${doc}`} className="text-sea-100 underline-offset-4 hover:text-paper hover:underline">
                  {dict.legal.docs[doc]}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-sea-200/30 px-3 py-2 text-xs leading-relaxed text-sea-200">
            {dict.footer.legalNote}
          </p>
        </nav>
      </Container>
      <div className="border-t border-sea-200/15">
        <Container className="py-5 text-xs text-sea-200">{interpolate(dict.footer.rights, { year })}</Container>
      </div>
    </footer>
  );
}
