import { Mail, MapPin, Phone } from 'lucide-react';
import profileImg from '../../../assets/developer/profile1.jpg';
import fbLogo from '../../../assets/developer/logos/facebook.png';
import whatsappLogo from '../../../assets/developer/logos/social.png';
import githubLogo from '../../../assets/developer/logos/github.png';

export default function ContactSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 min-h-[80vh] flex items-center w-full">
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2rem] border border-indigo-400/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
            <div className="lg:col-span-7 w-full">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center lg:text-left">Get In Touch</h2>
              <p className="text-indigo-200/70 mb-8 text-base sm:text-lg text-center lg:text-left">Feel free to reach out for projects, collaborations, or just a friendly hello!</p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-slate-950/40 border border-indigo-400/30 hover:border-pink-500/50 transition-colors w-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    <Phone aria-hidden="true" size={22} strokeWidth={2} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-wider mb-0.5 sm:mb-1">Phone</h4>
                    <p className="text-sm sm:text-lg font-semibold text-white truncate">+92 3361121841</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-slate-950/40 border border-indigo-400/30 hover:border-purple-500/50 transition-colors w-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    <Mail aria-hidden="true" size={22} strokeWidth={2} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-wider mb-0.5 sm:mb-1">Email</h4>
                    <p className="text-sm sm:text-lg font-semibold text-white truncate">sandesh.suther@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-slate-950/40 border border-indigo-400/30 hover:border-indigo-500/50 transition-colors w-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    <MapPin aria-hidden="true" size={22} strokeWidth={2} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-wider mb-0.5 sm:mb-1">Location</h4>
                    <p className="text-sm sm:text-lg font-semibold text-white truncate">Mithi, Sindh, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-5 mt-8 pt-8 border-t border-indigo-400/30 justify-center lg:justify-start">
                <a href="https://www.facebook.com/profile.php?id=61568209495233" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden hover:scale-110 transition-transform shadow-[0_0_15px_rgba(219,39,119,0.3)] border border-indigo-400/30 hover:border-pink-500/50 bg-white flex justify-center items-center">
                  <img src={fbLogo} alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                </a>

                <a href="https://wa.me/03361121841" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-indigo-400/30 hover:border-purple-500/50 bg-white flex justify-center items-center">
                  <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                </a>

                <a href="https://github.com/SandeshKhemaniSuther" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400/30 hover:border-indigo-500/50 bg-white flex justify-center items-center">
                  <img src={githubLogo} alt="GitHub" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center w-full pb-8 lg:pb-0 lg:pt-0 lg:border-l border-b lg:border-b-0 border-indigo-500/20 mb-4 lg:mb-0">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-1.5 shadow-[0_0_40px_rgba(219,39,119,0.3)] hover:scale-105 transition-transform duration-500 mx-auto">
                <img src={profileImg} alt="Sandesh Khemani Suther Logo" className="w-full h-full object-cover rounded-full border-4 border-slate-900" />
              </div>
              <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-extrabold text-white tracking-widest text-center">SANDESH KHEMANI SUTHER</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
