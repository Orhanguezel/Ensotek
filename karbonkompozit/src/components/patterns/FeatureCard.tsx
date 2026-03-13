import type { ReactNode } from 'react';

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="surface-card rounded-xl p-6 text-center transition-shadow hover:shadow-lg">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-brand-light)]/10">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
    </div>
  );
}
