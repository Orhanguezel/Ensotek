import Link from 'next/link';
import { LinkListPanel } from '@/components/patterns/LinkListPanel';

type RelatedItem = {
  id?: string;
  slug?: string;
  title?: string;
};

export function RelatedLinks({
  title,
  hrefBase,
  items,
}: {
  title: string;
  hrefBase: string;
  items: RelatedItem[];
}) {
  if (items.length === 0) return null;

  return (
    <LinkListPanel title={title}>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id ?? item.slug}>
            <Link
              href={`${hrefBase}/${item.slug}`}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-brand)] hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </LinkListPanel>
  );
}
