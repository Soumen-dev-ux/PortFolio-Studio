import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SectionKey, SectionPayloadMap, PublishedMap } from './types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl.trim() && supabaseAnonKey.trim() && !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SECTIONS: { key: SectionKey; label: string; icon: string; desc: string }[] = [
  { key: 'site', label: 'Site / Hero', icon: '⚡', desc: 'Personal branding, title & availability' },
  { key: 'about', label: 'About', icon: '👤', desc: 'Bio narrative and bullet highlights' },
  { key: 'skills', label: 'Skills', icon: '🛠️', desc: 'Tech stack categorized by groups' },
  { key: 'projects', label: 'Projects', icon: '🚀', desc: 'Featured applications and repositories' },
  { key: 'experience', label: 'Experience', icon: '💼', desc: 'Work history and career timeline' },
  { key: 'education', label: 'Education', icon: '🎓', desc: 'Degrees, certifications and academia' },
  { key: 'achievements', label: 'Awards', icon: '🏆', desc: 'Honors, hackathons and recognitions' },
  { key: 'gallery', label: 'Gallery', icon: '🖼️', desc: 'Showcase images and snapshots' },
  { key: 'contact', label: 'Contact', icon: '📬', desc: 'Contact info and social media channels' },
  { key: 'resume', label: 'Resume', icon: '📄', desc: 'CV document download link and status' },
];

export const DEFAULT_SEED: SectionPayloadMap = {
  site: {
    name: 'Soumen Pore',
    headline: 'Developer building thoughtful digital products',
    location: 'West Bengal, India',
    availability: 'Open to opportunities',
    bioShort: 'Passionate software developer crafting high-performance web & mobile applications.',
  },
  about: {
    heading: 'About Me',
    body: 'I am a passionate software developer specializing in modern web and mobile ecosystems. I enjoy building sleek user interfaces, architecting resilient backends, and crafting delightful digital experiences.',
    highlights: [
      '5+ years building production applications',
      'Specialized in React, Next.js, React Native & TypeScript',
      'Strong focus on UI/UX aesthetics and system architecture',
    ],
  },
  skills: {
    groups: [
      {
        category: 'Frontend & Mobile',
        items: ['React', 'React Native', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand'],
      },
      {
        category: 'Backend & Cloud',
        items: ['Node.js', 'Express', 'Supabase', 'PostgreSQL', 'REST & GraphQL APIs', 'Docker'],
      },
      {
        category: 'Tools & DevOps',
        items: ['Git / GitHub', 'Expo EAS', 'Vite', 'Figma', 'Linux / Bash', 'CI/CD Pipelines'],
      },
    ],
  },
  projects: {
    items: [
      {
        id: 'proj-1',
        title: 'Portfolio Studio Android',
        description: 'Native Android management studio built with React Native and Supabase for live portfolio editing.',
        tags: ['React Native', 'Expo', 'Supabase', 'TypeScript'],
        liveUrl: '',
        repoUrl: 'https://github.com/techie-sou/portfolio-studio-android',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        featured: true,
      },
      {
        id: 'proj-2',
        title: 'Next.js Modern Developer Portfolio',
        description: 'High-performance interactive developer portfolio showcasing creative UI, dark mode, and dynamic CMS content.',
        tags: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
        liveUrl: 'https://soumenpore.dev',
        repoUrl: 'https://github.com/techie-sou/portfolio',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        featured: true,
      },
    ],
  },
  experience: {
    items: [
      {
        id: 'exp-1',
        role: 'Full-Stack Developer',
        company: 'Digital Solutions Lab',
        period: '2023 - Present',
        location: 'Remote / India',
        description: 'Architecting scalable web applications, designing RESTful APIs, and implementing mobile features with React Native.',
      },
    ],
  },
  education: {
    items: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Technology in Computer Science',
        institution: 'University Engineering College',
        period: '2019 - 2023',
        grade: 'First Class with Distinction',
        description: 'Core studies in Data Structures, Algorithms, Software Engineering, and Database Management Systems.',
      },
    ],
  },
  achievements: {
    items: [
      {
        id: 'ach-1',
        title: 'Outstanding Project Award',
        issuer: 'Annual Tech Summit',
        year: '2024',
        description: 'Awarded for building an innovative real-time collaborative workspace.',
      },
    ],
  },
  gallery: {
    items: [
      {
        id: 'gal-1',
        title: 'Workspace Setup',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        caption: 'Minimal mechanical workstation and dual monitor development setup.',
      },
    ],
  },
  contact: {
    email: 'contact@soumenpore.dev',
    phone: '+91 98765 43210',
    location: 'West Bengal, India',
    socialLinks: [
      { id: 'soc-1', platform: 'GitHub', url: 'https://github.com/techie-sou' },
      { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com/in/soumenpore' },
      { id: 'soc-3', platform: 'Twitter / X', url: 'https://x.com/techie_sou' },
    ],
  },
  resume: {
    url: 'https://soumenpore.dev/resume.pdf',
    lastUpdated: 'October 2024',
    notes: 'Available upon request with detailed references.',
  },
};

export const DEFAULT_PUBLISHED: PublishedMap = {
  site: true,
  about: true,
  skills: true,
  projects: true,
  experience: true,
  education: true,
  achievements: true,
  gallery: true,
  contact: true,
  resume: true,
};

/**
 * Normalizes raw payload data safely so forms never encounter undefined values.
 */
export function normalizeSectionPayload<K extends SectionKey>(
  key: K,
  raw: any
): SectionPayloadMap[K] {
  const seed = DEFAULT_SEED[key];
  if (!raw || typeof raw !== 'object') {
    return JSON.parse(JSON.stringify(seed));
  }

  // Deep clone to prevent direct state mutation
  const payload = JSON.parse(JSON.stringify(raw));

  switch (key) {
    case 'site':
      return {
        name: String(payload.name || DEFAULT_SEED.site.name),
        headline: String(payload.headline || DEFAULT_SEED.site.headline),
        location: String(payload.location || DEFAULT_SEED.site.location),
        availability: String(payload.availability || DEFAULT_SEED.site.availability),
        bioShort: payload.bioShort ? String(payload.bioShort) : DEFAULT_SEED.site.bioShort,
      } as SectionPayloadMap[K];

    case 'about':
      return {
        heading: String(payload.heading || DEFAULT_SEED.about.heading),
        body: String(payload.body ?? ''),
        highlights: Array.isArray(payload.highlights) ? payload.highlights.map(String) : [],
      } as SectionPayloadMap[K];

    case 'skills': {
      const groups = Array.isArray(payload.groups)
        ? payload.groups.map((g: any) => ({
            category: String(g?.category || 'General'),
            items: Array.isArray(g?.items) ? g.items.map(String) : [],
          }))
        : DEFAULT_SEED.skills.groups;
      return { groups } as SectionPayloadMap[K];
    }

    case 'projects': {
      const items = Array.isArray(payload.items)
        ? payload.items.map((p: any, idx: number) => ({
            id: p?.id ? String(p.id) : `proj-${idx}-${Date.now()}`,
            title: String(p?.title || ''),
            description: String(p?.description || ''),
            tags: Array.isArray(p?.tags)
              ? p.tags.map(String)
              : typeof p?.tags === 'string'
              ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [],
            liveUrl: String(p?.liveUrl || ''),
            repoUrl: String(p?.repoUrl || ''),
            imageUrl: String(p?.imageUrl || ''),
            featured: Boolean(p?.featured),
          }))
        : DEFAULT_SEED.projects.items;
      return { items } as SectionPayloadMap[K];
    }

    case 'experience': {
      const items = Array.isArray(payload.items)
        ? payload.items.map((e: any, idx: number) => ({
            id: e?.id ? String(e.id) : `exp-${idx}-${Date.now()}`,
            role: String(e?.role || ''),
            company: String(e?.company || ''),
            period: String(e?.period || ''),
            location: String(e?.location || ''),
            description: String(e?.description || ''),
          }))
        : DEFAULT_SEED.experience.items;
      return { items } as SectionPayloadMap[K];
    }

    case 'education': {
      const items = Array.isArray(payload.items)
        ? payload.items.map((e: any, idx: number) => ({
            id: e?.id ? String(e.id) : `edu-${idx}-${Date.now()}`,
            degree: String(e?.degree || ''),
            institution: String(e?.institution || ''),
            period: String(e?.period || ''),
            grade: String(e?.grade || ''),
            description: String(e?.description || ''),
          }))
        : DEFAULT_SEED.education.items;
      return { items } as SectionPayloadMap[K];
    }

    case 'achievements': {
      const items = Array.isArray(payload.items)
        ? payload.items.map((a: any, idx: number) => ({
            id: a?.id ? String(a.id) : `ach-${idx}-${Date.now()}`,
            title: String(a?.title || ''),
            issuer: String(a?.issuer || ''),
            year: String(a?.year || ''),
            description: String(a?.description || ''),
          }))
        : DEFAULT_SEED.achievements.items;
      return { items } as SectionPayloadMap[K];
    }

    case 'gallery': {
      const items = Array.isArray(payload.items)
        ? payload.items.map((g: any, idx: number) => ({
            id: g?.id ? String(g.id) : `gal-${idx}-${Date.now()}`,
            title: String(g?.title || ''),
            imageUrl: String(g?.imageUrl || ''),
            caption: String(g?.caption || ''),
          }))
        : DEFAULT_SEED.gallery.items;
      return { items } as SectionPayloadMap[K];
    }

    case 'contact': {
      const socialLinks = Array.isArray(payload.socialLinks)
        ? payload.socialLinks.map((s: any, idx: number) => ({
            id: s?.id ? String(s.id) : `soc-${idx}-${Date.now()}`,
            platform: String(s?.platform || ''),
            url: String(s?.url || ''),
          }))
        : DEFAULT_SEED.contact.socialLinks;
      return {
        email: String(payload.email || ''),
        phone: String(payload.phone || ''),
        location: String(payload.location || ''),
        socialLinks,
      } as SectionPayloadMap[K];
    }

    case 'resume':
      return {
        url: String(payload.url || ''),
        lastUpdated: payload.lastUpdated ? String(payload.lastUpdated) : DEFAULT_SEED.resume.lastUpdated,
        notes: payload.notes ? String(payload.notes) : DEFAULT_SEED.resume.notes,
      } as SectionPayloadMap[K];

    default:
      return payload as SectionPayloadMap[K];
  }
}
