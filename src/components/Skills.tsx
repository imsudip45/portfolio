import React, { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

const skills: Skill[] = [
  { name: 'Python', level: 95, category: 'Languages' },
  { name: 'Flask', level: 90, category: 'Frameworks' },
  { name: 'Django', level: 85, category: 'Frameworks' },
  { name: 'FastAPI', level: 80, category: 'Frameworks' },
  { name: 'SQL', level: 85, category: 'Database' },
  { name: 'Pandas', level: 90, category: 'Data Science' },
  { name: 'Docker', level: 75, category: 'DevOps' },
  { name: 'AWS', level: 70, category: 'Cloud' },
  { name: 'Git', level: 85, category: 'Tools' },
  { name: 'REST API', level: 90, category: 'Concepts' }
];

const Skills: React.FC = () => {
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillBars = document.querySelectorAll('.skill-bar');
            skillBars.forEach((bar, index) => {
              setTimeout(() => {
                bar.classList.add('animate-skill');
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">My Skills</h2>
          <div className="h-0.5 w-16 bg-indigo-600 dark:bg-indigo-400 mx-auto mb-6"></div>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            A collection of technologies and tools I've worked with throughout my journey.
          </p>
        </div>

        <div ref={skillsRef} className="space-y-12 max-w-4xl mx-auto">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{category}</h3>
              <div className="space-y-6">
                {categorySkills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{skill.name}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="skill-bar h-full bg-indigo-600 dark:bg-indigo-400 rounded-full w-0"
                        style={{ width: '0%' }}
                        data-width={`${skill.level}%`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-skill {
          animation: fillSkill 1s forwards ease-out;
        }
        
        @keyframes fillSkill {
          0% {
            width: 0%;
          }
          100% {
            width: attr(data-width);
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;