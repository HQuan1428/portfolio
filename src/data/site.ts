// All page content lives here. Components read only from this module.
// Images are file names under src/assets/ (e.g. 'projects/x.png').

export interface Link {
  label: string;
  href: string;
}

export interface Case {
  title: string;
  description: string;
}

export interface SkillGroup {
  title: string;
  points: string[];
  tags?: string[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  imageAlt: string;
  links: Link[];
}

export const profile = {
  title: 'Nguyễn Hải Quân — Software Engineer',
  description:
    'Portfolio of Nguyễn Hải Quân, software engineer building SaaS applications with React, Go, PHP and Node.js.',
  url: 'https://hquan1428.github.io/portfolio/',
  name: 'Nguyễn Hải Quân',
  role: 'Software Engineer',
  intro:
    'Recent graduate of the University of Science, VNUHCM. I build SaaS applications end to end: responsive front ends in React and REST APIs in Go, PHP and Node.js, using AI agent tools like Claude and ChatGPT/Codex to ship faster.',
  avatar: 'avatar.png',
  avatarAlt: 'Portrait of Nguyễn Hải Quân',
};

export const contact = {
  email: 'mailto:you@example.com',
  github: 'https://github.com/HQuan1428',
  linkedin: 'https://www.linkedin.com/in/your-handle/',
};

export interface Tech {
  name: string;
  /** simple-icons export name, e.g. 'siReact'. */
  icon?: string;
  /** Logo file under src/assets/ when simple-icons has none. */
  image?: string;
}

export const techStack: Tech[] = [
  { name: 'React', icon: 'siReact' },
  { name: 'Go', icon: 'siGo' },
  { name: 'Node.js', icon: 'siNodedotjs' },
  { name: 'PostgreSQL', icon: 'siPostgresql' },
  { name: 'AWS', image: 'logos/aws.png' },
  { name: 'Claude', icon: 'siClaude' },
  { name: 'Rust', icon: 'siRust' },
  { name: 'Next.js', icon: 'siNextdotjs' },
  { name: 'C++', icon: 'siCplusplus' },
  { name: '.NET', icon: 'siDotnet' },
  { name: 'Unity', icon: 'siUnity' },
  { name: 'DeepSeek', icon: 'siDeepseek' },
  { name: 'Flutter', icon: 'siFlutter' },
  { name: 'MySQL', icon: 'siMysql' },
  { name: 'MongoDB', icon: 'siMongodb' },
  { name: 'Google Cloud', icon: 'siGooglecloud' },
];

export const experience = {
  org: 'AIPOWER Co., Ltd.',
  role: 'Software Development Intern',
  period: '04/2026 — 10/2026',
  tech: ['React', 'Golang', 'PostgreSQL', 'Zalo Mini Program', 'AI tuning'],
  cases: [
    {
      title: 'Document extraction',
      description:
        'Built a document information extraction system (document numbers, accounting data, statistics) integrating OCR and AI.',
    },
    {
      title: 'SuperApp',
      description: 'Contributed to the development of a SuperApp integrating multiple third-party services.',
    },
    {
      title: 'Zalo Mini Apps',
      description: 'Contributed to the development of Zalo Mini Apps for loyalty programs (Givral, Kem Trang Tien).',
    },
  ] satisfies Case[],
};

export const skills: SkillGroup[] = [
  {
    title: 'Engineering',
    points: [
      'Solid understanding of Object-Oriented Programming (OOP) and databases (SQL, NoSQL).',
      'Responsive front ends in React; REST APIs in Go, PHP and Node.js.',
    ],
    tags: ['React', 'Go', 'PHP', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Cloud & AI',
    points: [
      'Experienced working with cloud platforms such as AWS and Google Cloud.',
      'Developed AI-integrated applications, including LLM (Large Language Model) and CV (Computer Vision).',
      'Proficient in using AI agent tools (Claude, ChatGPT/Codex) to optimize workflows and improve productivity.',
    ],
    tags: ['AWS', 'Google Cloud', 'LLM', 'Computer Vision'],
  },
  {
    title: 'Language & soft skills',
    points: [
      'English: proficient in reading and writing technical documentation; currently improving spoken communication skills.',
      'Strong sense of responsibility, proactive work ethic, and effective problem-solving abilities.',
    ],
  },
];

/** Recent work. The section and its nav link appear only when this has entries. */
export const projects: Project[] = [];

export const education = {
  school: 'University of Science — VNUHCM',
  period: '09/2022 — 09/2026',
  graduated: '2026',
};
