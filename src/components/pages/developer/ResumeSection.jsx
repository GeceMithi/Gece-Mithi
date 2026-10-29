export default function ResumeSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 w-full">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-4">
            My Objective
            <span className="h-px flex-1 bg-indigo-500/30"></span>
          </h2>
          <p className="text-indigo-200/70 leading-relaxed text-sm sm:text-base md:text-lg text-justify sm:text-left">
            Detail-oriented professional with strong hands-on experience in full-stack web development. Aiming to leverage a diverse technical skill set to architect high-quality, functional, and impactful digital solutions, scalable applications, and educational portals for clients and organizations.
          </p>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            Education &amp; Certificates
            <span className="h-px flex-1 bg-indigo-500/30"></span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <li className="bg-slate-900/40 p-4 rounded-xl border border-indigo-400/30 shadow-sm flex items-center gap-3 text-indigo-100/80 font-medium text-sm sm:text-base">
              <i className="fa fa-graduation-cap text-pink-400 text-xl w-6 shrink-0 text-center"></i> Bachelor&apos;s in Computer Science
            </li>
            <li className="bg-slate-900/40 p-4 rounded-xl border border-indigo-400/30 shadow-sm flex items-center gap-3 text-indigo-100/80 font-medium text-sm sm:text-base">
              <i className="fa fa-book text-purple-400 text-xl w-6 shrink-0 text-center"></i> B.Ed (Hons) 4 Years Degree in Education
            </li>
            <li className="bg-slate-900/40 p-4 rounded-xl border border-indigo-400/30 shadow-sm flex items-center gap-3 text-indigo-100/80 font-medium md:col-span-2 text-sm sm:text-base">
              <i className="fa fa-certificate text-indigo-400 text-xl w-6 shrink-0 text-center"></i> Certification in Web Dev (Full-Stack / MERN)
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 flex items-center gap-4">
            My Experience
            <span className="h-px flex-1 bg-indigo-500/30"></span>
          </h2>
          <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-10">
            <div className="relative">
              <span className="absolute -left-[33px] top-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-4 border-slate-950 shadow-md"></span>
              <h3 className="text-lg sm:text-xl font-bold text-indigo-300">Web Designer/Developer</h3>
              <p className="text-indigo-200/60 mt-2 leading-relaxed text-sm sm:text-base text-justify sm:text-left">Designed and delivered responsive websites and dynamic e-portals, integrating backend functionality and optimizing performance to create reliable, user-focused digital experiences.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[33px] top-1 w-4 h-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full border-4 border-slate-950 shadow-md"></span>
              <h3 className="text-lg sm:text-xl font-bold text-indigo-300">Freelance Web &amp; App Designer/Developer</h3>
              <p className="text-indigo-200/60 mt-2 leading-relaxed text-sm sm:text-base text-justify sm:text-left">Developed custom website and app designs and scalable web applications for clients on platforms such as Fiverr and Upwork, managing projects from concept to delivery while meeting deadlines and quality expectations.</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            Why Choose Me?
            <span className="h-px flex-1 bg-indigo-500/30"></span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-200/80">
            <li className="flex items-start gap-3 bg-slate-900/40 p-5 rounded-2xl border border-indigo-400/20 hover:border-pink-500/30 transition-colors">
              <i className="fa fa-check-circle text-pink-400 mt-1 text-xl shrink-0"></i>
              <span className="text-sm sm:text-base"><b>Clean &amp; Modern UI/UX:</b> Visually engaging, responsive designs built for an effortless user experience.</span>
            </li>
            <li className="flex items-start gap-3 bg-slate-900/40 p-5 rounded-2xl border border-indigo-400/20 hover:border-purple-500/30 transition-colors">
              <i className="fa fa-check-circle text-purple-400 mt-1 text-xl shrink-0"></i>
              <span className="text-sm sm:text-base"><b>Scalable Back-End:</b> Secure, optimized Node.js &amp; cloud architectures tailored for growth.</span>
            </li>
            <li className="flex items-start gap-3 bg-slate-900/40 p-5 rounded-2xl border border-indigo-400/20 hover:border-indigo-400/30 transition-colors">
              <i className="fa fa-check-circle text-indigo-400 mt-1 text-xl shrink-0"></i>
              <span className="text-sm sm:text-base"><b>Solution-Driven:</b> Turning complex ideas into high-performing, functional web applications.</span>
            </li>
            <li className="flex items-start gap-3 bg-slate-900/40 p-5 rounded-2xl border border-indigo-400/20 hover:border-blue-400/30 transition-colors">
              <i className="fa fa-check-circle text-blue-400 mt-1 text-xl shrink-0"></i>
              <span className="text-sm sm:text-base"><b>Reliable &amp; Timely:</b> Clean, maintainable code delivered on deadline, every time.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
