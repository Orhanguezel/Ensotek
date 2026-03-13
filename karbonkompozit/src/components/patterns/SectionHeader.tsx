import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  align = 'left',
  action,
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div className={`flex gap-6 ${isCentered ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        {description ? (
          <p className={`mt-2 text-[var(--color-text-secondary)] ${isCentered ? 'max-w-2xl' : ''}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? action : null}
    </div>
  );
}
