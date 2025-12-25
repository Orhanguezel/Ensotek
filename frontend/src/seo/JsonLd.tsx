// src/seo/JsonLd.tsx
type Props = {
  data: Record<string, any>;
  id?: string;
};

export default function JsonLd({ data, id }: Props) {
  const scriptId = id ? `jsonld:${id}` : undefined;

  return (
    <script
      type="application/ld+json"
      {...(scriptId ? { id: scriptId } : {})}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
