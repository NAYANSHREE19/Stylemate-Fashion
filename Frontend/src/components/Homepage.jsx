import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import {
  ClipboardList,
  Sparkles,
  ShirtIcon,
  ArrowRight,
  Star,
  Quote,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../components/HomePage.css";

/* ── Trending styles data (static showcase) ───────────────────── */
const TRENDING_STYLES = [
  {
    id: 1,
    title: "Minimalist Chic",
    vibe: "Effortless elegance",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&q=80",
    tags: ["Neutral", "Timeless", "Clean"],
    category: "Casual",
  },
  {
    id: 2,
    title: "Streetwear Edge",
    vibe: "Urban cool energy",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=480&q=80",
    tags: ["Bold", "Graphic", "Trendy"],
    category: "Streetwear",
  },
  {
    id: 3,
    title: "Power Business",
    vibe: "Command the room",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80",
    tags: ["Professional", "Sharp", "Confident"],
    category: "Formal",
  },
  {
    id: 4,
    title: "Bohemian Wanderer",
    vibe: "Free-spirited charm",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&q=80",
    tags: ["Earthy", "Flowing", "Artistic"],
    category: "Boho",
  },
  {
    id: 5,
    title: "Romantic Evening",
    vibe: "Soft femininity",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&q=80",
    tags: ["Elegant", "Soft", "Dreamy"],
    category: "Evening",
  },
  {
    id: 6,
    title: "Athleisure Active",
    vibe: "Sporty meets chic",
    image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=480&q=80",
    tags: ["Sporty", "Comfy", "Modern"],
    category: "Active",
  },
];

/* ── Testimonials ─────────────────────────────────────────────── */
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

/* ── Stats data ───────────────────────────────────────────────── */
const STATS = [
  { label: "Style Profiles Created", value: "2,500+", icon: "👤" },
  { label: "AI Outfits Generated", value: "15,000+", icon: "✨" },
  { label: "User Satisfaction", value: "97%", icon: "❤️" },
  { label: "Styles in Guide", value: "50+", icon: "👗" },
];

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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Homepage = () => {
  const [howRef, howVisible] = useReveal();
  const [trendRef, trendVisible] = useReveal();
  const [testRef, testVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () =>
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="homepage">
      <Hero />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section
        className={`how-it-works ${howVisible ? "section--visible" : ""}`}
        ref={howRef}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Sparkles size={14} />
              Simple & Smart
            </span>
            <h2 className="section-title">
              How <span className="gradient-text">StyleMate</span> Works
            </h2>
            <p className="section-subtitle">
              Three easy steps to unlock your perfect style
            </p>
          </div>

          <div className="how-steps">
            <div className="how-step" style={{ animationDelay: "0.1s" }}>
              <div className="how-step__number">1</div>
              <div className="how-step__icon-wrap">
                <ClipboardList size={32} />
              </div>
              <h3>Take the Style Quiz</h3>
              <p>
                Answer quick questions about your lifestyle, body type, budget,
                and fashion preferences.
              </p>
            </div>

            <div className="how-step__connector">
              <ArrowRight size={24} />
            </div>

            <div className="how-step" style={{ animationDelay: "0.3s" }}>
              <div className="how-step__number">2</div>
              <div className="how-step__icon-wrap">
                <Sparkles size={32} />
              </div>
              <h3>Get AI Recommendations</h3>
              <p>
                Our AI analyzes your profile and generates personalized outfit
                suggestions just for you.
              </p>
            </div>

            <div className="how-step__connector">
              <ArrowRight size={24} />
            </div>

            <div className="how-step" style={{ animationDelay: "0.5s" }}>
              <div className="how-step__number">3</div>
              <div className="how-step__icon-wrap">
                <ShirtIcon size={32} />
              </div>
              <h3>Build Your Wardrobe</h3>
              <p>
                Save your favorite looks, explore the style guide, and curate
                your dream wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRENDING STYLES
      ═══════════════════════════════════════════════════════════ */}
      <section
        className={`trending-section ${trendVisible ? "section--visible" : ""}`}
        ref={trendRef}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <TrendingUp size={14} />
              What's Hot
            </span>
            <h2 className="section-title">
              Trending <span className="gradient-text">Styles</span>
            </h2>
            <p className="section-subtitle">
              Explore the most popular fashion aesthetics loved by our community
            </p>
          </div>

          <div className="trending-grid">
            {TRENDING_STYLES.map((style, index) => (
              <Link
                to="/style-guide"
                className="trending-card"
                key={style.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="trending-card__image-wrap">
                  <img
                    src={style.image}
                    alt={style.title}
                    className="trending-card__image"
                    loading="lazy"
                  />
                  <div className="trending-card__overlay">
                    <span className="trending-card__category">{style.category}</span>
                  </div>
                </div>
                <div className="trending-card__content">
                  <h3>{style.title}</h3>
                  <p className="trending-card__vibe">{style.vibe}</p>
                  <div className="trending-card__tags">
                    {style.tags.map((tag) => (
                      <span key={tag} className="trending-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/style-guide" className="btn-secondary">
              View All Styles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section
        className={`stats-section ${statsVisible ? "section--visible" : ""}`}
        ref={statsRef}
      >
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div className="stat-card" key={stat.label} style={{ animationDelay: `${i * 0.12}s` }}>
                <span className="stat-card__icon">{stat.icon}</span>
                <span className="stat-card__value">{stat.value}</span>
                <span className="stat-card__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section
        className={`testimonials-section ${testVisible ? "section--visible" : ""}`}
        ref={testRef}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Star size={14} />
              Loved by Users
            </span>
            <h2 className="section-title">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
          </div>

          <div className="testimonials-carousel">
            <button
              className="testimonial-nav testimonial-nav--prev"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="testimonial-card glass-card">
              <Quote size={32} className="testimonial-quote-icon" />
              <p className="testimonial-text">
                {TESTIMONIALS[currentTestimonial].text}
              </p>
              <div className="testimonial-stars">
                {Array.from({ length: TESTIMONIALS[currentTestimonial].rating }).map(
                  (_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  )
                )}
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {TESTIMONIALS[currentTestimonial].avatar}
                </div>
                <div>
                  <p className="testimonial-name">
                    {TESTIMONIALS[currentTestimonial].name}
                  </p>
                  <p className="testimonial-role">
                    {TESTIMONIALS[currentTestimonial].role}
                  </p>
                </div>
              </div>
              <div className="testimonial-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    className={`testimonial-dot ${i === currentTestimonial ? "active" : ""}`}
                    onClick={() => setCurrentTestimonial(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              className="testimonial-nav testimonial-nav--next"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section
        className={`cta-section ${ctaVisible ? "section--visible" : ""}`}
        ref={ctaRef}
      >
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow cta-glow--1" />
            <div className="cta-glow cta-glow--2" />
            <div className="cta-content">
              <h2>
                Ready to Discover Your{" "}
                <span className="gradient-text">Perfect Style?</span>
              </h2>
              <p>
                Take our free style quiz and get AI-powered outfit recommendations
                tailored just for you. No credit card needed.
              </p>
              <div className="cta-buttons">
                <Link to="/quiz" className="btn-primary cta-btn">
                  <Sparkles size={18} />
                  Start Style Quiz
                  <ArrowRight size={16} />
                </Link>
                <Link to="/style-guide" className="btn-secondary cta-btn">
                  Browse Styles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
