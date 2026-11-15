'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/components/ui/primitives';

export interface NavItem {
  href: string;
  label: string;
}

export function NavLinks({
  items,
  orientation = 'horizontal',
  onNavigate,
}: {
  items: readonly NavItem[];
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className={orientation === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-1'}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cx(
                'block rounded-full text-sm font-medium transition-colors',
                orientation === 'horizontal' ? 'px-3.5 py-2' : 'px-4 py-3 text-base',
                active ? 'bg-sand-100 text-ink' : 'text-ink-soft hover:bg-sand-100 hover:text-ink',
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
