export function ContentPageHeader({
  title,
  description,
  intro,
}: {
  title: string;
  description?: string;
  intro?: string;
}) {
  return (
    <>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-[var(--color-text-secondary)]">{description}</p>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)]">{intro}</p>
      ) : null}
    </>
  );
}
