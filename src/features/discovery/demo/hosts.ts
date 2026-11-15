/**
 * SYNTHETIC DEMO DATA — fictional hosts for development previews only.
 * Names, places and descriptions are invented; they do not describe real organizations or
 * people. No addresses, coordinates, contact details or verification state are included.
 * The repository never serves these records in production builds.
 */
import type { PublicHostProfile } from '@/domain/discovery';

export const DEMO_HOSTS: readonly PublicHostProfile[] = [
  {
    id: 'demo-host-mares',
    slug: 'mares-learning-collective',
    name: 'Marés Learning Collective',
    hostType: 'ngo',
    location: { countryCode: 'PT', city: { en: 'Lisbon', de: 'Lissabon' } },
    languages: ['pt', 'en'],
    summary: {
      en: 'A neighbourhood NGO running free language cafés for newcomers and neighbours.',
      de: 'Eine Nachbarschafts-NGO mit kostenlosen Sprachcafés für Neuankömmlinge und Nachbarn.',
    },
    description: {
      en: 'Marés hosts weekly language cafés in a riverside neighbourhood, where newcomers practise everyday conversation with locals. Volunteers lead conversation tables and help document the project for the community.',
      de: 'Marés veranstaltet wöchentliche Sprachcafés in einem Viertel am Fluss, in denen Neuankömmlinge Alltagsgespräche mit Einheimischen üben. Freiwillige leiten Gesprächstische und helfen, das Projekt für die Gemeinschaft zu dokumentieren.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-valle-alto',
    slug: 'valle-alto-community-workshop',
    name: 'Valle Alto Community Workshop',
    hostType: 'aid_community_project',
    location: { countryCode: 'PE', city: { en: 'Cusco', de: 'Cusco' } },
    languages: ['es', 'qu'],
    summary: {
      en: 'A community workshop building shared gardens and tools with villages in the highlands.',
      de: 'Eine Gemeinschaftswerkstatt, die mit Dörfern im Hochland gemeinsame Gärten und Werkzeuge aufbaut.',
    },
    description: {
      en: 'Valle Alto brings neighbours together to build raised beds, repair tools and share harvests. Volunteers work alongside local families and learn traditional growing methods in return.',
      de: 'Valle Alto bringt Nachbarn zusammen, um Hochbeete zu bauen, Werkzeuge zu reparieren und Ernten zu teilen. Freiwillige arbeiten mit Familien vor Ort und lernen im Gegenzug traditionelle Anbaumethoden kennen.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-alba-serena',
    slug: 'hotel-alba-serena',
    name: 'Hotel Alba Serena',
    hostType: 'hotel',
    location: { countryCode: 'ES', city: { en: 'Valencia', de: 'Valencia' } },
    languages: ['es', 'ca', 'en'],
    summary: {
      en: 'A small family-run hotel that opens its kitchen for neighbourhood cooking evenings.',
      de: 'Ein kleines familiengeführtes Hotel, das seine Küche für Kochabende in der Nachbarschaft öffnet.',
    },
    description: {
      en: 'Alba Serena hosts open cooking evenings where guests, neighbours and travelers share recipes from home. Volunteers help shape the programme and bring their own food traditions.',
      de: 'Im Alba Serena finden offene Kochabende statt, bei denen Gäste, Nachbarn und Reisende Rezepte aus ihrer Heimat teilen. Freiwillige gestalten das Programm mit und bringen eigene Esstraditionen ein.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-nordwind',
    slug: 'nordwind-hostel',
    name: 'Nordwind Hostel',
    hostType: 'hostel',
    location: { countryCode: 'DE', city: { en: 'Leipzig', de: 'Leipzig' } },
    languages: ['de', 'en'],
    summary: {
      en: 'A creative hostel with a courtyard that doubles as a neighbourhood stage.',
      de: 'Ein kreatives Hostel mit Innenhof, der zugleich als Bühne für die Nachbarschaft dient.',
    },
    description: {
      en: 'Nordwind turns its courtyard into a space for concerts, workshops and community dinners. Volunteers help design the space and organise events that bring travelers and locals together.',
      de: 'Das Nordwind verwandelt seinen Innenhof in einen Ort für Konzerte, Workshops und gemeinsame Abendessen. Freiwillige helfen bei der Gestaltung und organisieren Veranstaltungen, die Reisende und Einheimische zusammenbringen.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-open-door',
    slug: 'open-door-digital-skills',
    name: 'Open Door Digital Skills School',
    hostType: 'education',
    location: { countryCode: 'RW', city: { en: 'Kigali', de: 'Kigali' } },
    languages: ['rw', 'en', 'fr'],
    summary: {
      en: 'A community school teaching practical digital skills to young adults.',
      de: 'Eine Gemeinschaftsschule, die jungen Erwachsenen praktische digitale Fähigkeiten vermittelt.',
    },
    description: {
      en: 'Open Door offers evening classes in web basics, design and online communication. Volunteers support teachers with hands-on sessions and share how they use these skills in their own work.',
      de: 'Open Door bietet Abendkurse zu Web-Grundlagen, Design und Online-Kommunikation. Freiwillige unterstützen die Lehrkräfte in praktischen Einheiten und zeigen, wie sie diese Fähigkeiten selbst einsetzen.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-suedhang',
    slug: 'suedhang-makers-cooperative',
    name: 'Südhang Makers Cooperative',
    hostType: 'other_organization',
    location: { countryCode: 'DE', city: { en: 'Freiburg', de: 'Freiburg' } },
    languages: ['de', 'en'],
    summary: {
      en: 'A cooperative workshop where neighbours repair, build and care for a shared orchard.',
      de: 'Eine genossenschaftliche Werkstatt, in der Nachbarn reparieren, bauen und eine gemeinsame Streuobstwiese pflegen.',
    },
    description: {
      en: 'The Südhang cooperative runs a monthly repair café and looks after a hillside orchard. Volunteers share practical skills and learn how the cooperative organises itself.',
      de: 'Die Genossenschaft Südhang betreibt ein monatliches Repair-Café und kümmert sich um eine Streuobstwiese am Hang. Freiwillige teilen praktisches Wissen und erfahren, wie sich die Genossenschaft selbst organisiert.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-mai',
    slug: 'mai-garden-homestay',
    name: 'Mai’s Garden Homestay',
    hostType: 'private_individual',
    location: { countryCode: 'VN', city: { en: 'Hoi An', de: 'Hoi An' } },
    languages: ['vi', 'en'],
    summary: {
      en: 'A private host with a vegetable garden who loves swapping languages over dinner.',
      de: 'Eine private Gastgeberin mit Gemüsegarten, die beim Abendessen gerne Sprachen tauscht.',
    },
    description: {
      en: 'Mai grows herbs and vegetables for her family and neighbours. She is looking for travelers who enjoy garden work and want to practise conversation in English and Vietnamese.',
      de: 'Mai baut Kräuter und Gemüse für ihre Familie und Nachbarn an. Sie sucht Reisende, die gerne im Garten arbeiten und Englisch und Vietnamesisch im Gespräch üben möchten.',
    },
    origin: 'demo',
  },
  {
    id: 'demo-host-rossi',
    slug: 'rossi-family-home',
    name: 'Rossi Family Home',
    hostType: 'family',
    location: { countryCode: 'IT', city: { en: 'Bologna', de: 'Bologna' } },
    languages: ['it', 'en'],
    summary: {
      en: 'A family that shares its kitchen and city with travelers who want to learn Italian cooking.',
      de: 'Eine Familie, die ihre Küche und ihre Stadt mit Reisenden teilt, die italienisch kochen lernen möchten.',
    },
    description: {
      en: 'The Rossis cook together most evenings and would like to swap recipes and languages. They are especially keen to practise German with a traveler.',
      de: 'Die Rossis kochen fast jeden Abend gemeinsam und möchten Rezepte und Sprachen tauschen. Besonders gerne würden sie mit Reisenden Deutsch üben.',
    },
    origin: 'demo',
  },
];
