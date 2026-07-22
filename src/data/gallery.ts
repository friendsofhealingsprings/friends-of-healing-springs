export type GalleryCategory = 'streams' | 'forest' | 'wildlife' | 'restoration' | 'volunteers';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  caption?: string;
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: 'streams', label: 'Creek & Springs' },
  { id: 'forest', label: 'Forest' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'restoration', label: 'Restoration' },
  { id: 'volunteers', label: 'Volunteers' },
];

const g = (filename: string) => `/images/gallery/${filename}`;

export const galleryImages: GalleryImage[] = [
  // Little Osage Creek & spring-fed waters
  {
    id: 'stream-clear-summer',
    src: g('20260421_145836639_iOS.jpg'),
    alt: 'Clear, shallow Little Osage Creek with rocky bed flowing through green forest at Healing Springs Natural Area',
    category: 'streams',
    caption: 'Crystal-clear summer waters on Little Osage Creek',
  },
  {
    id: 'stream-spring-flow',
    src: g('20260323_192655132_iOS.jpg'),
    alt: 'Clear spring-fed stream with aquatic plants flowing through budding forest',
    category: 'streams',
    caption: 'Spring-fed stream in early season',
  },
  {
    id: 'stream-winter-snow',
    src: g('20260124_154915894_iOS.jpg'),
    alt: 'Snow-lined Little Osage Creek with clear water and rocky bed in winter',
    category: 'streams',
    caption: 'Winter on Little Osage Creek.',
  },
  {
    id: 'stream-winter-reflection',
    src: g('20260124_165549566_iOS.jpg'),
    alt: 'Snow-covered bank along Little Osage Creek with tree reflections in calm winter water',
    category: 'streams',
    caption: 'Winter on Little Osage Creek — woodland reflections',
  },
  {
    id: 'stream-winter-woods',
    src: g('20260124_165549566_iOS-1.jpg'),
    alt: 'Little Osage Creek in winter woodland with snow on the banks',
    category: 'streams',
    caption: 'Little Osage Creek in winter woodland',
  },
  {
    id: 'stream-rocky-bank',
    src: g('20251019_225901658_iOS.jpg'),
    alt: 'Shallow spring-fed stream flowing past a rocky bank through woodland',
    category: 'streams',
    caption: 'Spring-fed stream and rocky shoreline',
  },
  {
    id: 'stream-winding-spring',
    src: g('20250420_211243161_iOS.jpg'),
    alt: 'Winding spring-fed stream through lush green spring forest',
    category: 'streams',
    caption: 'Spring-fed stream winding through spring forest',
  },
  {
    id: 'stream-rocky-shore',
    src: g('20260421_145854884_iOS.jpg'),
    alt: 'Rocky shore along Little Osage Creek with clear flowing water',
    category: 'streams',
    caption: 'Rocky corridor along Little Osage Creek',
  },
  {
    id: 'stream-little-osage',
    src: g('20260424_140604053_iOS.jpg'),
    alt: 'Little Osage Creek flowing through green riparian forest',
    category: 'streams',
    caption: 'Little Osage Creek',
  },
  {
    id: 'stream-pond-path',
    src: g('20260424_144425106_iOS.jpg'),
    alt: 'Grassy path leading to a spring-fed pond surrounded by trees',
    category: 'streams',
    caption: 'Spring-fed pond and woodland path',
  },
  {
    id: 'stream-spring-pool',
    src: g('20260608_213348753_iOS.jpg'),
    alt: 'Woodland path meeting a calm spring-fed pool',
    category: 'streams',
    caption: 'Woodland path at a spring-fed pool',
  },
  {
    id: 'stream-beaver-dam',
    src: g('20260424_144921521_iOS.jpg'),
    alt: 'Spring-fed stream flowing over a natural woody dam in dense green forest',
    category: 'streams',
    caption: 'Spring-fed stream and natural woody structure',
  },

  // Forest
  {
    id: 'forest-spring-canopy',
    src: g('20250420_211257433_iOS.jpg'),
    alt: 'Bright green spring forest with grassy floor and standing dead tree snag',
    category: 'forest',
    caption: 'Spring forest canopy',
  },
  {
    id: 'forest-trail-arch',
    src: g('20260422_010459630_iOS.jpg'),
    alt: 'Grassy trail leading into forest through a rustic log archway',
    category: 'forest',
    caption: 'Trail entrance into the woods',
  },
  {
    id: 'forest-mowed-path',
    src: g('20260422_010503161_iOS.jpg'),
    alt: 'Mowed grass path winding through slender trees',
    category: 'forest',
    caption: 'Woodland trail',
  },
  {
    id: 'forest-fence-trail',
    src: g('20260608_214714761_iOS.jpg'),
    alt: 'Dirt trail framed by wooden fence posts leading into green forest',
    category: 'forest',
    caption: 'Forest trail with rustic posts',
  },
  {
    id: 'forest-open-field',
    src: g('20260310_002052913_iOS.jpg'),
    alt: 'Grassy path through open woodland with leafless trees in early season',
    category: 'forest',
    caption: 'Open woodland in early season',
  },

  // Wildlife
  {
    id: 'wildlife-darter-colorful',
    src: g('20260312_222539448_iOS.jpg'),
    alt: 'Colorful native darter fish with blue fins held in a field viewing container',
    category: 'wildlife',
    caption: 'Native darter — indicator of spring-fed stream health',
  },
  {
    id: 'wildlife-darter-measured',
    src: g('20260312_223231806_iOS.jpg'),
    alt: 'Small native fish measured in a field photarium during a spring-fed stream survey',
    category: 'wildlife',
    caption: 'Spring-fed stream survey — native fish species',
  },
  {
    id: 'wildlife-crayfish',
    src: g('20260312_213836826_iOS.jpg'),
    alt: 'Crayfish found in spring-fed stream gravels during field exploration',
    category: 'wildlife',
    caption: 'Crayfish in spring-fed stream habitat',
  },
  {
    id: 'wildlife-crayfish-close',
    src: g('20260312_213852530_iOS.jpg'),
    alt: 'Close view of a crayfish held above spring-fed stream gravel',
    category: 'wildlife',
    caption: 'Aquatic life in the gravels',
  },
  {
    id: 'wildlife-box-turtle',
    src: g('20260421_142429067_iOS.jpg'),
    alt: 'Eastern box turtle walking through grass at Healing Springs Natural Area',
    category: 'wildlife',
    caption: 'Eastern box turtle on the forest floor',
  },
  {
    id: 'wildlife-turtle-grass',
    src: g('20260326_152451122_iOS.jpg'),
    alt: 'Turtle moving through tall sunlit grass',
    category: 'wildlife',
    caption: 'Turtle in meadow grass',
  },
  {
    id: 'wildlife-goose-swimming',
    src: g('20260424_145521144_iOS.jpg'),
    alt: 'Canada goose swimming in a wetland pond',
    category: 'wildlife',
    caption: 'Canada goose in wetland habitat',
  },
  {
    id: 'wildlife-goose-log',
    src: g('20260424_145240263_iOS-1.jpg'),
    alt: 'Canada goose standing on a log in duckweed-covered water',
    category: 'wildlife',
    caption: 'Canada goose on a fallen log',
  },
  {
    id: 'wildlife-goose-standing',
    src: g('20260424_145246881_iOS-1.jpg'),
    alt: 'Canada goose standing in shallow pond with reflection',
    category: 'wildlife',
    caption: 'Canada goose in the shallows',
  },
  {
    id: 'wildlife-goose-pond',
    src: g('20260424_145332850_iOS.jpg'),
    alt: 'Canada goose swimming past a fallen log in a wooded pond',
    category: 'wildlife',
    caption: 'Goose in the woodland pond',
  },
  {
    id: 'wildlife-goose-reeds',
    src: g('20260424_145634205_iOS.jpg'),
    alt: 'Canada goose swimming among tall green reeds',
    category: 'wildlife',
    caption: 'Goose among the reeds',
  },
  {
    id: 'wildlife-beaver-fulbright-spring',
    src: g('20260409_215059122_iOS.jpg'),
    alt: 'Beaver crossing a stream fed by Fulbright Spring at Healing Springs Natural Area',
    category: 'wildlife',
    caption: 'Beaver crossing stream fed by Fulbright Spring.',
  },

  // Restoration & monitoring
  {
    id: 'restoration-beaver-dam-monitor',
    src: g('20260412_224201515_iOS.jpg'),
    alt: 'Beaver dam on a spring-fed stream with solar-powered water quality monitoring station in background',
    category: 'restoration',
    caption: 'Beaver dam and water quality monitoring station',
  },

  // Volunteers & field work
  {
    id: 'wild-cucurbita-pepo',
    src: g('20260312_215012055_iOS.jpg'),
    alt: 'Wild Cucurbita pepo found at Healing Springs Natural Area, ancestral to domesticated squash, pumpkins, and gourds',
    category: 'wildlife',
    caption:
      'A wild form of Cucurbita pepo, part of the ancestral lineage of domesticated squash varieties including pumpkins and gourds.',
  },
];
