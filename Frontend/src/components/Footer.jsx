import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Heart, Send, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* ─── Brand ──────────────────────────────── */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src={logo} alt="StyleMate" />
              <span className="footer__logo-text">
                Style<span className="footer__logo-accent">Mate</span>
              </span>
            </Link>
            <p className="footer__tagline">
              Your AI-powered personal stylist. Discover outfits that match your
              personality, body type, and lifestyle — effortlessly.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Pinterest">
                <Heart size={18} />
              </a>
            </div>
          </div>

          {/* ─── Quick Links ────────────────────────── */}
          <div className="footer__column">
            <h4>Explore</h4>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/style-guide">Style Guide</Link></li>
              <li><Link to="/quiz">Style Quiz</Link></li>
              <li><Link to="/recommendations">AI Outfits</Link></li>
              <li><Link to="/wardrobe">My Wardrobe</Link></li>
            </ul>
          </div>

          {/* ─── Resources ──────────────────────────── */}
          <div className="footer__column">
            <h4>Company</h4>
            <ul className="footer__links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#">About StyleMate</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          {/* ─── Newsletter ─────────────────────────── */}
          <div className="footer__column footer__newsletter">
            <h4>Stay in Style</h4>
            <p>Get weekly fashion tips and trend alerts delivered to your inbox.</p>
            <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="footer__newsletter-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer__newsletter-btn">
                {subscribed ? (
                  <>
                    <Sparkles size={14} />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ─── Bottom Bar ──────────────────────────── */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} StyleMate. Crafted with{" "}
            <Heart size={12} style={{ display: "inline", verticalAlign: "middle", color: "var(--color-primary)" }} />{" "}
            for fashion lovers.
          </p>
          <div className="footer__bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
