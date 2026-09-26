import type { ImageMetadata } from 'astro';
import hero from '../assets/images/hero-album.png';
import heroWide from '../assets/images/summit17-hero-wide.png';
import aboutPhoto from '../assets/images/group-depth-photo.jpeg';
import aboutDepth from '../assets/images/group-depth-map.png';
import shows from '../assets/images/shows-bg.jpg';
import press1 from '../assets/images/press-1.jpg';
import press2 from '../assets/images/press-2.jpg';
import press3 from '../assets/images/press-3.jpg';
import gallery01 from '../assets/images/gallery-01.jpg';
import gallery02 from '../assets/images/gallery-02.jpg';
import gallery03 from '../assets/images/gallery-03.jpg';
import gallery04 from '../assets/images/gallery-04.jpg';
import gallery05 from '../assets/images/gallery-05.jpg';
import gallery06 from '../assets/images/gallery-06.jpg';
import gallery07 from '../assets/images/gallery-07.jpg';
import gallery08 from '../assets/images/gallery-08.jpg';
import gallery09 from '../assets/images/gallery-09.jpg';
import gallery10 from '../assets/images/gallery-10.jpg';
import gallery11 from '../assets/images/gallery-11.jpg';
import gallery12 from '../assets/images/gallery-12.jpg';
import gallery13 from '../assets/images/gallery-13.jpg';

export const site = {
  name: 'Summit 17',
  tagline: 'Anthems of faith. Energy with purpose.',
  description: 'Summit 17 is a high-energy Christian alternative rock band from Carbondale, Illinois, bringing raw passion, hope-filled lyrics, and powerful live shows.',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://summit17official.com',
  email: 'Johnnywicoffmusic@gmail.com',
  phoneDisplay: '618-944-2773',
  phoneHref: '+16189442773',
  bandsintownArtistId: '15626978',
  gigSaladPath: 'summit_17_herrin',
  links: {
    apple: 'https://music.apple.com/us/album/summit-17/1826103462',
    spotify: 'https://open.spotify.com/album/2NYVvz3dGajmDFdWlO9Lz3',
    distrokid: 'https://distrokid.com/hyperfollow/summit17/summit-17-2',
    facebook: 'https://www.facebook.com/Summit17Band/',
    instagram: 'https://www.instagram.com/summit17band',
    youtube: 'https://www.youtube.com/Summit17Band',
    livePlaylist: 'https://youtube.com/playlist?list=PLIo1UX-3gInMZtPu6OKxox6bWTLP-3yAv&si=W2dpdk-wKVCC-R9C',
    bandsintown: 'https://www.bandsintown.com/a/15626978-summit-17',
    gigSalad: 'https://www.gigsalad.com/summit_17_herrin'
  }
} as const;

export const media = { hero, heroWide, aboutPhoto, aboutDepth, shows, press: [press1, press2, press3] };

export type Track = {
  id: string;
  legacyIds: string[];
  title: string;
  slug: string;
  duration: string;
  audio: string;
  artist: string;
};

export const tracks: Track[] = [
  { id: '4375126', legacyIds: ['4375126'], title: 'Right Now', slug: 'right-now', duration: '4:09', audio: '/audio/right-now.mp3', artist: 'Summit 17' },
  { id: '4909032', legacyIds: ['4909032', '4898158'], title: 'We Are the Light', slug: 'we-are-the-light', duration: '2:31', audio: '/audio/we-are-the-light.mp3', artist: 'Summit 17' },
  { id: '4375130', legacyIds: ['4375130'], title: 'Lion and the Lamb', slug: 'lion-and-the-lamb', duration: '4:10', audio: '/audio/lion-and-the-lamb.mp3', artist: 'Summit 17' },
  { id: '4375127', legacyIds: ['4375127'], title: 'Destiny', slug: 'destiny', duration: '4:28', audio: '/audio/destiny.mp3', artist: 'Summit 17' },
  { id: '4375129', legacyIds: ['4375129'], title: 'I See Life', slug: 'i-see-life', duration: '4:17', audio: '/audio/i-see-life.mp3', artist: 'Summit 17' },
  { id: '4375128', legacyIds: ['4375128'], title: 'Fight Again', slug: 'fight-again', duration: '2:41', audio: '/audio/fight-again.mp3', artist: 'Summit 17' },
  { id: '4707037', legacyIds: ['4707037'], title: 'You Are Good', slug: 'you-are-good', duration: '5:03', audio: '/audio/you-are-good.mp3', artist: 'Summit 17' },
  { id: '4595679', legacyIds: ['4595679'], title: 'Carol of the Bells', slug: 'carol-of-the-bells', duration: '4:01', audio: '/audio/carol-of-the-bells.mp3', artist: 'Summit 17' }
];

export type Photo = { image: ImageMetadata; alt: string; orientation: 'portrait' | 'landscape' };
export const photos: Photo[] = [
  { image: gallery01, alt: 'Summit 17 performing under purple stage lights', orientation: 'portrait' },
  { image: gallery02, alt: 'Summit 17 band members performing live', orientation: 'landscape' },
  { image: gallery03, alt: 'Summit 17 guitarist on stage', orientation: 'portrait' },
  { image: gallery04, alt: 'Summit 17 performing together at a live show', orientation: 'landscape' },
  { image: gallery05, alt: 'Live crowd view of Summit 17 on stage', orientation: 'landscape' },
  { image: gallery06, alt: 'Summit 17 vocalist engaging the audience', orientation: 'landscape' },
  { image: gallery07, alt: 'Summit 17 musician in a live performance', orientation: 'portrait' },
  { image: gallery08, alt: 'Summit 17 member photographed during a concert', orientation: 'portrait' },
  { image: gallery09, alt: 'Summit 17 guitarist performing under concert lights', orientation: 'portrait' },
  { image: gallery10, alt: 'Summit 17 performing on a festival stage', orientation: 'landscape' },
  { image: gallery11, alt: 'Wide view of Summit 17 playing live', orientation: 'landscape' },
  { image: gallery12, alt: 'Summit 17 band performance with stage lighting', orientation: 'landscape' },
  { image: gallery13, alt: 'Summit 17 guitarist in an energetic performance', orientation: 'portrait' }
];

export const videos = [
  { id: 'Z0vCameIpq8', title: 'Summit 17 live performance' },
  { id: 'slkQRdt_9Dc', title: 'Summit 17 live footage' },
  { id: 'ugaM01ctYW4', title: 'Summit 17 concert video' }
];
