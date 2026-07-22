import { images } from './images';

export interface ConservationPriority {
  title: string;
  description: string;
  icon: 'water' | 'habitat' | 'species' | 'community';
}

export const conservationPriorities: ConservationPriority[] = [
  {
    title: 'Watershed Health',
    description:
      'Protecting water quality and flow in the spring-fed systems and Little Osage Creek through erosion control, riparian buffer restoration, and responsible land stewardship.',
    icon: 'water',
  },
  {
    title: 'Habitat Restoration',
    description:
      'Restoring native plant communities and improving habitat connectivity to support resilient ecosystems across the natural area and surrounding watershed.',
    icon: 'habitat',
  },
  {
    title: 'Sensitive Species Protection',
    description:
      'Safeguarding habitat for rare native fish including the Arkansas Darter and Least Darter, whose presence reflects the health of these aquatic systems.',
    icon: 'species',
  },
  {
    title: 'Community Stewardship',
    description:
      'Engaging volunteers, educators, and local partners in hands-on conservation, environmental education, and long-term care of this special place.',
    icon: 'community',
  },
];

export interface WhyItMattersSection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  points: string[];
}

export const whyItMattersSections: WhyItMattersSection[] = [
  {
    id: 'healing-springs',
    title: 'Healing Springs Natural Area',
    subtitle: 'Among the most important aquatic sites in Arkansas',
    image: images.healingSpringsStream,
    imageAlt: 'Spring-fed waters at Healing Springs Natural Area',
    points: [
      'Healing Springs Natural Area is owned by the Arkansas Department of Transportation and protected through a conservation easement held by the Arkansas Natural Heritage Commission (ANHC), which added the site to Arkansas’s System of Natural Areas in 2020.',
      'Two of Arkansas’s rarest fish — the Least Darter and the Arkansas Darter — were central to the site’s acquisition. Only three locations in Northwest Arkansas support both species; partners identify Healing Springs as the single most important site for both.',
      'Perennial groundwater from Fulbright Spring and Healing Spring forms a cold, spring-fed stream complex flowing into Little Osage Creek — roughly 0.87 miles of habitat that supports these and other sensitive aquatic species.',
    ],
  },
  {
    id: 'arkansas-darter',
    title: 'Arkansas Darter',
    subtitle: 'A state imperiled species tied to spring-fed streams',
    image: images.darterHabitat,
    imageAlt: 'Native darter observed during a spring-fed stream survey at Healing Springs Natural Area',
    points: [
      'The Arkansas Darter (Etheostoma cragini) is ranked S1 in Arkansas — critically imperiled within the state — and G3–G4 globally. In Arkansas, it occurs only in the Illinois River watershed.',
      'Like the Least Darter, it is a habitat specialist requiring open canopy, limited wooded shoreline, dense aquatic vegetation, fine substrate, cold spring-influenced water, and permanent flow that is steady but not too fast.',
      'Protecting intact habitat at Healing Springs Natural Area supports one of the most significant remaining populations of this species in the state.',
    ],
  },
  {
    id: 'least-darter',
    title: 'Least Darter',
    subtitle: 'Northwest Arkansas populations with statewide significance',
    image: images.streamHabitat,
    imageAlt: 'Clear spring-fed stream habitat at Healing Springs Natural Area',
    points: [
      'The Least Darter (Etheostoma microperca) is ranked S1 in Arkansas and, in Northwest Arkansas, may represent an undescribed species sometimes referred to as the “Razorback Darter,” with taxonomic research underway.',
      'Relatively few streams in the Illinois River watershed meet the specific conditions both darters require — making each remaining site ecologically valuable and difficult to replace.',
      'During field visits at Healing Springs, partners have observed darters and other native fish in the spring runs — a direct measure of why stream conditions here matter at a statewide scale.',
    ],
  },
  {
    id: 'little-osage-creek',
    title: 'Little Osage Creek & Watershed Stewardship',
    subtitle: 'Where spring water, erosion, and habitat meet',
    image: images.littleOsageCreek,
    imageAlt: 'Little Osage Creek in the Healing Springs watershed',
    points: [
      'Fulbright Branch and Healing Spring Branch flow into Little Osage Creek, connecting groundwater-fed springs to the broader watershed and the aquatic communities that depend on them.',
      'Partners have identified quickly eroding streambanks as an urgent concern — in one priority area, only about 50 feet separates Little Osage Creek from Healing Spring Branch. Riparian vegetation is essential to stabilizing banks and maintaining darter habitat.',
      'Long-term streambank stabilization, responsible recreation, and cooperative management among agencies, landowners, and community partners are needed to protect this system for the future.',
    ],
  },
  {
    id: 'aquatic-community',
    title: 'A Broader Aquatic Community',
    subtitle: 'Fish, crayfish, and other sensitive species',
    image: '/images/gallery/20260312_213836826_iOS.jpg',
    imageAlt: 'Crayfish in spring-fed stream habitat at Healing Springs Natural Area',
    points: [
      'Healing Springs Natural Area supports additional rare fish including the Sunburst Darter, Redspot Chub, and Plateau Darter (S3), along with native species such as Cardinal Shiner and Fantail Darter.',
      'Stream-dwelling crayfish found here include Meek’s Short-pointed Crayfish and Midget Crayfish (S3), Illinois River watershed endemics, and the Osage Burrowing Crayfish (S3–S4).',
      'The site also provides habitat for the Western Grotto Salamander (S2) and the federally threatened Ozark Cavefish (S1) — species that reflect the connected groundwater, surface water, and riparian systems of this landscape.',
    ],
  },
];

export interface BoardMember {
  name: string;
  role: string;
  bio?: string;
}

export const boardMembers: BoardMember[] = [
  { name: 'John Rogers', role: 'President' },
  { name: 'Jesse Johnson', role: 'Vice President' },
  { name: 'Leonard Ogden', role: 'Secretary' },
  { name: 'Suze Tylock', role: 'Treasurer' },
  { name: 'Jordan Kunkel', role: 'Director' },
];

export interface GovernanceDocument {
  title: string;
  filename: string;
  description: string;
  linkLabel: string;
}

export const governanceDocumentsPath = '/documents/governance';

export const governanceDocuments: GovernanceDocument[] = [
  {
    title: 'Articles of Incorporation Summary',
    filename: 'articles-of-incorporation-summary.pdf',
    linkLabel: 'View Articles of Incorporation Summary (PDF)',
    description:
      'Our Articles of Incorporation establish Friends of Healing Springs Natural Area, Inc. as an Arkansas nonprofit corporation and define the foundation of our charitable purpose. To protect personal information, we provide a summary of this document publicly. The official Articles of Incorporation are maintained in the organization\'s corporate records and are available upon reasonable request.',
  },
  {
    title: 'Bylaws',
    filename: 'bylaws.pdf',
    linkLabel: 'View Bylaws (PDF)',
    description:
      'Our Bylaws provide the framework for how Friends of Healing Springs Natural Area, Inc. is governed. They outline the responsibilities of our Board of Directors, officer roles, decision-making processes, and other governance practices that guide our organization.',
  },
  {
    title: 'Conflict of Interest Policy',
    filename: 'conflict-of-interest-policy.pdf',
    linkLabel: 'View Conflict of Interest Policy (PDF)',
    description:
      'Friends of Healing Springs Natural Area, Inc. is committed to ensuring that decisions are made in the best interests of our mission and the natural area we serve. Our Conflict of Interest Policy establishes procedures for identifying, disclosing, and appropriately managing potential conflicts.',
  },
];

export interface MeetingSummary {
  date: string;
  title: string;
  summary: string;
}

export const meetingSummaries: MeetingSummary[] = [];
