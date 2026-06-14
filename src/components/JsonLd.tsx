import React from 'react';

interface JsonLdProps {
  data: unknown;
}

export default function JsonLd({ data }: JsonLdProps) {
  // Escape characters that break or hijack inline JSON-in-HTML. Third-party comic
  // titles/synopses routinely contain `<`, `</script>`, `&`, and the JS line/paragraph
  // separators; unescaped, a single one corrupts ALL structured data on the page (and
  // `</script>` is a stored-XSS vector). A spec-compliant JSON-LD parser decodes these
  // back, so output is identical for clean data — only malformed/injection cases change.
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
