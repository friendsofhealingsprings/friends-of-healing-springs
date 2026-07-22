/**
 * Central image path registry.
 * Main site images point to the best photos in public/images/gallery/.
 */
export const images = {
  healingSpringsStream: '/images/gallery/20260421_145836639_iOS.jpg',
  littleOsageCreek: '/images/gallery/20260424_140604053_iOS.jpg',
  erosionControl: '/images/gallery/20260412_224201515_iOS.jpg',
  forestCanopy: '/images/gallery/20250420_211257433_iOS.jpg',
  volunteerWork: '/images/gallery/20260312_215012055_iOS.jpg',
  darterHabitat: '/images/gallery/20260312_222539448_iOS.jpg',
  streamHabitat: '/images/gallery/20260323_192655132_iOS.jpg',
} as const;

export const defaultOgImage = images.healingSpringsStream;
