import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, Globe } from 'lucide-react';

const features = [
  {
    title: "SECURE CORE",
    desc: "Enterprise-grade encryption wrapped in a matte finish.",
    icon: <Shield size={20} strokeWidth={1} />,
  },
  {
    title: "QUANTUM SPEED",
    desc: "Next.js 15 optimized rendering for zero-latency glass.",
    icon: <Zap size={20} strokeWidth={1} />,
  },
  {
    title: "AI ADAPTIVE",
    desc: "Intelligent layout shifting based on user behavior.",
    icon: <Cpu size={20} strokeWidth={1} />,
  },
  {
    title: "GLOBAL EDGE",
    desc: "Deploy to 100+ edges with refractive clarity.",
    icon: <Globe size={20} strokeWidth={1} />,
  },
];

const GlassFeatures = () => {
  return (
    <section className="relative py-24 bg-[#FDFDFB] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              className="
                group relative p-8 rounded-[2rem]
                /* GLASS BASE */
                bg-white/[0.01] backdrop-blur-[30px]
                /* PHYSICAL EDGES */
                border-t border-l border-white/60
                border-b border-r border-black/[0.03]
                /* SOFT SHADOW */
                shadow-[0_20px_50px_rgba(0,0,0,0.02)]
                transition-all duration-500
              "
            >
              {/* ACCENT GLOW ON HOVER */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-black/[0.03] border border-black/[0.05] text-black/60 group-hover:text-black transition-colors">
                  {f.icon}
                </div>
                
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-black mb-3">
                  {f.title}
                </h3>
                
                <p className="text-sm font-light leading-relaxed text-black/50 group-hover:text-black/80 transition-colors">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* BACKGROUND DECORATION: FLOATING BLURRED CIRCLE */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 w-64 h-64 bg-black/[0.02] rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
};

export default GlassFeatures;
