import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Palette, Wand2, BookOpen } from "lucide-react";
import fasionImage from "../assets/fasion-3.jpg";
import "../components/Hero.css";

const Hero = () => {
  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────── */}
      <section className="hero">
        {/* Ambient glow blobs */}
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />

        <div className="container hero__container">
          <div className="hero__content fade-in-up">
            <div className="hero__badge">
              <Sparkles size={14} />
              <span>AI-Powered Fashion</span>
            </div>

            <h1 className="hero__title">
              Your Personal
              <br />
              <span className="hero__title-accent">Style Assistant</span>
            </h1>

            <p className="hero__description">
              Discover your unique fashion identity with AI-curated outfit
              recommendations tailored to your body type, lifestyle, and personal taste.
            </p>

            <div className="hero__cta-row">
              <Link to="/quiz" className="btn-primary hero__cta">
                <Wand2 size={18} />
                Take Style Quiz
                <ArrowRight size={16} />
              </Link>
              <Link to="/style-guide" className="btn-secondary hero__cta">
                <BookOpen size={18} />
                Style Guide
              </Link>
            </div>

            {/* Stats */}
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">6+</span>
                <span className="hero__stat-label">Style Profiles</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">AI</span>
                <span className="hero__stat-label">Powered Outfits</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">∞</span>
                <span className="hero__stat-label">Combinations</span>
              </div>
            </div>
          </div>

          <div className="hero__visual fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="hero__image-frame">
              <img src={fasionImage} alt="Fashion styles" className="hero__image" />
              <div className="hero__image-border" />
            </div>

            {/* Floating cards */}
            <div className="hero__float-card hero__float-card--1">
              <Palette size={16} />
              <span>Color Match</span>
            </div>
            <div className="hero__float-card hero__float-card--2">
              <Sparkles size={16} />
              <span>AI Styling</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ──────────────────────────────── */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card glass-card">
              <div className="feature-card__icon">📝</div>
              <h3>Style Quiz</h3>
              <p>Answer 5 quick questions and discover your unique fashion personality profile.</p>
              <Link to="/quiz" className="feature-card__link">
                Take Quiz <ArrowRight size={14} />
              </Link>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-card__icon">✨</div>
              <h3>AI Outfits</h3>
              <p>Get AI-generated outfit images tailored to your style, occasion, and budget.</p>
              <Link to="/recommendations" className="feature-card__link">
                Get Outfits <ArrowRight size={14} />
              </Link>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-card__icon">👗</div>
              <h3>Style Guide</h3>
              <p>Browse comprehensive style guides with color palettes, tips, and celebrity inspiration.</p>
              <Link to="/style-guide" className="feature-card__link">
                Explore <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
