import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'thrillbinge',
    title: 'Thrill Binge',
    description: 'A premier destination for the most thrilling cinema experience.',
    technologies: ['Next.js', 'Django'],
    autoPreview: true,
    liveUrl: 'http://ec2-65-0-183-137.ap-south-1.compute.amazonaws.com/'
  },
  {
    id: 'seabirdspictures',
    title: 'Seabirds Pictures',
    description: 'A portfoliowebsite for a production house that makes movies, commercials, and other contents.',
    technologies: ['Next.js'],
    autoPreview: true,
    liveUrl: 'https://seabirdspictures.com/'
  }
];