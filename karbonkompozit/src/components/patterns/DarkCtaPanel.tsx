import type { ReactNode } from 'react';

export function DarkCtaPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="surface-glass-dark shadow-dark-panel mx-auto max-w-3xl rounded-[2rem] p-8 text-center lg:p-10">
      <h2 className="surface-dark-heading text-3xl font-bold">{title}</h2>
      <p className="surface-dark-text mx-auto mt-4 max-w-xl">{description}</p>
      {action}
    </div>
  );
}
