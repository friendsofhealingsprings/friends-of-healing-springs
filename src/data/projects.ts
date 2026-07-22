import { images } from './images';

export type ProjectStatus = 'planning' | 'in-progress' | 'ongoing' | 'completed';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  statusLabel: string;
  image: string;
  imageAlt: string;
  fundingNotes?: string;
}

export const projectStatusColors: Record<ProjectStatus, string> = {
  planning: 'bg-sand-200 text-stone-800',
  'in-progress': 'bg-water-100 text-water-800',
  ongoing: 'bg-teal-100 text-teal-800',
  completed: 'bg-forest-100 text-forest-800',
};

export const projects: Project[] = [
  {
    id: 'erosion-control',
    title: 'Erosion Control & Streambank Stabilization',
    slug: 'erosion-control-streambank-stabilization',
    description:
      'Addressing streambank erosion along Little Osage Creek through bioengineering techniques, native vegetation plantings, and strategic stabilization to reduce sediment loading and protect aquatic habitat.',
    status: 'in-progress',
    statusLabel: 'In Progress',
    image: images.erosionControl,
    imageAlt: 'Streambank erosion control work along Little Osage Creek',
    fundingNotes:
      'Funding has been secured to stabilize the streambank and prevent erosion. Work is underway, with completion expected in 2027.',
  },
  {
    id: 'habitat-restoration',
    title: 'Habitat Restoration',
    slug: 'habitat-restoration',
    description:
      'Restoring native plant communities in riparian zones and upland areas to improve habitat connectivity, support pollinators, and enhance conditions for sensitive aquatic species.',
    status: 'planning',
    statusLabel: 'Planning',
    image: images.forestCanopy,
    imageAlt: 'Native forest canopy at Healing Springs Natural Area',
  },
  {
    id: 'trail-stewardship',
    title: 'Trail Stewardship',
    slug: 'trail-stewardship',
    description:
      'Maintaining existing trails to minimize erosion, protect sensitive areas, and ensure safe public access while reducing impacts to spring-fed habitats and riparian corridors.',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    image: images.healingSpringsStream,
    imageAlt: 'Trail along Little Osage Creek at Healing Springs Natural Area',
    fundingNotes:
      'Volunteer-led maintenance with periodic need for tools, signage, and erosion control materials.',
  },
  {
    id: 'volunteer-workdays',
    title: 'Volunteer Workdays',
    slug: 'volunteer-workdays',
    description:
      'Coordinating regular volunteer stewardship events including invasive species removal, litter cleanup, trail maintenance, and native planting days in partnership with community members.',
    status: 'in-progress',
    statusLabel: 'In Progress',
    image: images.volunteerWork,
    imageAlt: 'Volunteers participating in a stewardship workday',
    fundingNotes:
      'Equipment and supplies supported through donations and in-kind contributions. Expanding coordination capacity as organization grows.',
  },
  {
    id: 'watershed-protection',
    title: 'Watershed Protection',
    slug: 'watershed-protection',
    description:
      'Monitoring and advocating for the health of the Little Osage Creek watershed through water quality awareness, land use coordination, and partnership with state conservation agencies.',
    status: 'planning',
    statusLabel: 'Planning',
    image: images.littleOsageCreek,
    imageAlt: 'Little Osage Creek flowing through the watershed',
  },
];
