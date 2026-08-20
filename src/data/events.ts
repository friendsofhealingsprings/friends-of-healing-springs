import { images } from './images';
import { site } from './site';

export interface UpcomingEvent {
  slug: string;
  href: string;
  rsvpHref: string;
  flyerHref: string;
  title: string;
  shortTitle: string;
  description: string;
  ogTitle: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  locationDisplay: string;
  rainDateLabel: string;
  startDate: string;
  endDate: string;
  rainDate: string;
  image: string;
  imageAlt: string;
  mailerLiteGroup: string;
}

/** Featured community workday — keep in sync with the news post of the same slug. */
export const fallCleanup2026: UpcomingEvent = {
  slug: 'fall-cleanup-october-3-2026',
  href: '/news/fall-cleanup-october-3-2026/',
  rsvpHref: '/news/fall-cleanup-october-3-2026/#rsvp',
  flyerHref: '/flyers/fall-cleanup-october-3-2026/',
  title: 'Fall Cleanup & Stewardship Workday — October 3',
  shortTitle: 'Fall Cleanup & Stewardship Workday',
  description:
    'Join Friends of Healing Springs Natural Area for a community cleanup and stewardship workday on October 3, 2026, from 9 AM–4 PM. RSVP to volunteer.',
  ogTitle: 'Fall Cleanup & Stewardship Workday — October 3',
  dateLabel: 'Saturday, October 3, 2026',
  timeLabel: '9:00 AM – 4:00 PM',
  location: 'Healing Springs common-area pond',
  locationDisplay: 'Healing Springs Common-Area Pond',
  rainDateLabel: 'Sunday, October 4, 2026',
  startDate: '2026-10-03T09:00:00-05:00',
  endDate: '2026-10-03T16:00:00-05:00',
  rainDate: '2026-10-04',
  image: images.volunteerWork,
  imageAlt: 'Volunteers at a stewardship workday at Healing Springs Natural Area',
  mailerLiteGroup: 'Fall Cleanup RSVPs',
};

export const upcomingEvents: UpcomingEvent[] = [fallCleanup2026];

export function eventJsonLd(event: UpcomingEvent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.shortTitle,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    url: new URL(event.href, site.url).href,
    image: new URL(event.image, site.url).href,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Highfill',
        addressRegion: 'AR',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'NGO',
      name: site.name,
      url: site.url,
    },
  };
}
