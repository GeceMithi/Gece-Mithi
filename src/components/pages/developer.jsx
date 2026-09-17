import React from 'react';
import { ArrowUpRight, Code2, Database, ExternalLink, Layers3, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const skills = ['React.js', 'JavaScript', 'Node.js', 'Firebase', 'MongoDB', 'Tailwind CSS', 'Cloudinary'];

const services = [
    { icon: Code2, title: 'Web Applications', description: 'Fast, focused interfaces that turn complex workflows into simple digital products.' },
    { icon: Layers3, title: 'Responsive Design', description: 'Thoughtful layouts that feel natural on phones, tablets and large screens.' },
    { icon: Database, title: 'Data & Cloud', description: 'Reliable Firebase, media and content systems built for real-world teams.' },
];

const Developer = () => {
    return (
        <div className="relative -mx-4 -my-4 overflow-hidden bg-[#071b14] text-white md:-mx-8 md:-my-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,210,0,0.18),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(0,110,70,0.38),transparent_32%)]" />
            <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 md:py-14">
                <nav className="mb-16 flex items-center justify-between border-b border-white/10 pb-5 text-sm">
                    <span className="font-bold tracking-[0.2em] text-[#ffd200]">SKS / 2025</span>
                    <span className="text-white/55">Independent web developer</span>
                </nav>

                <section className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffd200]/35 bg-[#ffd200]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd200]">
                            <Sparkles size={14} /> Available for meaningful projects
                        </div>
                        <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
                            Sandesh Khemani <span className="text-[#ffd200]">Suther.</span>
                        </h1>
                        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                            Full-stack web developer creating useful, polished digital experiences for education, businesses and ambitious ideas.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <a href="mailto:gecemithiedu@gmail.com" className="inline-flex items-center gap-2 rounded-lg bg-[#ffd200] px-5 py-3 font-bold text-[#071b14] transition hover:bg-white">
                                Start a conversation <ArrowUpRight size={18} />
                            </a>
                            <a href="https://sandeshkhemani.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 font-bold text-white transition hover:border-[#ffd200] hover:text-[#ffd200]">
                                View website <ExternalLink size={17} />
                            </a>
                        </div>
                    </div>

                    <div className="border-l border-[#ffd200]/50 pl-6 lg:mb-2">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd200]">The approach</p>
                        <p className="mt-4 text-2xl font-semibold leading-tight">Build clearly. Design intentionally. Ship with care.</p>
                        <p className="mt-5 text-sm leading-6 text-white/55">Based in Mithi, Tharparkar, Sindh, Pakistan.</p>
                    </div>
                </section>

                <section className="mt-20 grid gap-4 border-y border-white/10 py-7 sm:grid-cols-3">
                    <div><p className="text-3xl font-black text-[#ffd200]">04+</p><p className="mt-1 text-sm text-white/55">Years building for the web</p></div>
                    <div><p className="text-3xl font-black text-[#ffd200]">07</p><p className="mt-1 text-sm text-white/55">Core technologies in practice</p></div>
                    <div><p className="text-3xl font-black text-[#ffd200]">01</p><p className="mt-1 text-sm text-white/55">Purpose: useful digital work</p></div>
                </section>

                <section className="mt-16 grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd200]">Capabilities</p>
                        <h2 className="mt-3 text-3xl font-bold">A practical stack for ambitious work.</h2>
                        <p className="mt-4 leading-7 text-white/60">From the first wireframe to a stable production system, every detail has a job.</p>
                        <div className="mt-7 flex flex-wrap gap-2">
                            {skills.map((skill) => <span key={skill} className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80">{skill}</span>)}
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {services.map((service) => (
                            <article key={service.title} className="border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:border-[#ffd200]/60">
                                {React.createElement(service.icon, { className: 'text-[#ffd200]', size: 25 })}
                                <h3 className="mt-8 text-lg font-bold">{service.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-white/55">{service.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd200]">Let&apos;s connect</p>
                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                            <a href="tel:+923361121841" className="inline-flex items-center gap-2 text-[#ffd200] hover:text-[#ffd200]"><Phone size={16} /> +92-336-1121841</a>
                            <a href="mailto:gecemithiedu@gmail.com" className="inline-flex items-center gap-2 text-[#ffd200] hover:text-[#ffd200]"><Mail size={16} /> gecemithiedu@gmail.com</a>
                            <span className="inline-flex items-center gap-2"><MapPin size={16} /> Mithi, Pakistan</span>
                        </div>
                    </div>
                    <button onClick={() => window.history.back()} className="self-start rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-white/75 transition hover:border-[#ffd200] hover:text-[#ffd200]">Back to website</button>
                </section>
            </div>
        </div>
    );
};

export default Developer;
