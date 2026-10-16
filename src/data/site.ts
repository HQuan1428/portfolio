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
  description:
    'Portfolio of Nguyễn Hải Quân, software engineer building SaaS applications with React, Go, PHP and Node.js.',
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
    summary: "I'm Nguyễn Hải Quân, a software engineer building SaaS applications.",
    detail: [
      'Recent graduate of the University of Science, VNUHCM (September 2026).',
      'I work across the stack: responsive front-end interfaces in React, and REST APIs in Go, PHP and Node.js.',
    ],
    image: 'avatar.png',
    imageAlt: 'Portrait of Nguyễn Hải Quân',
  },
  {
    id: 'about',
    nav: 'About',
    kicker: 'About',
    title: 'About me',
    summary: 'Full-stack developer who ships SaaS products and uses AI agents to work faster.',
    detail: [
      'I am Nguyen Hai Quan, a recent graduate from the University of Science, VNUHCM (September 2026).',
      'Throughout my studies and work experience, I have developed SaaS applications, from building responsive front-end interfaces with React to implementing backend REST APIs with Go, PHP, and Node.js.',
      'I am also proficient in leveraging AI agent tools such as Claude and ChatGPT/Codex to streamline and optimize the software development process.',
    ],
  },
  {
    id: 'skills',
    nav: 'Skills',
    kicker: 'Skills',
    title: 'Engineering',
    summary: 'Front-end and back-end web development on solid fundamentals.',
    detail: [
      'Solid understanding of Object-Oriented Programming (OOP) and databases (SQL, NoSQL).',
      'Responsive front ends in React; REST APIs in Go, PHP and Node.js.',
    ],
    tags: ['React', 'Go', 'PHP', 'Node.js', 'PostgreSQL', 'SQL', 'NoSQL'],
  },
  {
    id: 'skills-cloud-ai',
    kicker: 'Skills',
    title: 'Cloud & AI',
    summary: 'Cloud platforms, AI-integrated apps, and AI agent tooling.',
    detail: [
      'Experienced working with cloud platforms such as AWS and Google Cloud.',
      'Developed AI-integrated applications, including LLM (Large Language Model) and CV (Computer Vision).',
      'Proficient in using AI agent tools (Claude, ChatGPT/Codex) to optimize workflows and improve productivity.',
    ],
    tags: ['AWS', 'Google Cloud', 'LLM', 'Computer Vision', 'Claude', 'ChatGPT/Codex'],
  },
  {
    id: 'skills-soft',
    kicker: 'Skills',
    title: 'Language & soft skills',
    summary: 'English for technical work; responsible, proactive problem solver.',
    detail: [
      'English: proficient in reading and writing technical documentation; currently improving spoken communication skills.',
      'Strong sense of responsibility, proactive work ethic, and effective problem-solving abilities.',
    ],
  },
  {
    id: 'experience',
    nav: 'Experience',
    kicker: '04/2026 — 10/2026',
    title: 'Software Development Intern · AIPOWER Co., Ltd.',
    summary: 'React and Golang: AI document extraction, a SuperApp, and Zalo Mini Apps.',
    detail: [
      'Built a document information extraction system (document numbers, accounting data, statistics) integrating OCR and AI.',
      'Contributed to the development of a SuperApp integrating multiple third-party services.',
      'Contributed to the development of Zalo Mini Apps for loyalty programs (Givral, Kem Trang Tien).',
    ],
    tags: ['React', 'Golang', 'PostgreSQL', 'Zalo Mini Program', 'AI tuning'],
  },
  {
    id: 'education',
    nav: 'Education',
    kicker: '09/2022 — 09/2026',
    title: 'University of Science — VNUHCM',
    summary: 'Graduated September 2026. GPA 7.36/10.0.',
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
