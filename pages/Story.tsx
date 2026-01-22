
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface EvidenceSlide {
  text: string;
  image: string;
}

interface CoreValue {
  id: string;
  badge: string;
  title: string;
  description: string;
  evidenceSlides: EvidenceSlide[];
}

interface StoryData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  intro: {
    philosophy: string;
  };
  coreValues: CoreValue[];
  closing: {
    text: string;
    heading: string;
  };
}

const EvidenceSlider: React.FC<{ slides: EvidenceSlide[] }> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative group/slider w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} className="w-full h-full object-cover filter saturate-[1.1] contrast-[1.05]" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-8">
            <p className={`text-white/90 text-sm md:text-base font-medium leading-relaxed transition-all duration-700 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {slide.text}
            </p>
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover/slider:opacity-100 transition-opacity">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const Story: React.FC = () => {
  const [data, setData] = useState<StoryData | null>(null);

  useEffect(() => {
    fetch('/data/story.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Story data load failed:", err));
  }, []);

  const scrollToValues = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('our-promise');
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!data) return (
    <div className="h-screen bg-[#0f1113] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="w-full bg-[#0f1113] text-white selection:bg-white/10">
      {/* 1. HERO SECTION */}
      <section className="relative h-[92vh] flex items-end overflow-hidden pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.hero.backgroundImage} 
            className="w-full h-full object-cover opacity-50 scale-105" 
            alt="Terrace 527" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1113] via-[#0f1113]/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h1 className="text-4xl md:text-6xl font-bold serif tracking-tight mb-8 leading-tight">
              {data.hero.title}
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light tracking-wide mb-12 max-w-xl break-keep">
              {data.hero.subtitle}
            </p>
            <div className="flex gap-4">
              <a 
                href="#our-promise" 
                onClick={scrollToValues}
                className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all group shadow-xl"
              >
                우리가 전하는 진심 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20 animate-bounce">
           <div className="w-px h-12 bg-white" />
        </div>
      </section>

      {/* 2. BRAND PHILOSOPHY */}
      <section id="philosophy" className="py-32 md:py-48 px-6 text-center border-b border-white/5">
        <div className="max-w-3xl mx-auto space-y-12">
          <Sparkles size={28} className="mx-auto text-white/10" />
          <h2 className="text-2xl md:text-4xl font-bold serif text-white/90 tracking-tight leading-relaxed">
            Where Nature Begins
          </h2>
          <div className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[3rem] backdrop-blur-sm shadow-2xl">
            <p className="text-lg md:text-2xl font-light leading-relaxed text-white/70 break-keep whitespace-pre-line serif italic">
              {data.intro.philosophy}
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR PROMISE - Emotional Grid */}
      <section id="our-promise" className="py-32 md:py-56 px-6 bg-gradient-to-b from-[#0f1113] to-black scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <header className="mb-32 space-y-6">
            <span className="text-white/20 font-bold text-[11px] tracking-[0.5em] uppercase block">Our Sincerity</span>
            <h2 className="text-3xl md:text-5xl font-bold serif tracking-tighter leading-tight">
              테라스 527의 약속
            </h2>
          </header>

          <div className="space-y-40 md:space-y-64">
            {data.coreValues.map((value, idx) => (
              <div 
                key={value.id} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-start ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Text Block */}
                <div className={`space-y-12 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-white/10 font-bold text-sm tracking-widest uppercase">0{idx + 1}</span>
                      <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[11px] font-bold text-white/50 tracking-widest">
                        {value.badge}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold serif text-white tracking-tight leading-tight">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-white/40 text-lg md:text-xl leading-relaxed font-light break-keep max-w-md">
                    {value.description}
                  </p>
                  <div className="pt-6">
                    <div className="inline-flex items-center gap-3 text-[11px] font-bold text-white/20 tracking-[0.2em] uppercase">
                       <ImageIcon size={14} /> 우리가 준비한 정성
                    </div>
                  </div>
                </div>

                {/* Evidence Slider (Visual Records) */}
                <div className={`w-full ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <EvidenceSlider slides={value.evidenceSlides} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLOSING - Nature & Protagonist */}
      <section className="py-48 md:py-64 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-20">
            <div className="w-20 h-px bg-white/10 mx-auto" />
            
            <p className="text-2xl md:text-3xl font-light leading-relaxed serif text-white/60 break-keep whitespace-pre-line italic">
              {data.closing.text}
            </p>
            
            <div className="space-y-16">
              <h3 className="text-3xl md:text-5xl font-bold serif tracking-tighter text-white leading-tight whitespace-pre-line">
                {data.closing.heading}
              </h3>
              <div className="pt-12">
                <Link 
                  to="/booking" 
                  className="inline-flex items-center gap-14 bg-white text-black px-16 py-8 rounded-full font-bold text-[13px] tracking-[0.5em] hover:bg-white/90 transition-all shadow-[0_30px_80px_rgba(255,255,255,0.1)] uppercase group"
                >
                  RESERVATION NOW <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-16 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/10 text-[11px] font-bold tracking-[0.4em] uppercase">
            © Terrace 527. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Story;
