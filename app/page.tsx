"use client"

import { Github, Linkedin, Mail, ExternalLink, MapPin, Code2, Database, Terminal, Globe, BookOpen, Calendar, Clock } from "lucide-react"

const skills = {
  languages: ["Python", "JavaScript", "TypeScript", "Rust", "SQL"],
  frameworks: ["Django", "FastAPI", "Next.js", "React", "Tailwind CSS"],
  tools: ["Docker", "Git", "AWS", "PostgreSQL", "Redis"],
  aiTools: ["Cursor", "Claude", "Gemini", "v0", "GitHub Copilot", "ChatGPT"],
  specialties: ["REST APIs", "Web Scraping", "Data Processing", "AI Integrations"],
}

const projects = [
  {
    name: "Thrill Binge",
    description: "Movie discovery platform with TMDB API integration for browsing and searching films",
    tags: ["Next.js", "TypeScript", "TMDB API"],
    link: "https://github.com/imsudip45/ThrillBinge",
  },
  {
    name: "Seabirds Pictures",
    description: "Photo gallery and portfolio site built with Django backend",
    tags: ["Django", "Python"],
    link: "https://github.com/imsudip45/seabirds_pictures",
  },
  {
    name: "Rustle",
    description: "High-performance CLI tool built in Rust for efficient file management",
    tags: ["Rust", "CLI"],
    link: "https://github.com/imsudip45/rustle",
  },
  {
    name: "Labya Compute",
    description: "Hand gesture recognition system using MediaPipe and Gemini AI",
    tags: ["Python", "MediaPipe", "Gemini"],
    link: "https://github.com/imsudip45/labya-compute",
  },
  {
    name: "Iron Man Game",
    description: "Interactive browser-based game with HTML, CSS and JavaScript",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/imsudip45/iron-man-game",
  },
  {
    name: "Search Your Laptop",
    description: "Desktop search utility for quickly finding files and content",
    tags: ["Python", "Desktop"],
    link: "https://github.com/imsudip45/Search-your-laptop",
  },
  {
    name: "Fingerprint",
    description: "Planner-driven Gemini AI tutor for kids with voice-first learning",
    tags: ["FastAPI", "React", "Gemini"],
    link: "https://fingerprintdemo-681576473497.asia-south1.run.app/",
  },
  {
    name: "eKantipur Scraper",
    description: "Web scraper for aggregating news from eKantipur portal",
    tags: ["Python", "Scraping"],
    link: "https://github.com/imsudip45/ekantipur-scraper",
  },
  {
    name: "E-Commerce Revision",
    description: "Educational app for e-commerce concepts and revision",
    tags: ["Python", "Education"],
    link: "https://github.com/imsudip45/E-commerce-revision",
  },
  {
    name: "MIXDOWS",
    description: "Windows desktop customization and utility tool",
    tags: ["Python", "Desktop"],
    link: "https://github.com/imsudip45/MIXDOWS",
  },
]

const blogs = [
  {
    title: "Fingerprint: Building a Planner-Driven Gemini Tutor for Kids",
    description: "A deep dive into building a voice-first AI learning companion using Gemini Live, FastAPI, and React. Exploring planner architecture, session state management, and real-time audio streaming.",
    tags: ["Gemini Live", "FastAPI", "React", "AI Agents"],
    date: "Mar 16, 2026",
    readTime: "9 min read",
    link: "https://medium.com/@niroulasudip4/fingerprint-building-a-planner-driven-gemini-tutor-for-kids-031caa177cb4",
  },
]

const socials = [
  { name: "GitHub", href: "https://github.com/imsudip45", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/sudipniroula45", icon: Linkedin },
  { name: "Email", href: "mailto:sudipniroula5@gmail.com", icon: Mail },
]

export default function Portfolio() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full p-6 gap-6">
        {/* Left Column - Profile */}
        <section className="w-80 shrink-0 flex flex-col gap-5">
          <ProfileCard />
          <SkillsCard />
        </section>

        {/* Right Column - Projects & Blogs */}
        <section className="flex-1 flex flex-col min-w-0 gap-4 overflow-y-auto scrollbar-thin pr-1">
          <ProjectsGrid />
          <BlogsSection />
        </section>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden h-full p-5 gap-4">
        <section className="w-72 shrink-0 flex flex-col gap-4">
          <ProfileCard />
          <SkillsCard />
        </section>
        <section className="flex-1 flex flex-col min-w-0 gap-4 overflow-y-auto scrollbar-thin pr-1">
          <ProjectsGrid />
          <BlogsSection />
        </section>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden h-full flex-col p-4 overflow-y-auto scrollbar-thin">
        <ProfileCardMobile />
        <SkillsCardMobile />
        <ProjectsGridMobile />
        <BlogsSectionMobile />
      </div>
    </main>
  )
}

function ProfileCard() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
          <span className="text-2xl font-bold text-primary">SN</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sudip Niroula</h1>
          <p className="text-primary font-medium text-sm">Python Developer</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
        <MapPin className="w-4 h-4" />
        <span>Nepal</span>
        <span className="mx-2 text-border">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Open to work
        </span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-5">
        A passionate developer building efficient, scalable solutions. I specialize in backend development with Python, creating robust APIs, automation scripts, and data processing pipelines. From web scraping to AI integrations, I enjoy tackling diverse challenges across the full stack.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <Stat icon={Code2} label="Projects" value="10+" />
        <Stat icon={Database} label="Years" value="3+" />
        <Stat icon={Globe} label="Tech" value="15+" />
      </div>

      <div className="flex gap-2">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary/50 rounded-lg text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            aria-label={social.name}
          >
            <social.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Code2; label: string; value: string }) {
  return (
    <div className="text-center p-2 bg-secondary/30 rounded-lg">
      <Icon className="w-4 h-4 mx-auto text-primary mb-1" />
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  )
}

function SkillsCard() {
  return (
    <div className="flex-1 bg-card rounded-2xl border border-border p-5 animate-fade-in-up overflow-hidden" style={{ animationDelay: "100ms" }}>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-primary" />
        Skills
      </h2>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100%-2rem)] scrollbar-thin pr-1">
        <SkillGroup title="Languages" skills={skills.languages} />
        <SkillGroup title="Frameworks" skills={skills.frameworks} />
        <SkillGroup title="Tools" skills={skills.tools} />
        <SkillGroup title="AI Tools" skills={skills.aiTools} />
        <SkillGroup title="Specialties" skills={skills.specialties} />
      </div>
    </div>
  )
}

function SkillGroup({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div>
      <h3 className="text-[11px] text-muted-foreground/70 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 bg-secondary/50 text-foreground/90 text-xs rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectsGrid() {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          Projects
        </h2>
        <span className="text-xs text-muted-foreground">{projects.length} total</span>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-2.5 content-start">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <a
      href={project.link}
      className="group bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all duration-200 flex flex-col animate-scale-in"
      style={{ animationDelay: `${150 + index * 30}ms` }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
          {project.name}
        </h3>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200 shrink-0 ml-2" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1 line-clamp-2">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium">
            {tag}
          </span>
        ))}
      </div>
    </a>
  )
}

function BlogsSection() {
  return (
    <div className="shrink-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Blog Posts
        </h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.title} blog={blog} index={index} />
        ))}
      </div>
    </div>
  )
}

function BlogCard({ blog, index }: { blog: typeof blogs[0]; index: number }) {
  return (
    <a
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all duration-200 flex flex-col animate-scale-in"
      style={{ animationDelay: `${250 + index * 30}ms` }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2 flex-1 pr-2">
          {blog.title}
        </h3>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200 shrink-0" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1 line-clamp-2">
        {blog.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {blog.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {blog.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {blog.readTime}
          </span>
        </div>
      </div>
    </a>
  )
}

/* Mobile Components */
function ProfileCardMobile() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
          <span className="text-xl font-bold text-primary">SN</span>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Sudip Niroula</h1>
          <p className="text-primary font-medium text-sm">Python Developer</p>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Open to work</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
        A passionate developer building efficient, scalable solutions. I specialize in backend development with Python, creating robust APIs, automation scripts, and data processing pipelines.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-secondary/30 rounded-lg">
          <div className="text-lg font-bold text-foreground">10+</div>
          <div className="text-[10px] text-muted-foreground uppercase">Projects</div>
        </div>
        <div className="text-center p-2 bg-secondary/30 rounded-lg">
          <div className="text-lg font-bold text-foreground">3+</div>
          <div className="text-[10px] text-muted-foreground uppercase">Years</div>
        </div>
        <div className="text-center p-2 bg-secondary/30 rounded-lg">
          <div className="text-lg font-bold text-foreground">15+</div>
          <div className="text-[10px] text-muted-foreground uppercase">Tech</div>
        </div>
      </div>

      <div className="flex gap-2">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-secondary/50 rounded-lg text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            aria-label={social.name}
          >
            <social.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function SkillsCardMobile() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-primary" />
        Skills
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {[...skills.languages, ...skills.frameworks.slice(0, 3), ...skills.aiTools.slice(0, 4)].map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 bg-secondary/50 text-foreground/90 text-xs rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectsGridMobile() {
  return (
    <div className="animate-fade-in-up mb-4" style={{ animationDelay: "150ms" }}>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Code2 className="w-4 h-4 text-primary" />
        Projects
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {projects.map((project, index) => (
          <a
            key={project.name}
            href={project.link}
            className="group bg-card rounded-lg border border-border p-4 hover:border-primary/40 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function BlogsSectionMobile() {
  return (
    <div className="animate-fade-in-up pb-4" style={{ animationDelay: "200ms" }}>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        Blog Posts
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {blogs.map((blog) => (
          <a
            key={blog.title}
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card rounded-lg border border-border p-4 hover:border-primary/40 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors leading-tight flex-1 pr-2">
                {blog.title}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
              {blog.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {blog.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{blog.date}</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
