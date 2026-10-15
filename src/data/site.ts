// All page content lives here. Components read only from this module.
// Images are file names under src/assets/ (projects in src/assets/projects/).

export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  imageAlt: string;
  links: { label: string; href: string }[];
}

export interface Experience {
  role: string;
  org: string;
  period: string;
  summary: string;
}

export const site = {
  title: 'Your Name — Software Developer',
  description: 'Portfolio of Your Name: software developer building fast, accessible web apps.',
  url: 'https://hquan1428.github.io/portfolio/',
  name: 'Your Name',
  tagline: 'I build fast, accessible things for the web.',
  avatar: 'avatar.png',
  avatarAlt: 'Portrait of Your Name',
  about: [
    'Placeholder about text. Who you are, what you care about, and what you are looking for.',
    'A second paragraph with a bit more detail about your background.',
  ],
};

export const skills: string[] = ['TypeScript', 'Astro', 'CSS', 'Node.js', 'Git'];

export const experience: Experience[] = [
  {
    role: 'Software Developer',
    org: 'Company Name',
    period: '2024 — Present',
    summary: 'Placeholder: what you built and the impact it had.',
  },
];

export const projects: Project[] = [
  {
    title: 'Project One',
    description: 'Placeholder: one or two sentences on what it does and why.',
    tech: ['Astro', 'CSS'],
    image: 'project-one.png',
    imageAlt: 'Screenshot of Project One',
    links: [
      { label: 'Live', href: 'https://example.com/' },
      { label: 'Source', href: 'https://github.com/HQuan1428/' },
    ],
  },
];

export const contact = {
  email: 'mailto:you@example.com',
  github: 'https://github.com/HQuan1428',
  linkedin: 'https://www.linkedin.com/in/your-handle/',
};
