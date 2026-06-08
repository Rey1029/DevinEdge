import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowUpRight } from 'lucide-react';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 'webgl',
      title: 'Creative WebGL Developer',
      location: 'Geneva / Remote',
      type: 'Full-Time',
      desc: 'We are seeking a rendering engineer to model interactive 3D structures, write custom vertex/fragment shaders in GLSL, and connect them with React architectures.',
      requirements: [
        'Advanced proficiency in Three.js / WebGL pipelines',
        'Deep understanding of matrix math, physics vectors, and shader programming',
        'Strong experience with React, TypeScript, and bundlers',
        'A portfolio showing Awwwards-worthy fluid web designs'
      ]
    },
    {
      id: 'react-arch',
      title: 'Senior Frontend Architect',
      location: 'Geneva HQ',
      type: 'Full-Time',
      desc: 'Looking for a systems architect to scale our React framework configurations, establish reusable UI libraries, and optimize state synchronization.',
      requirements: [
        '5+ years programming scalable React layouts',
        'Proficiency in serverless architectures and micro-frontends',
        'Expertise in GSAP, CSS custom properties, and performance index diagnostics',
        'Passion for pixel-perfect structural integrity'
      ]
    },
    {
      id: 'ui-design',
      title: 'Brand Interaction Designer',
      location: 'Geneva / Remote',
      type: 'Full-Time',
      desc: 'Seeking a digital designer to build high-contrast brutalist frames, craft motion vectors, and define refined color systems.',
      requirements: [
        'Expertise in Figma, Adobe Suite, and 3D modeling tools (Blender/Spline)',
        'Understanding of typography hierarchies and grid systems',
        'Ability to collaborate closely with WebGL and frontend teams',
        'Familiarity with HTML/CSS mechanics'
      ]
    }
  ];

  return (
    <div className="w-full bg-brand-bg-deep pt-32 pb-24 relative overflow-hidden z-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 text-left">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">CAREERS</span>
        <h1 className="font-display font-semibold text-5xl md:text-7xl tracking-tight leading-none text-brand-text-primary mt-4 flex flex-col gap-2">
          <span>JOIN THE</span>
          <span className="text-brand-accent-gold">CREW</span>
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-brand-accent-gold to-transparent mt-6 w-32" />
      </section>

      {/* Agency Culture Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-6">
          <blockquote className="font-syne font-semibold text-2xl md:text-3xl text-brand-text-primary italic leading-tight border-l-4 border-brand-accent-gold pl-6">
            "Brutalist work ethic. High-fidelity output."
          </blockquote>
          <p className="text-sm text-brand-text-secondary mt-6 leading-relaxed">
            We operate as a small, specialized, and highly autonomous squad. We do not do bureaucratic meetings, boilerplate codes, or committee design signoffs. We focus on craft, engineering excellence, and pushing the boundaries of web interactions.
          </p>
        </div>
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-panel border border-brand-border/40 p-6 rounded">
            <h4 className="font-display text-lg text-brand-text-primary tracking-widest uppercase">Remote Friendly</h4>
            <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed">Collaborate from anywhere on earth. We value results over check-in locations.</p>
          </div>
          <div className="glass-panel border border-brand-border/40 p-6 rounded">
            <h4 className="font-display text-lg text-brand-accent-gold tracking-widest uppercase">Gear Budget</h4>
            <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed">We finance your high-end hardware setup: customized monitors, standing desks, and design tablets.</p>
          </div>
        </div>
      </section>

      {/* Positions Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-left">
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-text-primary tracking-widest uppercase mb-12">OPEN POSITIONS</h2>
        
        <div className="flex flex-col gap-6">
          {jobs.map(job => (
            <div 
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group glass-panel border border-brand-border/40 p-6 md:p-8 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-brand-accent-gold/40 hover:glow-gold transition-all duration-300 cursor-pointer interactive"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-brand-bg-deep border border-brand-border/40 rounded flex items-center justify-center text-brand-accent-gold">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl tracking-wider text-brand-text-primary group-hover:text-brand-accent-gold transition-colors duration-300">{job.title}</h3>
                  <div className="flex gap-4 text-xs text-brand-text-secondary mt-1 font-semibold uppercase tracking-wider">
                    <span>{job.location}</span>
                    <span className="text-brand-accent-purple">•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-accent-gold group-hover:text-brand-accent-gold-light transition-colors duration-300">
                <span>View Details</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Job Details Modal Overlay */}
      {selectedJob && (
        <div className="fixed inset-0 bg-brand-bg-deep/80 z-[99999] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="glass-panel border border-brand-accent-gold/20 p-8 md:p-12 rounded glow-gold max-w-2xl w-full relative z-10 flex flex-col gap-6 text-left shadow-2xl animate-[pulse_4s_infinite]">
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-brand-text-primary hover:text-brand-accent-gold font-semibold text-lg interactive transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-brand-accent-purple font-semibold">{selectedJob.type} Role</span>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-text-primary tracking-wide mt-2 uppercase">{selectedJob.title}</h2>
              <span className="text-xs text-brand-accent-gold uppercase tracking-widest font-semibold block mt-1">Location: {selectedJob.location}</span>
            </div>

            <div className="h-[1px] bg-brand-border/40 w-full" />

            <div>
              <h4 className="text-xs uppercase tracking-widest text-brand-text-primary font-bold mb-2">ROLE DESCRIPTION</h4>
              <p className="text-sm text-brand-text-secondary leading-relaxed">{selectedJob.desc}</p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-brand-text-primary font-bold mb-2">EXPECTED QUALIFICATIONS</h4>
              <ul className="list-disc list-inside text-sm text-brand-text-secondary flex flex-col gap-1.5 pl-2">
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex gap-4 justify-end">
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 border border-brand-border text-brand-text-primary hover:border-brand-accent-gold hover:text-brand-accent-gold text-xs uppercase tracking-widest font-semibold transition-colors duration-305 interactive rounded"
              >
                Close
              </button>
              <Link 
                to={`/contact?role=${selectedJob.id}`}
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light text-xs uppercase tracking-widest font-semibold transition-all duration-300 interactive rounded"
              >
                Apply for Position
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
