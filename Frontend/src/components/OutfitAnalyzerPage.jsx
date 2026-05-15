import React, { useState, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeOutfit } from "../services/outfitAnalyzerService";
import {
  Upload,
  Camera,
  Sparkles,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Image as ImageIcon,
  X,
  Palette,
  Shirt,
  Target,
  TrendingUp,
  Lightbulb,
  Eye,
  Heart,
  Bookmark,
  RotateCcw,
} from "lucide-react";
import "./OutfitAnalyzerPage.css";

/* ── Fashion tips shown while analyzing ───────────────────────── */
const ANALYSIS_TIPS = [
  "✨ Complementary colors create the strongest contrast",
  "👗 Monochromatic outfits always look elegant",
  "🎨 The 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent",
  "👠 Matching metals (gold/silver) ties a look together",
  "🧥 Layering adds dimension and visual interest",
  "💎 Statement accessories can elevate a basic outfit",
];

/* ── Score color helper ───────────────────────────────────────── */
const getScoreColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};

const getScoreLabel = (score) => {
  if (score >= 90) return "Perfect Match!";
  if (score >= 80) return "Great Match";
  if (score >= 65) return "Good Match";
  if (score >= 50) return "Decent";
  if (score >= 35) return "Needs Work";
  return "Mismatch";
};

const getRatingIcon = (rating) => {
  switch (rating) {
    case "Excellent":
      return <CheckCircle size={16} />;
    case "Good":
      return <CheckCircle size={16} />;
    case "Fair":
      return <AlertCircle size={16} />;
    default:
      return <XCircle size={16} />;
  }
};

const getRatingClass = (rating) => {
  switch (rating) {
    case "Excellent":
      return "rating--excellent";
    case "Good":
      return "rating--good";
    case "Fair":
      return "rating--fair";
    default:
      return "rating--poor";
  }
};

const OutfitAnalyzerPage = () => {
  const { user } = useAuth();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const tipTimerRef = useRef(null);

  /* ── File handling ──────────────────────────────────────────── */
  const processFile = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setError("");
    setAnalysis(null);
    setRecommendations([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setRecommendations([]);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Analysis ───────────────────────────────────────────────── */
  const handleAnalyze = async () => {
    if (!uploadedImage) return;

    setAnalyzing(true);
    setError("");
    setAnalysis(null);
    setRecommendations([]);

    // Rotate tips during analysis
    tipTimerRef.current = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ANALYSIS_TIPS.length);
    }, 3000);

    try {
      const result = await analyzeOutfit(uploadedImage, {
        gender: user?.gender,
        bodyType: user?.preferences?.bodyType,
        stylePersonality: user?.preferences?.stylePersonality,
      });

      if (result.success) {
        setAnalysis(result.data.analysis);
        setRecommendations(result.data.recommendations || []);
      } else {
        setError(result.message || "Analysis failed");
      }
    } catch (err) {
      setError(err.message || "Failed to analyze outfit. Please try again.");
    } finally {
      setAnalyzing(false);
      clearInterval(tipTimerRef.current);
    }
  };

  /* ── Score ring SVG ─────────────────────────────────────────── */
  const renderScoreRing = (score) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score);

    return (
      <div className="score-ring">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="score-ring__inner">
          <span className="score-ring__value" style={{ color }}>
            {score}
          </span>
          <span className="score-ring__label">{getScoreLabel(score)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="analyzer-page">
      <div className="container">
        {/* ═══ Header ═══════════════════════════════════════════ */}
        <div className="analyzer-header fade-in-up">
          <div className="analyzer-header__badge">
            <Camera size={16} />
            <span>AI Style Check</span>
          </div>
          <h1>
            Outfit <span className="gradient-text">Analyzer</span>
          </h1>
          <p>
            Upload a photo of your outfit and get instant AI-powered feedback on
            your style, color coordination, and personalized improvement tips.
          </p>
        </div>

        {/* ═══ Upload Area ═════════════════════════════════════ */}
        <div className="analyzer-main fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="analyzer-upload-section">
            {!previewUrl ? (
              <div
                className={`analyzer-dropzone ${dragActive ? "analyzer-dropzone--active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="analyzer-dropzone__icon">
                  <Upload size={40} />
                </div>
                <h3>Upload Your Outfit</h3>
                <p>Drag & drop an image here, or click to browse</p>
                <span className="analyzer-dropzone__hint">
                  JPG, PNG, WEBP • Max 10MB
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                />
              </div>
            ) : (
              <div className="analyzer-preview">
                <button className="analyzer-preview__close" onClick={clearImage}>
                  <X size={18} />
                </button>
                <img
                  src={previewUrl}
                  alt="Your outfit"
                  className="analyzer-preview__image"
                />
                <div className="analyzer-preview__actions">
                  {!analyzing && !analysis && (
                    <button
                      className="btn-primary analyzer-analyze-btn"
                      onClick={handleAnalyze}
                    >
                      <Sparkles size={18} />
                      Analyze My Outfit
                    </button>
                  )}
                  {analysis && (
                    <button
                      className="btn-secondary analyzer-reanalyze-btn"
                      onClick={handleAnalyze}
                    >
                      <RotateCcw size={16} />
                      Re-analyze
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ═══ Analyzing State ════════════════════════════════ */}
          {analyzing && (
            <div className="analyzer-loading">
              <div className="analyzer-loading__spinner">
                <Loader2 size={40} className="spin-icon" />
              </div>
              <h3>Analyzing your outfit...</h3>
              <p className="analyzer-loading__tip">{ANALYSIS_TIPS[tipIndex]}</p>
            </div>
          )}

          {/* ═══ Error ════════════════════════════════════════ */}
          {error && (
            <div className="analyzer-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            ANALYSIS RESULTS
        ═══════════════════════════════════════════════════════ */}
        {analysis && (
          <div className="analyzer-results fade-in-up">
            {/* ─── Score Card ─────────────────────────────── */}
            <div className="result-score-card glass-card">
              {renderScoreRing(analysis.matchScore)}
              <div className="result-score-card__info">
                <p className="result-verdict">{analysis.verdict}</p>
                <div className="result-ratings">
                  <div
                    className={`result-rating ${getRatingClass(analysis.colorHarmony)}`}
                  >
                    <Palette size={16} />
                    <span>Color Harmony</span>
                    <span className="result-rating__value">
                      {getRatingIcon(analysis.colorHarmony)}
                      {analysis.colorHarmony}
                    </span>
                  </div>
                  <div
                    className={`result-rating ${getRatingClass(analysis.styleCoherence)}`}
                  >
                    <Shirt size={16} />
                    <span>Style Coherence</span>
                    <span className="result-rating__value">
                      {getRatingIcon(analysis.styleCoherence)}
                      {analysis.styleCoherence}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Details Grid ───────────────────────────── */}
            <div className="result-details-grid">
              {/* Detected Items */}
              {analysis.detectedItems?.length > 0 && (
                <div className="result-card glass-card">
                  <div className="result-card__header">
                    <Eye size={18} />
                    <h3>Detected Items</h3>
                  </div>
                  <div className="result-card__chips">
                    {analysis.detectedItems.map((item, i) => (
                      <span key={i} className="result-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {analysis.dominantColors?.length > 0 && (
                <div className="result-card glass-card">
                  <div className="result-card__header">
                    <Palette size={18} />
                    <h3>Dominant Colors</h3>
                  </div>
                  <div className="result-card__chips">
                    {analysis.dominantColors.map((color, i) => (
                      <span key={i} className="result-chip result-chip--color">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Occasions */}
              {analysis.occasionSuitability?.length > 0 && (
                <div className="result-card glass-card">
                  <div className="result-card__header">
                    <Target size={18} />
                    <h3>Best For</h3>
                  </div>
                  <div className="result-card__chips">
                    {analysis.occasionSuitability.map((occ, i) => (
                      <span key={i} className="result-chip result-chip--occasion">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Body Type Fit */}
              {analysis.bodyTypeFit && (
                <div className="result-card glass-card">
                  <div className="result-card__header">
                    <Heart size={18} />
                    <h3>Body Type Fit</h3>
                  </div>
                  <p className="result-card__text">{analysis.bodyTypeFit}</p>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div className="result-card glass-card result-card--strengths">
                  <div className="result-card__header">
                    <TrendingUp size={18} />
                    <h3>What Works</h3>
                  </div>
                  <ul className="result-card__list">
                    {analysis.strengths.map((s, i) => (
                      <li key={i}>
                        <CheckCircle size={14} />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements?.length > 0 && (
                <div className="result-card glass-card result-card--improvements">
                  <div className="result-card__header">
                    <AlertCircle size={18} />
                    <h3>Could Improve</h3>
                  </div>
                  <ul className="result-card__list">
                    {analysis.improvements.map((imp, i) => (
                      <li key={i}>
                        <AlertCircle size={14} />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Styling Tips */}
              {analysis.stylingTips?.length > 0 && (
                <div className="result-card glass-card result-card--tips">
                  <div className="result-card__header">
                    <Lightbulb size={18} />
                    <h3>Styling Tips</h3>
                  </div>
                  <ul className="result-card__list">
                    {analysis.stylingTips.map((tip, i) => (
                      <li key={i}>
                        <Sparkles size={14} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ═════════════════════════════════════════════════
                SIMILAR OUTFIT RECOMMENDATIONS
            ═════════════════════════════════════════════════ */}
            {recommendations.length > 0 && (
              <div className="analyzer-recommendations">
                <div className="analyzer-recommendations__header">
                  <h2>
                    Similar <span className="gradient-text">Outfit</span>{" "}
                    Recommendations
                  </h2>
                  <p>Outfits with a similar style that you might love</p>
                </div>

                <div className="analyzer-rec-grid">
                  {recommendations.map((rec, index) => (
                    <article
                      className="analyzer-rec-card"
                      key={index}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="analyzer-rec-card__image-wrap">
                        <img
                          src={rec.image}
                          alt={rec.description}
                          className="analyzer-rec-card__image"
                          loading="lazy"
                        />
                      </div>
                      <div className="analyzer-rec-card__content">
                        <p className="analyzer-rec-card__desc">
                          {rec.description}
                        </p>
                        {rec.tags?.length > 0 && (
                          <div className="analyzer-rec-card__tags">
                            {rec.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="analyzer-rec-card__tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitAnalyzerPage;
