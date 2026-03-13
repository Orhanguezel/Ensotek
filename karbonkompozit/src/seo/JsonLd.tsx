type Thing = Record<string, unknown>;

export function JsonLd({ data }: { data: Thing }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
