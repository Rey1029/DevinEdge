import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Minus } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

// Reusable FAQ Accordion Component
function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-brand-border/40 py-5 text-left">
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center text-left font-display text-lg tracking-wide text-brand-text-primary hover:text-brand-accent-gold transition-colors duration-300 py-2 interactive"
      >
        <span>{question}</span>
        <span className="text-brand-accent-gold ml-4">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[300px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-brand-text-secondary leading-relaxed pr-6">{answer}</p>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('one-time'); // 'one-time' or 'retainer'
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Timezone-based country estimation
  const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isIndiaTimezone = detectedTz && (
    detectedTz.includes('Kolkata') || 
    detectedTz.includes('Calcutta') || 
    detectedTz.includes('Delhi') || 
    detectedTz.includes('Mumbai')
  );
  const detectedRegion = isIndiaTimezone ? 'IN' : 'US';

  const [country, setCountry] = useState(() => localStorage.getItem('user-country') || '');
  const [showModal, setShowModal] = useState(() => !localStorage.getItem('user-country'));
  const [selectedTempCountry, setSelectedTempCountry] = useState(detectedRegion);

  const activeCountry = country || detectedRegion;

  const handleCountryChange = (newCountry) => {
    localStorage.setItem('user-country', newCountry);
    setCountry(newCountry);
  };

  const toggleFaq = (index) => {
    setOpenFaqIdx(openFaqIdx === index ? null : index);
  };

  const pricingTiers = [
    {
      name: 'Starter',
      prices: {
        US: { oneTime: '$599', monthly: '$19/mo' },
        IN: { oneTime: '₹10k - ₹15k', monthly: '₹1k - ₹1.5k/mo' }
      },
      desc: 'Perfect for small businesses seeking an elite single-page promo or a basic 5-page editorial site.',
      features: [
        'Custom Design (no templates)',
        'Up to 5 Pages',
        'Basic Scroll Animations',
        'Technical SEO Setup',
        'Fully Responsive Mobile Build',
        '2 Weeks Post-Launch Support'
      ],
      cta: 'Choose Starter',
      highlighted: false
    },
    {
      name: 'Growth',
      prices: {
        US: { oneTime: '$799', monthly: '$39/mo' },
        IN: { oneTime: '₹20k - ₹25k', monthly: '₹2k - ₹2.5k/mo' }
      },
      desc: 'Our flagship tier for established brands needing custom UI elements, full CMS control, and 3D scenes.',
      features: [
        'Custom Web Design & Layouts',
        'Up to 12 Pages',
        'WebGL Globe or Geometry scene',
        'Integrated CMS (Webflow/Sanity)',
        'Complex Scroll animations & Trails',
        '4 Weeks Post-Launch Support',
        'Speed Performance optimization'
      ],
      cta: 'Choose Growth',
      highlighted: true
    },
    {
      name: 'Elite',
      prices: {
        US: { oneTime: '$999', monthly: '$99/mo' },
        IN: { oneTime: '₹50k - ₹60k', monthly: '₹5k - ₹6k/mo' }
      },
      desc: 'For global enterprises requiring custom web products, advanced shaders, and high-security SaaS portals.',
      features: [
        'Full Custom Web Architectures',
        'Unlimited Pages',
        'Advanced Three.js Interactive Scenes',
        'Bespoke Database & Dashboard UI',
        'Custom Soundscapes & Confetti Shaders',
        '3 Months Priority Support',
        'Dedicated Project Architect'
      ],
      cta: 'Contact Architecture',
      highlighted: false
    }
  ];

  const faqs = [
    {
      q: 'What is the main difference between One-Time and Monthly Retainer options?',
      a: 'The One-Time option covers the initial planning, custom design, programming, and handoff of your project. The Monthly Retainer covers continuous development, monthly feature updates, technical security audits, conversion testing, and regular optimization so your site is always updated and fast.'
    },
    {
      q: 'Do you charge extra for hosting or domain configurations?',
      a: 'We configure your domain records, DNS settings, and set up your host servers (Vercel, Netlify, or AWS) for free during delivery. The actual third-party hosting server fees are billed directly to you with zero markups from our agency.'
    },
    {
      q: 'Can we switch our tier or update features mid-project?',
      a: 'Absolutely. We review project directions at the end of the design concept stage. If your scope demands additional pages or interactive 3D assets, we adjust the timeline and tier transparently before starting build stages.'
    },
    {
      q: 'Do you work with pre-existing templates or theme designs?',
      a: 'Never. Every website we build starts as a blank canvas in Figma and is custom programmed in React, WebGL, or Webflow. This ensures your brand is unique, has clean markup, loads instantly, and has zero bloated code dependencies.'
    },
    {
      q: 'How do you handle post-launch revisions?',
      a: 'Every package includes a dedicated post-launch support period (from 2 weeks to 3 months) where we correct bugs, fix typographical changes, and optimize parameters free of charge. After this period, you can contract us hourly or sign up for a Retainer.'
    },
    {
      q: 'How long does a typical redesign project take?',
      a: 'Typically, Landing Page packages take 2 weeks. Core business websites take 4 weeks, E-commerce platforms take 6 weeks, and full custom SaaS/Enterprise builds take 8+ weeks depending on feature specifications.'
    }
  ];

  return (
    <div className="w-full bg-brand-bg-deep pt-32 pb-24 relative overflow-hidden z-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center flex flex-col items-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">PRICING TIERS</span>
        <h1 className="font-display font-semibold text-4xl md:text-6xl tracking-tight text-brand-text-primary mt-4 max-w-4xl uppercase">
          TRANSPARENT PRICING.<br />
          <span className="text-brand-accent-gold">ZERO SURPRISES.</span>
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-brand-accent-gold to-transparent mt-6 w-32" />
      </section>

      {/* Selector Controls (Billing & Region) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 flex flex-col md:flex-row gap-4 items-center justify-center relative z-10">
        {/* Retainer Toggle */}
        <div className="bg-brand-bg-card border border-brand-border/40 p-1 flex rounded">
          <button
            onClick={() => setBillingCycle('one-time')}
            className={`px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-all duration-305 interactive ${
              billingCycle === 'one-time'
                ? 'bg-brand-accent-gold text-brand-bg-deep shadow-md'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            One-Time Project
          </button>
          <button
            onClick={() => setBillingCycle('retainer')}
            className={`px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-all duration-305 interactive ${
              billingCycle === 'retainer'
                ? 'bg-brand-accent-gold text-brand-bg-deep shadow-md'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            Monthly Retainer
          </button>
        </div>

        {/* Region Switcher */}
        <div className="bg-brand-bg-card border border-brand-border/40 p-1 flex rounded">
          <button
            onClick={() => handleCountryChange('US')}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-all duration-305 interactive flex items-center gap-2 ${
              activeCountry === 'US'
                ? 'bg-brand-accent-gold text-brand-bg-deep shadow-md font-bold'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <span className="text-sm">🇺🇸</span> USD ($)
          </button>
          <button
            onClick={() => handleCountryChange('IN')}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-all duration-305 interactive flex items-center gap-2 ${
              activeCountry === 'IN'
                ? 'bg-brand-accent-gold text-brand-bg-deep shadow-md font-bold'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <span className="text-sm">🇮🇳</span> INR (₹)
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, i) => (
            <div 
              key={i}
              className={`glass-panel border rounded p-8 md:p-10 flex flex-col justify-between relative transition-all duration-500 hover:-translate-y-1.5 ${
                tier.highlighted 
                  ? 'border-brand-accent-gold shadow-lg shadow-brand-accent-gold/5 lg:scale-105 glow-gold' 
                  : 'border-brand-border/40 hover:border-brand-accent-gold/40'
              }`}
            >
              {/* Highlight Badge */}
              {tier.highlighted && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-brand-accent-purple text-brand-text-primary text-[9px] tracking-widest uppercase font-semibold py-1 px-4 rounded shadow-md border border-brand-accent-purple/20">
                  Most Popular
                </span>
              )}

              {/* Price Details */}
              <div className="text-left">
                <h3 className={`font-display text-2xl tracking-widest uppercase ${
                  tier.highlighted ? 'text-brand-accent-gold' : 'text-brand-text-primary'
                }`}>{tier.name}</h3>
                
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl md:text-5xl font-semibold text-brand-text-primary transition-all duration-500">
                    {billingCycle === 'one-time' ? tier.prices[activeCountry].oneTime : tier.prices[activeCountry].monthly}
                  </span>
                  <span className="text-[10px] text-brand-text-secondary uppercase tracking-widest font-semibold">
                    {billingCycle === 'one-time' ? 'Project' : ''}
                  </span>
                </div>
                
                <p className="text-sm text-brand-text-secondary mt-6 leading-relaxed min-h-[72px]">
                  {tier.desc}
                </p>

                {/* Features checklist */}
                <div className="h-[1px] bg-brand-border/40 my-6" />
                <ul className="flex flex-col gap-3.5 text-sm text-brand-text-secondary">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <Check size={16} className="text-brand-accent-gold mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Link CTA */}
              <div className="mt-10">
                <Link
                  to={`/contact?package=${tier.name.toLowerCase()}&billing=${billingCycle}`}
                  className={`w-full py-4 text-xs uppercase tracking-widest font-semibold block text-center rounded transition-all duration-300 interactive ${
                    tier.highlighted
                      ? 'bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light'
                      : 'bg-brand-bg-card border border-brand-border text-brand-text-primary hover:border-brand-accent-gold hover:text-brand-accent-gold'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 mb-36 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">COMMON CONCERNS</span>
          <h2 className="font-display font-semibold text-3xl md:text-5xl text-brand-text-primary tracking-widest uppercase mt-2">QUESTIONS & ANSWERS</h2>
        </div>

        <div className="border-t border-brand-border/40">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openFaqIdx === index}
              onClick={() => toggleFaq(index)}
            />
          ))}
        </div>
      </section>

      {/* Custom Scopes CTA */}
      <section className="border-t border-brand-border/40 pt-24 bg-brand-bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h2 className="font-display font-semibold text-3xl md:text-5xl text-brand-text-primary tracking-widest uppercase">
            NEED A BESPOKE CONFIGURATION?
          </h2>
          <p className="text-brand-text-secondary text-base max-w-lg mb-4">
            If you need an enterprise WebGL platform, a custom database structure, or specialized integrations, we will build a custom scope for you.
          </p>
          <MagneticButton>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-brand-accent-gold text-brand-bg-deep text-xs uppercase tracking-widest font-semibold hover:bg-brand-accent-gold-light hover:shadow-lg transition-all duration-300 block rounded animate-pulse"
            >
              Book a Free Call
            </Link>
          </MagneticButton>
        </div>
      </section>

      {/* Country Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-bg-deep/85 z-[99999] flex items-center justify-center p-6 backdrop-blur-md animate-[fade-in_0.5s_forwards]">
          <div className="glass-panel border border-brand-accent-gold/20 p-8 md:p-12 rounded max-w-md w-full text-center flex flex-col items-center gap-6 shadow-2xl glow-gold relative z-10">
            
            <div className="w-16 h-16 rounded-full border border-brand-accent-gold bg-brand-accent-gold/10 flex items-center justify-center text-brand-accent-gold text-2xl mb-2">
              🌐
            </div>
            
            <h2 className="font-display font-semibold text-2xl text-brand-text-primary tracking-widest uppercase">
              SELECT YOUR REGION
            </h2>
            
            <p className="text-brand-text-secondary text-sm leading-relaxed max-w-xs">
              Please choose your country to see tailored project rates and billing cycles.
            </p>

            {/* Country Selection Options */}
            <div className="w-full flex flex-col gap-4 mt-2">
              <button
                type="button"
                onClick={() => setSelectedTempCountry('US')}
                className={`w-full py-4 px-6 rounded border text-left text-sm font-semibold flex items-center justify-between transition-all duration-300 interactive ${
                  selectedTempCountry === 'US'
                    ? 'border-brand-accent-gold bg-brand-accent-gold/5 text-brand-text-primary glow-gold'
                    : 'border-brand-border/40 bg-brand-bg-card/40 text-brand-text-secondary hover:border-brand-accent-gold/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🇺🇸</span>
                  <span>United States / International</span>
                </span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedTempCountry === 'US' ? 'border-brand-accent-gold bg-brand-accent-gold' : 'border-brand-text-secondary/30'
                }`}>
                  {selectedTempCountry === 'US' && <span className="w-1.5 h-1.5 rounded-full bg-brand-bg-deep" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTempCountry('IN')}
                className={`w-full py-4 px-6 rounded border text-left text-sm font-semibold flex items-center justify-between transition-all duration-300 interactive ${
                  selectedTempCountry === 'IN'
                    ? 'border-brand-accent-gold bg-brand-accent-gold/5 text-brand-text-primary glow-gold'
                    : 'border-brand-border/40 bg-brand-bg-card/40 text-brand-text-secondary hover:border-brand-accent-gold/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🇮🇳</span>
                  <span>India</span>
                </span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedTempCountry === 'IN' ? 'border-brand-accent-gold bg-brand-accent-gold' : 'border-brand-text-secondary/30'
                }`}>
                  {selectedTempCountry === 'IN' && <span className="w-1.5 h-1.5 rounded-full bg-brand-bg-deep" />}
                </span>
              </button>
            </div>

            <div className="h-[1px] bg-brand-border/40 w-full my-2" />

            <button
              onClick={() => {
                localStorage.setItem('user-country', selectedTempCountry);
                setCountry(selectedTempCountry);
                setShowModal(false);
              }}
              className="w-full py-4 bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light text-xs uppercase tracking-widest font-semibold transition-all duration-300 interactive rounded shadow-md font-bold"
            >
              Confirm Region
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
