import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  getWardrobeItems,
  deleteWardrobeItem,
  analyzeClothing,
} from "../services/wardrobeService";
import LoadingSpinner from "./LoadingSpinner";
import {
  Search,
  Filter,
  Trash2,
  ShirtIcon,
  Tag,
  Palette,
  Sparkles,
  Package,
  X,
  Plus,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import "./WardrobePage.css";

const CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Others",
];

const WardrobePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [analyzeError, setAnalyzeError] = useState("");
  const fileInputRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getWardrobeItems();
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load wardrobe items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      const response = await deleteWardrobeItem(id);
      if (response.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        showToast("Item removed from wardrobe");
        setConfirmDelete(null);
      }
    } catch (err) {
      showToast(err.message || "Failed to remove item");
    }
  };

  /* ── Upload handlers ─────────────────────────────────────── */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAnalyzeError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadPreview(event.target.result);
      setAnalyzeResult(null);
      setAnalyzeError("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!uploadPreview) return;

    setAnalyzing(true);
    setAnalyzeError("");
    setAnalyzeResult(null);

    try {
      // Strip the data URL prefix to get raw base64
      const base64 = uploadPreview.split(",")[1];
      const result = await analyzeClothing(base64, uploadName);

      if (result.success) {
        setAnalyzeResult(result);
        // Add the new item to the local state immediately
        setItems((prev) => [result.data, ...prev]);
        showToast("🎉 Item analyzed and added to wardrobe!");
      } else {
        setAnalyzeError(result.message || "Analysis failed");
      }
    } catch (err) {
      setAnalyzeError(err.message || "Failed to analyze. Is the AI server running?");
    } finally {
      setAnalyzing(false);
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadPreview(null);
    setUploadName("");
    setAnalyzeResult(null);
    setAnalyzeError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Filtered items ─────────────────────────────────────────── */
  const filteredItems = useMemo(() => {
    let result = items;

    if (activeCategory !== "All") {
      result = result.filter(
        (item) =>
          (item.category || "Others").toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(q) ||
          (item.notes || "").toLowerCase().includes(q) ||
          (item.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [items, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts = { All: items.length };
    CATEGORIES.slice(1).forEach((cat) => {
      counts[cat] = items.filter(
        (item) =>
          (item.category || "Others").toLowerCase() === cat.toLowerCase()
      ).length;
    });
    return counts;
  }, [items]);

  if (loading) {
    return <LoadingSpinner message="Loading wardrobe..." fullScreen />;
  }

  return (
    <section className="wardrobe-page">
      <div className="container wardrobe-container">
        {/* ─── Header ───────────────────────────────── */}
        <div className="wardrobe-header fade-in-up">
          <div className="wardrobe-header__top">
            <div className="wardrobe-header__badge">
              <ShirtIcon size={16} />
              <span>My Collection</span>
            </div>
            <h1>
              My <span className="gradient-text">Wardrobe</span>
            </h1>
            <p>Your saved outfits, curated picks, and style collection</p>
          </div>

          {/* ─── Search ─────────────────────────────── */}
          <div className="wardrobe-search">
            <Search size={18} className="wardrobe-search__icon" />
            <input
              type="text"
              placeholder="Search your wardrobe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wardrobe-search__input"
            />
            {searchQuery && (
              <button
                className="wardrobe-search__clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ─── Category Tabs ──────────────────────── */}
          <div className="wardrobe-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`wardrobe-tab ${activeCategory === cat ? "wardrobe-tab--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {categoryCounts[cat] > 0 && (
                  <span className="wardrobe-tab__count">
                    {categoryCounts[cat]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Status Messages ──────────────────────── */}
        {error && <div className="wardrobe-error">{error}</div>}
        {toast && <div className="wardrobe-toast">{toast}</div>}

        {/* ─── Grid ─────────────────────────────────── */}
        {filteredItems.length === 0 ? (
          <div className="wardrobe-empty fade-in-up">
            <div className="wardrobe-empty__icon">
              <Package size={48} />
            </div>
            <h3>
              {items.length === 0
                ? "Your wardrobe is empty"
                : "No items match your filter"}
            </h3>
            <p>
              {items.length === 0
                ? "Upload photos of your clothes to start building your digital closet."
                : "Try adjusting your search or category filter."}
            </p>
            {items.length === 0 && (
              <button
                className="btn-primary"
                style={{ marginTop: "1rem" }}
                onClick={() => setShowUploadModal(true)}
              >
                <Camera size={16} />
                Upload Your First Item
              </button>
            )}
          </div>
        ) : (
          <div className="wardrobe-grid">
            {filteredItems.map((item, index) => (
              <article
                className="wardrobe-card fade-in-up"
                key={item._id}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="wardrobe-card__image-wrap">
                  {item.imageUrl || item.image ? (
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className="wardrobe-card__image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="wardrobe-card__fallback">
                      <ShirtIcon size={40} />
                    </div>
                  )}
                  <div className="wardrobe-card__overlay">
                    {item.source && (
                      <span className="wardrobe-card__source">
                        {item.source === "AI" ? (
                          <>
                            <Sparkles size={12} /> AI Generated
                          </>
                        ) : (
                          item.source
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="wardrobe-card__content">
                  <h3 className="wardrobe-card__name">{item.name}</h3>
                  {item.notes && (
                    <p className="wardrobe-card__notes">{item.notes}</p>
                  )}

                  <div className="wardrobe-card__meta">
                    {item.category && (
                      <span className="wardrobe-card__meta-item">
                        <Tag size={12} />
                        {item.category}
                      </span>
                    )}
                    {item.color && (
                      <span className="wardrobe-card__meta-item">
                        <Palette size={12} />
                        {item.color}
                      </span>
                    )}
                  </div>

                  {item.tags?.length > 0 && (
                    <div className="wardrobe-card__tags">
                      {item.tags.slice(0, 4).map((tag, i) => (
                        <span key={`${item._id}-${i}`} className="wardrobe-card__tag">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 4 && (
                        <span className="wardrobe-card__tag wardrobe-card__tag--more">
                          +{item.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {confirmDelete === item._id ? (
                    <div className="wardrobe-card__confirm">
                      <span>Remove?</span>
                      <button
                        className="wardrobe-card__confirm-yes"
                        onClick={() => handleRemove(item._id)}
                      >
                        Yes
                      </button>
                      <button
                        className="wardrobe-card__confirm-no"
                        onClick={() => setConfirmDelete(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      className="wardrobe-card__delete"
                      onClick={() => setConfirmDelete(item._id)}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ─── Floating Upload Button (FAB) ────────────────── */}
      <button
        className="wardrobe-fab"
        onClick={() => setShowUploadModal(true)}
        aria-label="Upload clothing item"
      >
        <Plus size={24} />
      </button>

      {/* ─── Upload / Analyze Modal ──────────────────────── */}
      {showUploadModal && (
        <div className="wardrobe-upload-overlay" onClick={closeUploadModal}>
          <div className="wardrobe-upload-modal scale-in" onClick={(e) => e.stopPropagation()}>
            <button className="wardrobe-upload-modal__close" onClick={closeUploadModal}>
              <X size={20} />
            </button>

            <div className="wardrobe-upload-modal__header">
              <div className="wardrobe-upload-modal__icon">
                <Camera size={24} />
              </div>
              <h2>Add to <span className="gradient-text">Wardrobe</span></h2>
              <p>Upload a photo of your clothing item. AI will remove the background, detect the color, and categorize it automatically.</p>
            </div>

            {/* File upload area */}
            {!uploadPreview ? (
              <div
                className="wardrobe-upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} />
                <h3>Drop an image here</h3>
                <p>or click to browse</p>
                <span className="wardrobe-upload-dropzone__hint">PNG, JPG up to 10MB</span>
              </div>
            ) : (
              <div className="wardrobe-upload-preview">
                <div className="wardrobe-upload-preview__images">
                  <div className="wardrobe-upload-preview__original">
                    <span className="wardrobe-upload-preview__label">Original</span>
                    <img src={uploadPreview} alt="Preview" />
                  </div>
                  {analyzeResult && (
                    <div className="wardrobe-upload-preview__result">
                      <span className="wardrobe-upload-preview__label">AI Processed</span>
                      <img
                        src={analyzeResult.data?.image || analyzeResult.data?.imageUrl}
                        alt="Processed"
                      />
                    </div>
                  )}
                </div>

                {analyzeResult && (
                  <div className="wardrobe-upload-result">
                    <div className="wardrobe-upload-result__item">
                      <CheckCircle size={16} />
                      <span>Color: <strong>{analyzeResult.aiAnalysis?.color?.name}</strong></span>
                      {analyzeResult.aiAnalysis?.color?.hex && (
                        <span
                          className="wardrobe-upload-result__swatch"
                          style={{ background: analyzeResult.aiAnalysis.color.hex }}
                        />
                      )}
                    </div>
                    <div className="wardrobe-upload-result__item">
                      <CheckCircle size={16} />
                      <span>Category: <strong>{analyzeResult.aiAnalysis?.category}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {/* Name input */}
            {uploadPreview && !analyzeResult && (
              <input
                type="text"
                className="wardrobe-upload-name"
                placeholder="Item name (optional — AI will auto-name)"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
              />
            )}

            {/* Error */}
            {analyzeError && (
              <div className="wardrobe-upload-error">
                <AlertCircle size={16} />
                {analyzeError}
              </div>
            )}

            {/* Actions */}
            <div className="wardrobe-upload-actions">
              {!analyzeResult ? (
                <>
                  {uploadPreview && (
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setUploadPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Change Image
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    onClick={handleAnalyze}
                    disabled={!uploadPreview || analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader size={16} className="spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Analyze & Add
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={closeUploadModal}>
                  <CheckCircle size={16} />
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WardrobePage;
