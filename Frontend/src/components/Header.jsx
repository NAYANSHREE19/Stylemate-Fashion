import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";
import "../components/Header.css";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          <img src={logo} alt="StyleMate Logo" />
          <span className="header__logo-text">
            Style<span className="header__logo-accent">Mate</span>
          </span>
        </Link>

        <button
          className="header__hamburger"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`header__nav ${mobileOpen ? "header__nav--open" : ""}`}>
          <Link to="/" className={`header__link ${isActive("/") ? "header__link--active" : ""}`}>
            Home
          </Link>
          <Link to="/style-guide" className={`header__link ${isActive("/style-guide") ? "header__link--active" : ""}`}>
            Style Guide
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/quiz" className={`header__link ${isActive("/quiz") ? "header__link--active" : ""}`}>
                Quiz
              </Link>
              <Link to="/recommendations" className={`header__link header__link--glow ${isActive("/recommendations") ? "header__link--active" : ""}`}>
                <Sparkles size={14} />
                AI Outfits
              </Link>
              <Link to="/wardrobe" className={`header__link ${isActive("/wardrobe") ? "header__link--active" : ""}`}>
                Wardrobe
              </Link>
              <Link to="/profile" className={`header__link ${isActive("/profile") ? "header__link--active" : ""}`}>
                Profile
              </Link>
            </>
          )}

          <Link to="/contact" className={`header__link ${isActive("/contact") ? "header__link--active" : ""}`}>
            Contact
          </Link>

          {isAuthenticated ? (
            <div className="header__user">
              <span className="header__user-name">Hi, {user?.name?.split(" ")[0]}</span>
              <button onClick={handleLogout} className="header__logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="header__auth">
              <Link to="/login" className="header__link header__link--login">
                Login
              </Link>
              <Link to="/signup" className="header__signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
