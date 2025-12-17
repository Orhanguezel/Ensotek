// src/seo/JsonLd.tsx
type Props = {
  data: Record<string, any>;
  id?: string;
};

export default function JsonLd({ data, id }: Props) {
  const key = id ? `jsonld:${id}` : undefined;

  return (
    <script
      type="application/ld+json"
      {...(key ? { "data-jsonld-id": key } : {})}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
