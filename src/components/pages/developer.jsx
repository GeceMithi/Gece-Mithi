import { useState } from 'react';
import profileImg from '../../assets/developer/profile1.jpg';
import HomeSection from './developer/HomeSection';
import SkillsSection from './developer/SkillsSection';
import ResumeSection from './developer/ResumeSection';
import ContactSection from './developer/ContactSection';

const navLinks = [
  { id: 'home', icon: 'fa-home', label: 'HOME' },
  { id: 'skills', icon: 'fa-user', label: 'SKILLS' },
  { id: 'resume', icon: 'fa-file', label: 'RESUME' },
  { id: 'contact', icon: 'fa-envelope', label: 'CONTACT' },
];

const sectionComponents = {
  home: HomeSection,
  skills: SkillsSection,
  resume: ResumeSection,
  contact: ContactSection,
};

export default function Developer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const ActiveSection = sectionComponents[activeSection];

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-100 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-screen selection:bg-pink-500 selection:text-white overflow-x-hidden w-full relative">
      <button
        type="button"
        aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] bg-slate-950 text-white w-12 h-12 rounded-full border-2 border-pink-400 shadow-[0_0_0_3px_rgba(15,23,42,0.8),0_0_22px_rgba(219,39,119,0.75)] flex items-center justify-center hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/70 transition-transform"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="h-6 w-6"
        >
          {isSidebarOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 grid h-screen max-h-screen w-72 grid-rows-[auto_1fr_auto] overflow-hidden border-r border-indigo-400/30 bg-[#070b19] shadow-[8px_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-3 px-5 text-center">
          <div className="relative mb-3 inline-block">
            <div className="relative h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <img
                src={profileImg}
                alt="Profile"
                className="h-full w-full rounded-full border-2 border-[#070b19] object-cover"
              />
              <span className="absolute bottom-1 right-2 h-4 w-4 rounded-full border-2 border-[#070b19] bg-emerald-400"></span>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-wider text-white">
            SANDESH <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">KHEMANI SUTHER</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold tracking-wide text-indigo-300">
            Full-Stack Web Developer
          </p>
        </div>

        <nav aria-label="Developer sections" className="flex flex-col justify-center gap-4 sm:gap-5 px-6 py-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleSectionChange(link.id)}
              aria-current={activeSection === link.id ? 'page' : undefined}
              className={`flex h-11 items-center justify-center gap-3 rounded-xl border text-sm font-bold tracking-widest transition-all duration-200 ${
                activeSection === link.id
                  ? 'border-violet-400/70 bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-violet-600/35 text-white shadow-[0_0_18px_rgba(219,39,119,0.35)]'
                  : 'border-indigo-400/30 bg-slate-900/50 text-white/90 hover:border-indigo-400/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <i className={`fa ${link.icon} text-base shrink-0 text-white`}></i>
              <span className="text-white">{link.label}</span>
            </button>
          ))}
        </nav>

        <footer className="border-t border-indigo-400/20 bg-slate-950/60 py-3 px-4 text-center">
          <p className="text-xs font-semibold text-indigo-200/70">
            &copy; 2026 SANDESH KHEMANI SUTHER<br />All Rights Reserved.
          </p>
        </footer>
      </aside>

      <main className="md:ml-72 relative w-full md:w-[calc(100%-18rem)] overflow-hidden">
        <ActiveSection key={activeSection} />
      </main>
    </div>
  );
}
