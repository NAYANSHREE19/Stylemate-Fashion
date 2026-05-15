import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Star,
  Quote,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Wand2,
  BookOpen,
  Palette,
  ShirtIcon,
  Camera,
  Zap,
  Users,
  Heart,
  CheckCircle,
  ArrowUpRight,
  Layers,
  Eye,
} from "lucide-react";
import "./LandingPage.css";

/* ── Scroll reveal hook ───────────────────────────────────────── */
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

/* ── Animated counter hook ────────────────────────────────────── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const numTarget = parseInt(target.replace(/[^0-9]/g, "")) || 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * numTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

/* ── Data ─────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Wand2 size={28} />,
    title: "AI Style Quiz",
    description:
      "Answer quick questions about your lifestyle, body type & taste. Our AI builds your unique style DNA.",
    link: "/quiz",
    linkText: "Take the Quiz",
    accent: "#f43f5e",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Smart Outfit Generator",
    description:
      "Get AI-generated outfit images tailored to your style profile, occasion, season & budget.",
    link: "/recommendations",
    linkText: "Generate Outfits",
    accent: "#ec4899",
  },
  {
    icon: <ShirtIcon size={28} />,
    title: "Digital Wardrobe",
    description:
      "Upload photos of your clothes. AI removes backgrounds, auto-tags categories & colors instantly.",
    link: "/wardrobe",
    linkText: "Build Closet",
    accent: "#a855f7",
  },
  {
    icon: <Camera size={28} />,
    title: "Outfit Analyzer",
    description:
      "Upload a photo of your outfit. AI rates your look and suggests improvements to elevate your style.",
    link: "/outfit-analyzer",
    linkText: "Analyze Look",
    accent: "#6366f1",
  },
  {
    icon: <BookOpen size={28} />,
    title: "Curated Style Guide",
    description:
      "Browse expert-curated style guides with color palettes, key pieces, celebrity references & tips.",
    link: "/style-guide",
    linkText: "Explore Styles",
    accent: "#14b8a6",
  },
  {
    icon: <Layers size={28} />,
    title: "Saved Collections",
    description:
      "Like, save & organize your favorite outfits. Build mood boards for every occasion in your life.",
    link: "/signup",
    linkText: "Get Started",
    accent: "#f59e0b",
  },
];

const SHOWCASE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&q=80",
    label: "Minimalist Chic",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&q=80",
    label: "Romantic Evening",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&q=80",
    label: "Bohemian Vibe",
  },
  {
    src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=480&q=80",
    label: "Streetwear Edge",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Fashion Blogger",
    avatar: "PS",
    text: "StyleMate completely changed how I approach my daily outfits. The AI recommendations are spot-on and save me so much time!",
    rating: 5,
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "Software Engineer",
    avatar: "AM",
    text: "As someone who never knew what to wear, the style quiz gave me clarity. Now I actually get compliments at work!",
    rating: 5,
  },
  {
    id: 3,
    name: "Ananya Gupta",
    role: "College Student",
    avatar: "AG",
    text: "Love the wardrobe feature! I can see all my saved looks in one place and plan outfits for the week ahead.",
    rating: 4,
  },
  {
    id: 4,
    name: "Rohit Kapoor",
    role: "Marketing Manager",
    avatar: "RK",
    text: "The style guide is incredibly detailed — color palettes, do's and don'ts, celebrity references. It's like having a personal stylist!",
    rating: 5,
  },
];

const STATS = [
  { label: "Style Profiles", value: "2500", suffix: "+", icon: <Users size={20} /> },
  { label: "AI Outfits Generated", value: "15000", suffix: "+", icon: <Sparkles size={20} /> },
  { label: "User Satisfaction", value: "97", suffix: "%", icon: <Heart size={20} /> },
  { label: "Styles in Guide", value: "50", suffix: "+", icon: <Eye size={20} /> },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up for free and take our 2-minute AI Style Quiz to discover your unique fashion DNA.",
    icon: <Wand2 size={24} />,
  },
  {
    step: "02",
    title: "Get AI Recommendations",
    description: "Our AI generates personalized outfit images matching your style, body type, occasion & budget.",
    icon: <Sparkles size={24} />,
  },
  {
    step: "03",
    title: "Build Your Wardrobe",
    description: "Upload your clothes, save favorite looks, and build a digital closet you'll love opening daily.",
    icon: <ShirtIcon size={24} />,
  },
];

/* ── Component ────────────────────────────────────────────────── */
const LandingPage = () => {
  const [heroRef, heroVisible] = useReveal();
  const [featRef, featVisible] = useReveal();
  const [howRef, howVisible] = useReveal();
  const [showRef, showVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [testRef, testVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeShowcase, setActiveShowcase] = useState(0);

  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () =>
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % SHOWCASE_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-hero ${heroVisible ? "landing-hero--visible" : ""}`}
        ref={heroRef}
      >
        {/* Ambient glow blobs */}
        <div className="landing-hero__glow landing-hero__glow--1" />
        <div className="landing-hero__glow landing-hero__glow--2" />
        <div className="landing-hero__glow landing-hero__glow--3" />

        {/* Floating particles */}
        <div className="landing-hero__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="landing-hero__particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="container landing-hero__container">
          <div className="landing-hero__content">
            <div className="landing-hero__badge">
              <Sparkles size={14} />
              <span>AI-Powered Personal Styling</span>
            </div>

            <h1 className="landing-hero__title">
              Your Wardrobe,
              <br />
              <span className="landing-hero__title-accent">Reinvented by AI</span>
            </h1>

            <p className="landing-hero__description">
              Discover your unique style DNA. Get AI-curated outfits, build a digital wardrobe,
              and never wonder <em>"what should I wear?"</em> again.
            </p>

            <div className="landing-hero__cta-row">
              <Link to="/signup" className="btn-primary landing-hero__cta landing-hero__cta--primary">
                <Zap size={18} />
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link to="/style-guide" className="btn-secondary landing-hero__cta">
                <BookOpen size={18} />
                Explore Styles
              </Link>
            </div>

            {/* Trust badges */}
            <div className="landing-hero__trust">
              <div className="landing-hero__trust-avatars">
                {["PS", "AM", "AG", "RK"].map((initials, i) => (
                  <div key={i} className="landing-hero__trust-avatar" style={{ animationDelay: `${i * 0.15}s` }}>
                    {initials}
                  </div>
                ))}
              </div>
              <div className="landing-hero__trust-text">
                <div className="landing-hero__trust-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <span>Loved by 2,500+ style enthusiasts</span>
              </div>
            </div>
          </div>

          {/* Visual showcase */}
          <div className="landing-hero__visual">
            <div className="landing-hero__showcase">
              {SHOWCASE_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className={`landing-hero__showcase-card ${
                    i === activeShowcase ? "landing-hero__showcase-card--active" : ""
                  }`}
                  style={{ "--card-index": i, "--active-index": activeShowcase }}
                >
                  <img src={img.src} alt={img.label} loading="lazy" />
                  <div className="landing-hero__showcase-label">{img.label}</div>
                </div>
              ))}
            </div>

            {/* Floating UI cards */}
            <div className="landing-hero__float-card landing-hero__float-card--1">
              <Palette size={16} />
              <span>Color Match</span>
              <CheckCircle size={14} className="landing-hero__float-check" />
            </div>
            <div className="landing-hero__float-card landing-hero__float-card--2">
              <Sparkles size={16} />
              <span>Style Score: 9.2</span>
            </div>
            <div className="landing-hero__float-card landing-hero__float-card--3">
              <Camera size={16} />
              <span>AI Analyzed</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="landing-hero__scroll-indicator">
          <div className="landing-hero__scroll-mouse">
            <div className="landing-hero__scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-features ${featVisible ? "section--visible" : ""}`}
        ref={featRef}
      >
        <div className="container">
          <div className="landing-section-header">
            <span className="landing-section-badge">
              <Zap size={14} />
              Powerful Features
            </span>
            <h2 className="landing-section-title">
              Everything You Need to
              <br />
              <span className="gradient-text">Master Your Style</span>
            </h2>
            <p className="landing-section-subtitle">
              From AI-powered outfit generation to digital wardrobe management — all in one beautiful platform.
            </p>
          </div>

          <div className="landing-features__grid">
            {FEATURES.map((feature, index) => (
              <Link
                to={feature.link}
                className="landing-feature-card"
                key={index}
                style={{ "--feature-accent": feature.accent, animationDelay: `${index * 0.1}s` }}
              >
                <div className="landing-feature-card__icon-wrap">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="landing-feature-card__link">
                  {feature.linkText}
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-how ${howVisible ? "section--visible" : ""}`}
        ref={howRef}
      >
        <div className="container">
          <div className="landing-section-header">
            <span className="landing-section-badge">
              <Sparkles size={14} />
              Simple & Smart
            </span>
            <h2 className="landing-section-title">
              How <span className="gradient-text">StyleMate</span> Works
            </h2>
            <p className="landing-section-subtitle">
              Three easy steps to unlock your perfect style
            </p>
          </div>

          <div className="landing-how__steps">
            {HOW_IT_WORKS.map((item, index) => (
              <React.Fragment key={index}>
                <div className="landing-how__step" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="landing-how__step-number">{item.step}</div>
                  <div className="landing-how__step-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="landing-how__connector">
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STYLE SHOWCASE
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-showcase ${showVisible ? "section--visible" : ""}`}
        ref={showRef}
      >
        <div className="container">
          <div className="landing-section-header">
            <span className="landing-section-badge">
              <TrendingUp size={14} />
              Trending Now
            </span>
            <h2 className="landing-section-title">
              Explore <span className="gradient-text">Trending Styles</span>
            </h2>
            <p className="landing-section-subtitle">
              Discover curated fashion aesthetics loved by thousands
            </p>
          </div>

          <div className="landing-showcase__grid">
            {SHOWCASE_IMAGES.map((img, index) => (
              <Link
                to="/style-guide"
                className="landing-showcase__card"
                key={index}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="landing-showcase__card-img">
                  <img src={img.src} alt={img.label} loading="lazy" />
                  <div className="landing-showcase__card-overlay">
                    <span className="landing-showcase__card-label">{img.label}</span>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="landing-section-cta">
            <Link to="/style-guide" className="btn-secondary">
              View All Styles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-stats ${statsVisible ? "section--visible" : ""}`}
        ref={statsRef}
      >
        <div className="container">
          <div className="landing-stats__grid">
            {STATS.map((stat, i) => (
              <div className="landing-stat-card" key={stat.label} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="landing-stat-card__icon">{stat.icon}</div>
                <span className="landing-stat-card__value">
                  {statsVisible ? <AnimatedNumber value={stat.value} /> : "0"}
                  {stat.suffix}
                </span>
                <span className="landing-stat-card__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-testimonials ${testVisible ? "section--visible" : ""}`}
        ref={testRef}
      >
        <div className="container">
          <div className="landing-section-header">
            <span className="landing-section-badge">
              <Star size={14} />
              Loved by Users
            </span>
            <h2 className="landing-section-title">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
          </div>

          <div className="landing-testimonials__carousel">
            <button
              className="landing-testimonial-nav landing-testimonial-nav--prev"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="landing-testimonial-card glass-card">
              <Quote size={32} className="landing-testimonial-quote-icon" />
              <p className="landing-testimonial-text">
                {TESTIMONIALS[currentTestimonial].text}
              </p>
              <div className="landing-testimonial-stars">
                {Array.from({ length: TESTIMONIALS[currentTestimonial].rating }).map(
                  (_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  )
                )}
              </div>
              <div className="landing-testimonial-author">
                <div className="landing-testimonial-avatar">
                  {TESTIMONIALS[currentTestimonial].avatar}
                </div>
                <div>
                  <p className="landing-testimonial-name">
                    {TESTIMONIALS[currentTestimonial].name}
                  </p>
                  <p className="landing-testimonial-role">
                    {TESTIMONIALS[currentTestimonial].role}
                  </p>
                </div>
              </div>
              <div className="landing-testimonial-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    className={`landing-testimonial-dot ${i === currentTestimonial ? "active" : ""}`}
                    onClick={() => setCurrentTestimonial(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              className="landing-testimonial-nav landing-testimonial-nav--next"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section
        className={`landing-cta ${ctaVisible ? "section--visible" : ""}`}
        ref={ctaRef}
      >
        <div className="container">
          <div className="landing-cta__card">
            <div className="landing-cta__glow landing-cta__glow--1" />
            <div className="landing-cta__glow landing-cta__glow--2" />
            <div className="landing-cta__content">
              <h2>
                Ready to Discover Your{" "}
                <span className="gradient-text">Perfect Style?</span>
              </h2>
              <p>
                Join 2,500+ fashion enthusiasts already using StyleMate.
                Sign up free — no credit card needed.
              </p>
              <div className="landing-cta__buttons">
                <Link to="/signup" className="btn-primary landing-cta__btn">
                  <Zap size={18} />
                  Create Free Account
                  <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-secondary landing-cta__btn">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ── Animated Number Component ────────────────────────────────── */
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const numValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    let startTime = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.floor(eased * numValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [numValue]);

  return <>{display.toLocaleString()}</>;
};

export default LandingPage;
