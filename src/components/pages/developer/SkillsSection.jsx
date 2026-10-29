const programmingLanguages = [
  { name: 'HTML', icon: 'html', percent: 95 },
  { name: 'CSS', icon: 'css', percent: 90 },
  { name: 'JavaScript', icon: 'js', percent: 90 },
  { name: 'TypeScript', icon: 'ts', percent: 90 },
  { name: 'Python', icon: 'python', percent: 90 },
  { name: 'React', icon: 'react', percent: 90 },
  { name: 'Laravel', icon: 'laravel', percent: 90 },
  { name: 'Node.js', icon: 'nodejs', percent: 90 },
  { name: 'Express', icon: 'express', percent: 90 },
  { name: 'Tailwind CSS', icon: 'tailwind', percent: 90 },
];

export default function SkillsSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-16 w-full">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-12">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-4">
              Skills
              <span className="h-1 w-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"></span>
            </h2>
            <ul className="mt-6 space-y-4 text-indigo-100/80 text-sm sm:text-base md:text-lg">
              <li className="flex items-start gap-3"><span className="text-xl shrink-0">⚡</span> <span><b className="text-pink-400">Full-Stack Developer</b> specializing in modern web technologies (Express, React vite, Node.js, Python, React native, Laravel)</span></li>
              <li className="flex items-start gap-3"><span className="text-xl shrink-0">🌐</span> <span>I can build various types of websites like <b className="text-blue-400">Business, Wedding, News, Education, E-commerce, Portfolio, Blog, and LMS Portals</b>.</span></li>
              <li className="flex items-start gap-3"><span className="text-xl shrink-0">🚀</span> <span>Passionate about building <b className="text-indigo-400">dynamic web applications</b>, user portals, and interactive UIs</span></li>
              <li className="flex items-start gap-3"><span className="text-xl shrink-0">🎯</span> <span>Always pushing my boundaries with tools like <b className="text-violet-400">React Vite, React Native, Python, Typescript, HTML, Tailwind CSS,</b></span></li>
              <li className="flex items-start gap-3"><span className="text-xl shrink-0">🤝</span> <span>Open to <b className="text-emerald-400">freelance work and Web and App development</b></span></li>
            </ul>
          </div>
          <img
            alt="Coding"
            className="w-full sm:w-80 md:w-96 lg:w-[400px] rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.15)] border border-indigo-400/30 object-cover mx-auto"
            src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
          />
        </div>

        <div className="bg-slate-900/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-indigo-400/30 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl">
              <span className="font-mono font-bold">&lt;/&gt;</span>
            </div>
            <h3 className="text-xl font-bold text-white">Programming Languages</h3>
          </div>

          <div className="space-y-6">
            {programmingLanguages.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <img src={`https://skillicons.dev/icons?i=${skill.icon}`} alt={skill.name} className="w-6 h-6 object-contain" />
                    <span className="text-indigo-100 font-medium text-sm sm:text-base">{skill.name}</span>
                  </div>
                  <span className="text-indigo-300 font-bold text-sm">{skill.percent}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 w-full">
          <div className="bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-indigo-400/30 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl sm:text-2xl shadow-inner shrink-0">🗄️</div>
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Databases &amp; Cloud</h3>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-indigo-400/20 flex justify-center w-full overflow-x-auto hide-scrollbar">
              <img src="https://skillicons.dev/icons?i=firebase,mysql,postgresql,supabase,cloudinary,cloudflare" alt="Firebase, MySQL, PostgreSQL, Supabase, Cloudinary, and Cloudflare" className="hover:scale-105 transition-transform min-w-[240px]" />
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-indigo-400/30 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl sm:text-2xl shadow-inner shrink-0">🔧</div>
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Tools &amp; Platforms</h3>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-indigo-400/20 flex justify-center w-full overflow-x-auto hide-scrollbar">
              <img src="https://skillicons.dev/icons?i=git,github,vscode,postman,vercel,netlify,figma" alt="Tools and platforms" className="hover:scale-105 transition-transform min-w-[250px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
