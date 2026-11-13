// JSON-LD-Bausteine. Nur Angaben, die sichtbar auf der Seite oder im Impressum stehen.
import { ORGANISATION as O, SITE_URL, SITE_NAME, SOCIAL } from './site';

export const ORG_ID = `${SITE_URL}/#organisation`;
export const PERSON_ID = `${SITE_URL}/ueber-uns#patrick-senn`;

export function organisation() {
  const sameAs = [O.url, ...SOCIAL.filter((s) => s.url).map((s) => s.url as string)];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: O.name,
    url: O.url,
    telephone: O.telefonSchema,
    email: O.email,
    address: { '@type': 'PostalAddress', streetAddress: O.strasse, postalCode: O.plz, addressLocality: O.ort, addressCountry: 'DE' },
    founder: { '@id': PERSON_ID },
    sameAs,
  };
}

export function person() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Patrick Senn',
    jobTitle: 'Geschäftsführer',
    worksFor: { '@id': ORG_ID },
    url: `${SITE_URL}/ueber-uns`,
  };
}

export function website() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, inLanguage: 'de', publisher: { '@id': ORG_ID } };
}

export type Krume = { name: string; href: string };
export function breadcrumbs(krumen: Krume[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: krumen.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: k.name, item: new URL(k.href, SITE_URL).toString() })),
  };
}

export function faqPage(eintraege: { frage: string; antwort: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: eintraege.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: f.antwort } })),
  };
}
