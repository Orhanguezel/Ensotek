import type { ReactNode } from 'react';

export function BrandCtaPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <section className="surface-brand-cta rounded-3xl px-6 py-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="surface-brand-cta-subtle mt-2 max-w-2xl text-sm">{description}</p>
      {action}
    </section>
  );
}
