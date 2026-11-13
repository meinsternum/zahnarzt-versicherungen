// Gemeinsame Daten und Schema für beide Startseiten-Entwürfe.
import { getCollection } from 'astro:content';
import { visible } from './status';
import { gruppiere } from './phasen';
import { faq } from './startseite';
import { ORGANISATION as O, SITE_URL, SITE_NAME } from './site';

export async function ladeStartseite() {
  const seiten = visible(await getCollection('situationen')).sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const gruppen = gruppiere(seiten);
  const themenLinks = seiten.map((s) => ({ href: `/ratgeber/${s.id}`, text: s.data.frage }));

  const organisation = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organisation`,
    name: O.name,
    url: O.url,
    telephone: '+49 221 98654436',
    email: O.email,
    address: { '@type': 'PostalAddress', streetAddress: O.strasse, postalCode: O.plz, addressLocality: O.ort, addressCountry: 'DE' },
    founder: { '@type': 'Person', name: 'Patrick Senn', jobTitle: 'Geschäftsführer' },
  };
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, inLanguage: 'de', publisher: { '@id': `${SITE_URL}/#organisation` } },
    organisation,
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.eintraege.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: f.antwort } })),
    },
  ];
  return { seiten, gruppen, themenLinks, jsonLd };
}
