import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWardrobeItems, getWardrobeStats } from "../services/wardrobeService";
import {
  Sparkles,
  ShirtIcon,
  Camera,
  BookOpen,
  Wand2,
  ArrowRight,
  Plus,
  TrendingUp,
  Heart,
  Eye,
  Zap,
  Sun,
  Moon,
  CloudSun,
  Clock,
  ChevronRight,
  BarChart3,
  Layers,
  Star,
} from "lucide-react";
import "./Dashboard.css";

/* ── Time-based greeting ──────────────────────────────────────── */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: <Sun size={24} />, vibe: "Fresh & energetic looks for today" };
  if (hour < 17) return { text: "Good Afternoon", icon: <CloudSun size={24} />, vibe: "Stay stylish through the day" };
  if (hour < 21) return { text: "Good Evening", icon: <Moon size={24} />, vibe: "Elevate your evening style" };
  return { text: "Good Night", icon: <Moon size={24} />, vibe: "Plan tomorrow's perfect outfit" };
};

const QUICK_ACTIONS = [
  {
    icon: <Wand2 size={22} />,
    title: "Style Quiz",
    description: "Discover your style DNA",
    link: "/quiz",
    accent: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e, #ec4899)",
  },
  {
    icon: <Sparkles size={22} />,
    title: "AI Outfits",
    description: "Generate outfit ideas",
    link: "/recommendations",
    accent: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #a855f7)",
  },
  {
    icon: <Camera size={22} />,
    title: "Outfit Check",
    description: "Rate your current look",
    link: "/outfit-analyzer",
    accent: "#a855f7",
    gradient: "linear-gradient(135deg, #a855f7, #6366f1)",
  },
  {
    icon: <Plus size={22} />,
    title: "Add to Closet",
    description: "Upload a clothing item",
    link: "/wardrobe",
    accent: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)",
  },
];

const STYLE_TIPS = [
  "Layer neutrals with one bold accent piece for an effortlessly chic look.",
  "Match your shoes to your belt for a polished, put-together appearance.",
  "Roll your sleeves for an instant casual-cool upgrade.",
  "Invest in a great-fitting blazer — it elevates everything.",
  "Monochromatic outfits make you look taller and more streamlined.",
  "A white sneaker pairs with almost anything in your closet.",
];

const Dashboard = () => {
  const { user } = useAuth();
  const greeting = getGreeting();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [wardrobeStats, setWardrobeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.allSettled([
          getWardrobeItems(),
          getWardrobeStats(),
        ]);
        if (itemsRes.status === "fulfilled" && itemsRes.value.success) {
          setWardrobeItems(itemsRes.value.data || []);
        }
        if (statsRes.status === "fulfilled" && statsRes.value.success) {
          setWardrobeStats(statsRes.value.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Rotate daily tip
  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    setTipIndex(dayOfYear % STYLE_TIPS.length);
  }, []);

  const recentItems = wardrobeItems.slice(0, 6);
  const totalItems = wardrobeStats?.totalItems || wardrobeItems.length;
  const favoriteCount = wardrobeStats?.favoriteItems || 0;

  return (
    <div className="dashboard">
      {/* ─── Hero / Greeting ─────────────────────────────── */}
      <section className="dash-hero">
        <div className="dash-hero__glow dash-hero__glow--1" />
        <div className="dash-hero__glow dash-hero__glow--2" />

        <div className="container">
          <div className="dash-hero__content fade-in-up">
            <div className="dash-hero__greeting-row">
              <div className="dash-hero__icon-wrap">{greeting.icon}</div>
              <div>
                <h1 className="dash-hero__greeting">
                  {greeting.text}, <span className="gradient-text">{firstName}</span>!
                </h1>
                <p className="dash-hero__vibe">{greeting.vibe}</p>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="dash-hero__tip glass-card">
              <div className="dash-hero__tip-icon">
                <Star size={18} />
              </div>
              <div>
                <span className="dash-hero__tip-label">Daily Style Tip</span>
                <p className="dash-hero__tip-text">{STYLE_TIPS[tipIndex]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Actions ───────────────────────────────── */}
      <section className="dash-actions">
        <div className="container">
          <div className="dash-actions__grid">
            {QUICK_ACTIONS.map((action, index) => (
              <Link
                to={action.link}
                className="dash-action-card"
                key={index}
                style={{ "--action-accent": action.accent, "--action-gradient": action.gradient, animationDelay: `${index * 0.1}s` }}
              >
                <div className="dash-action-card__icon">{action.icon}</div>
                <div className="dash-action-card__text">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <ChevronRight size={18} className="dash-action-card__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Overview ──────────────────────────────── */}
      <section className="dash-stats">
        <div className="container">
          <div className="dash-section-header">
            <h2><BarChart3 size={20} /> Your Style Overview</h2>
          </div>
          <div className="dash-stats__grid">
            <div className="dash-stat glass-card">
              <div className="dash-stat__icon" style={{ background: "rgba(244, 63, 94, 0.1)", color: "#f43f5e" }}>
                <ShirtIcon size={22} />
              </div>
              <div className="dash-stat__value">{totalItems}</div>
              <div className="dash-stat__label">Wardrobe Items</div>
            </div>
            <div className="dash-stat glass-card">
              <div className="dash-stat__icon" style={{ background: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }}>
                <Heart size={22} />
              </div>
              <div className="dash-stat__value">{favoriteCount}</div>
              <div className="dash-stat__label">Favorites</div>
            </div>
            <div className="dash-stat glass-card">
              <div className="dash-stat__icon" style={{ background: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>
                <Layers size={22} />
              </div>
              <div className="dash-stat__value">{wardrobeStats?.categoryStats?.length || 0}</div>
              <div className="dash-stat__label">Categories</div>
            </div>
            <div className="dash-stat glass-card">
              <div className="dash-stat__icon" style={{ background: "rgba(20, 184, 166, 0.1)", color: "#14b8a6" }}>
                <TrendingUp size={22} />
              </div>
              <div className="dash-stat__value">{wardrobeStats?.mostWornItems?.length || 0}</div>
              <div className="dash-stat__label">Most Worn</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Recent Wardrobe ─────────────────────────────── */}
      <section className="dash-wardrobe">
        <div className="container">
          <div className="dash-section-header">
            <h2><ShirtIcon size={20} /> Recent Wardrobe</h2>
            <Link to="/wardrobe" className="dash-section-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="dash-wardrobe__loading">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="dash-wardrobe__skeleton skeleton" />
              ))}
            </div>
          ) : recentItems.length > 0 ? (
            <div className="dash-wardrobe__grid">
              {recentItems.map((item, index) => (
                <div className="dash-wardrobe__card fade-in-up" key={item._id} style={{ animationDelay: `${index * 0.08}s` }}>
                  <div className="dash-wardrobe__card-img">
                    {item.imageUrl || item.image ? (
                      <img src={item.imageUrl || item.image} alt={item.name} loading="lazy" />
                    ) : (
                      <div className="dash-wardrobe__card-fallback">
                        <ShirtIcon size={28} />
                      </div>
                    )}
                    {item.source === "AI" && (
                      <span className="dash-wardrobe__card-badge">
                        <Sparkles size={10} /> AI
                      </span>
                    )}
                  </div>
                  <div className="dash-wardrobe__card-info">
                    <h4>{item.name}</h4>
                    <span>{item.category || "Uncategorized"}</span>
                  </div>
                </div>
              ))}

              {/* Add new item card */}
              <Link to="/wardrobe" className="dash-wardrobe__card dash-wardrobe__card--add">
                <div className="dash-wardrobe__card-img dash-wardrobe__card-add-icon">
                  <Plus size={32} />
                </div>
                <div className="dash-wardrobe__card-info">
                  <h4>Add Item</h4>
                  <span>Upload a photo</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="dash-wardrobe__empty glass-card">
              <ShirtIcon size={48} />
              <h3>Your wardrobe is empty</h3>
              <p>Start building your digital closet by uploading photos of your clothes.</p>
              <Link to="/wardrobe" className="btn-primary" style={{ marginTop: "1rem" }}>
                <Plus size={16} /> Add Your First Item
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Explore Section ─────────────────────────────── */}
      <section className="dash-explore">
        <div className="container">
          <div className="dash-section-header">
            <h2><Zap size={20} /> Explore More</h2>
          </div>

          <div className="dash-explore__grid">
            <Link to="/style-guide" className="dash-explore__card glass-card">
              <div className="dash-explore__card-icon" style={{ color: "#14b8a6" }}>
                <BookOpen size={28} />
              </div>
              <h3>Style Guide</h3>
              <p>Browse curated fashion guides with color palettes, tips, and celebrity inspiration.</p>
              <span className="dash-explore__card-link">
                Explore <ArrowRight size={14} />
              </span>
            </Link>

            <Link to="/recommendations" className="dash-explore__card glass-card">
              <div className="dash-explore__card-icon" style={{ color: "#ec4899" }}>
                <Sparkles size={28} />
              </div>
              <h3>AI Recommendations</h3>
              <p>Get personalized outfit suggestions powered by AI, tailored to your style profile.</p>
              <span className="dash-explore__card-link">
                Generate <ArrowRight size={14} />
              </span>
            </Link>

            <Link to="/outfit-analyzer" className="dash-explore__card glass-card">
              <div className="dash-explore__card-icon" style={{ color: "#a855f7" }}>
                <Camera size={28} />
              </div>
              <h3>Outfit Analyzer</h3>
              <p>Upload a photo of your outfit and get AI-powered feedback and improvement tips.</p>
              <span className="dash-explore__card-link">
                Analyze <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
