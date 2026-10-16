// All page content lives here. Components read only from this module.
// Images are file names under src/assets/ (e.g. 'projects/x.png').

export interface Link {
  label: string;
  href: string;
}

/** One step of the page: a short summary (scrolling column) plus its detail (sticky column). */
export interface Item {
  id: string;
  /** Label for the in-page nav; set on the first item of each section. */
  nav?: string;
  /** Small label above the title, e.g. 'Project' or '2024 — Present'. */
  kicker?: string;
  title: string;
  summary: string;
  /** Paragraphs shown in the detail column. Falls back to `summary`. */
  detail?: string[];
  image?: string;
  imageAlt?: string;
  tags?: string[];
  links?: Link[];
}

export const site = {
  title: 'Nguyễn Hải Quân — Software Engineer',
  description: 'Portfolio of Nguyễn Hải Quân, software engineer building fast, accessible web apps.',
  url: 'https://hquan1428.github.io/portfolio/',
  name: 'Nguyễn Hải Quân',
};

export const contact = {
  email: 'mailto:you@example.com',
  github: 'https://github.com/HQuan1428',
  linkedin: 'https://www.linkedin.com/in/your-handle/',
};

export const items: Item[] = [
  {
    id: 'hero',
    title: site.name,
    summary: "I'm Nguyễn Hải Quân, a software engineer.",
    detail: [
      'Placeholder intro: a few sentences on who you are, what you build and what you are looking for next.',
    ],
    image: 'avatar.png',
    imageAlt: 'Portrait of Nguyễn Hải Quân',
  },
  {
    id: 'about',
    nav: 'About',
    kicker: 'About',
    title: 'About me',
    summary: 'Placeholder: one-line summary of your background.',
    detail: [
      'Placeholder about text. Who you are, what you care about, and how you work.',
      'A second paragraph with a bit more detail about your background.',
    ],
  },
  {
    id: 'skills',
    nav: 'Skills',
    kicker: 'Skills',
    title: 'Frontend',
    summary: 'Placeholder: what you do on the frontend.',
    detail: ['Placeholder: depth on frontend work, favourite tools and why.'],
    tags: ['TypeScript', 'Astro', 'CSS'],
  },
  {
    id: 'skills-backend',
    kicker: 'Skills',
    title: 'Backend',
    summary: 'Placeholder: what you do on the backend.',
    tags: ['Node.js', 'SQL', 'Git'],
  },
  {
    id: 'experience',
    nav: 'Experience',
    kicker: '2024 — Present',
    title: 'Software Developer · Company Name',
    summary: 'Placeholder: one-line summary of the role.',
    detail: ['Placeholder: what you built in this role and the impact it had.'],
  },
  {
    id: 'project-one',
    nav: 'Projects',
    kicker: 'Project',
    title: 'Project One',
    summary: 'Placeholder: one sentence on what it does.',
    detail: ['Placeholder: the problem, your approach, and the result.'],
    image: 'projects/project-one.png',
    imageAlt: 'Screenshot of Project One',
    tags: ['Astro', 'CSS'],
    links: [
      { label: 'Live', href: 'https://example.com/' },
      { label: 'Source', href: 'https://github.com/HQuan1428/' },
    ],
  },
  {
    id: 'contact',
    nav: 'Contact',
    kicker: 'Contact',
    title: "Let's talk",
    summary: 'Placeholder: what kind of work you are open to.',
    links: [
      { label: 'Email', href: contact.email },
      { label: 'GitHub', href: contact.github },
      { label: 'LinkedIn', href: contact.linkedin },
    ],
  },
];
