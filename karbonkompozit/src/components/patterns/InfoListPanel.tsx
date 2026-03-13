type InfoListPanelProps = {
  title: string;
  items: string[];
  accentText?: string;
};

export function InfoListPanel({
  title,
  items,
  accentText,
}: InfoListPanelProps) {
  return (
    <section className="surface-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-secondary)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {accentText ? (
        <p className="mt-6 text-sm font-medium text-[var(--color-brand)]">{accentText}</p>
      ) : null}
    </section>
  );
}
