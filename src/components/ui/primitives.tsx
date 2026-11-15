import type { ReactNode } from 'react';

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

type BadgeTone = 'sea' | 'sun' | 'neutral' | 'demo' | 'planned' | 'live';

const badgeTones: Record<BadgeTone, string> = {
  sea: 'bg-sea-50 text-sea-700 ring-sea-200',
  sun: 'bg-sun-200/60 text-ink ring-sun-400/40',
  neutral: 'bg-sand-100 text-ink-soft ring-line',
  demo: 'bg-demo-100 text-demo-800 ring-demo-800/20',
  planned: 'bg-sand-100 text-ink-soft ring-line',
  live: 'bg-sea-50 text-sea-700 ring-sea-200',
};

export function Badge({
  children,
  tone = 'neutral',
  title,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  title?: string;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type NoticeTone = 'info' | 'danger' | 'demo' | 'placeholder';

const noticeTones: Record<NoticeTone, string> = {
  info: 'border-sea-200 bg-sea-50 text-sea-900',
  danger: 'border-danger-700/30 bg-danger-50 text-danger-700',
  demo: 'border-demo-800/20 bg-demo-100 text-demo-800',
  placeholder: 'border-line bg-sand-100 text-ink',
};

export function Notice({
  children,
  tone = 'info',
  title,
  role,
  className,
}: {
  children: ReactNode;
  tone?: NoticeTone;
  title?: string;
  role?: 'note' | 'alert' | 'status';
  className?: string;
}) {
  return (
    <div role={role} className={cx('rounded-2xl border px-4 py-3 text-sm leading-relaxed', noticeTones[tone], className)}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? 'mt-1' : undefined}>{children}</div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-white/60 px-6 py-12 text-center">
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{body}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function PageHeader({ eyebrow, title, lead }: { eyebrow?: ReactNode; title: string; lead?: string }) {
  return (
    <header className="max-w-3xl py-10 sm:py-14">
      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
      <h1 className="text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">{title}</h1>
      {lead ? <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p> : null}
    </header>
  );
}

export const buttonStyles = {
  primary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-sea-800',
  secondary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-ink/40',
  sun: 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sun-500 px-5 text-sm font-semibold text-ink transition-colors hover:bg-sun-400',
} as const;
