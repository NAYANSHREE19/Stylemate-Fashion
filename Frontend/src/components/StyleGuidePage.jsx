import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  Bookmark,
  Share2,
  Filter,
  Search,
  X,
  ChevronDown,
  TrendingUp,
  Clock,
  ThumbsUp,
  Eye,
  MessageCircle,
  Palette,
  Lightbulb,
  Users,
  ShoppingBag,
  Calendar,
  Target,
  Shirt
} from "lucide-react";
import {
  getStyles,
  likeStyle,
  saveStyle,
  incrementView,
  getFilterOptions
} from "../services/styleGuideService";
import { fashionStylesData } from "../data/fashionStylesData";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import ErrorPage from "./ErrorPage";
import "../components/StyleGuidePage.css";

const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%231a1a2e'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23a78bfa' text-anchor='middle' dy='.3em'%3EStyle Image%3C/text%3E%3C/svg%3E`;

const getStyleId = (style) => style?._id || style?.id;

const getStyleImage = (style) => {
  if (!style) return FALLBACK_IMAGE;

  if (style.imageUrl) return style.imageUrl;
  if (style.mainImage) return style.mainImage;
  if (style.image) return style.image;
  if (Array.isArray(style.images) && style.images.length > 0) {
    return style.images[0].url || FALLBACK_IMAGE;
  }
  if (Array.isArray(style.imageGallery) && style.imageGallery.length > 0) {
    return style.imageGallery[0];
  }

  return FALLBACK_IMAGE;
};

const normalizeDemoStyle = (item) => ({
  ...item,
  vibe: item.vibe || item.stylePersonality,
  season: item.seasons?.[0] || "All Season",
  occasion: item.occasions?.[0] || "Casual",
  suitableBodyTypes: item.bodyTypes || ["All"],
  imageUrl: item.imageUrl || item.mainImage || item.imageGallery?.[0] || FALLBACK_IMAGE,
  ratingCount: item.ratingCount || 0,
  comments: item.comments || [],
  keyPieces: (item.keyPieces || []).map((piece) => ({
    ...piece,
    priority: typeof piece.priority === "string" ? piece.priority.toLowerCase() : piece.priority,
  })),
});

const normalizePriceRange = (priceRange = "") => {
  const value = String(priceRange).toLowerCase();
  if (value.includes("budget")) return "Budget";
  if (value.includes("mid") || value.includes("moderate")) return "Moderate";
  if (value.includes("premium")) return "Premium";
  if (value.includes("luxury")) return "Luxury";
  return priceRange;
};

const containsAny = (text, words) => words.some((word) => text.includes(word));

const isGenderAllowedStyle = (item, userGender) => {
  if (!userGender) return true;

  if (item.targetGender) {
    if (item.targetGender === 'unisex') return true;
    return item.targetGender === userGender;
  }

  const text = [
    item.title,
    item.description,
    item.vibe,
    ...(item.tags || [])
  ]
    .join(' ')
    .toLowerCase();

  const femaleKeywords = ['dress', 'heels', 'skirt', 'blouse', 'ethnic', 'lehenga', 'saree'];
  const maleKeywords = ['menswear', 'men', 'male', 'shirt', 't-shirt', 'trouser', 'loafers', 'blazer'];

  if (userGender === 'male') {
    if (containsAny(text, femaleKeywords) && !containsAny(text, maleKeywords)) return false;
    return true;
  }

  if (containsAny(text, maleKeywords) && !containsAny(text, femaleKeywords)) return false;
  return true;
};

const getFilteredDemoStyles = (filters) => {
  const {
    category,
    season,
    occasion,
    priceRange,
    bodyType,
    stylePersonality,
    search,
    sort,
    page,
    limit,
    userGender,
  } = filters;

  const searchLower = (search || "").toLowerCase();

  let items = fashionStylesData
    .map(normalizeDemoStyle)
    .filter((item) => {
      // Strict gender filtering for demo fallback items.
      if (!isGenderAllowedStyle(item, userGender)) return false;

      if (category && item.category !== category) return false;

      if (season) {
        const seasons = item.seasons || [];
        const seasonMatch =
          seasons.includes(season) ||
          seasons.includes("All-Season") ||
          item.season === "All Season";
        if (!seasonMatch) return false;
      }

      if (occasion) {
        const occasions = item.occasions || [];
        if (!occasions.includes(occasion) && item.occasion !== occasion) return false;
      }

      if (priceRange) {
        const normalizedItemPrice = normalizePriceRange(item.priceRange);
        if (normalizedItemPrice !== priceRange) return false;
      }

      if (bodyType) {
        const bodyTypes = item.bodyTypes || item.suitableBodyTypes || [];
        if (!bodyTypes.includes("All") && !bodyTypes.includes(bodyType)) return false;
      }

      if (stylePersonality) {
        const personalityRaw = item.stylePersonality;
        const personalities = Array.isArray(personalityRaw)
          ? personalityRaw
          : String(personalityRaw || "")
              .split(/[,&]/)
              .map((v) => v.trim())
              .filter(Boolean);

        const hasPersonality = personalities.some((p) =>
          p.toLowerCase().includes(stylePersonality.toLowerCase())
        );
        if (!hasPersonality) return false;
      }

      if (searchLower) {
        const haystack = [
          item.title,
          item.description,
          item.vibe,
          ...(item.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }

      return true;
    });

  switch (sort) {
    case "popular":
      items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
    case "trending":
      items.sort((a, b) => Number(b.trending) - Number(a.trending) || (b.likes || 0) - (a.likes || 0));
      break;
    case "recent":
      items.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    case "rating":
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "alphabetical":
      items.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 12;
  const start = (currentPage - 1) * currentLimit;
  const pagedItems = items.slice(start, start + currentLimit);

  return {
    data: pagedItems,
    pages: Math.max(1, Math.ceil(items.length / currentLimit)),
  };
};

const StyleGuide = () => {
  const { user } = useAuth();
  const userGender = user?.gender || '';

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedBodyType, setSelectedBodyType] = useState("all");
  const [selectedPersonality, setSelectedPersonality] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  // Data states
  const [styleItems, setStyleItems] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savedStyles, setSavedStyles] = useState([]);
  const [likedStyles, setLikedStyles] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: "all", name: "All Styles", icon: Shirt },
    { id: "Casual", name: "Casual", icon: Shirt },
    { id: "Formal", name: "Formal", icon: Shirt },
    { id: "Business", name: "Business", icon: Shirt },
    { id: "Evening", name: "Evening", icon: Shirt },
    { id: "Sports", name: "Sports", icon: Shirt },
    { id: "Party", name: "Party", icon: Shirt },
  ];

  const sortOptions = [
    { id: "popular", name: "Most Popular", icon: ThumbsUp },
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "recent", name: "Recently Added", icon: Clock },
    { id: "rating", name: "Top Rated", icon: Star },
    { id: "alphabetical", name: "A-Z", icon: Filter },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch styles from backend
  useEffect(() => {
    fetchStyles();
  }, [
    selectedCategory,
    selectedSeason,
    selectedOccasion,
    selectedPriceRange,
    selectedBodyType,
    selectedPersonality,
    debouncedSearch,
    sortBy,
    page,
    userGender
  ]);

  // Filter options are relatively static; avoid re-fetching on every filter interaction.
  useEffect(() => {
    fetchFilterOptions();
  }, [userGender]);

  const fetchStyles = async () => {
    setLoading(true);
    setError("");

    try {
      const filters = {
        category: selectedCategory !== "all" ? selectedCategory : null,
        season: selectedSeason !== "all" ? selectedSeason : null,
        occasion: selectedOccasion !== "all" ? selectedOccasion : null,
        priceRange: selectedPriceRange !== "all" ? selectedPriceRange : null,
        bodyType: selectedBodyType !== "all" ? selectedBodyType : null,
        stylePersonality:
          selectedPersonality !== "all" ? selectedPersonality : null,
        search: debouncedSearch || null,
        sort: sortBy,
        page,
        limit: 12,
      };

      // Remove null values
      Object.keys(filters).forEach(
        (key) => filters[key] === null && delete filters[key]
      );

      const response = await getStyles(filters);

      if (response.success) {
        const stylesFromApi = response.data || [];

        if (stylesFromApi.length > 0) {
          setStyleItems(stylesFromApi);
          setTotalPages(response.pages || 1);
          setIsUsingDemoData(false);
        } else {
          const demoResponse = getFilteredDemoStyles({ ...filters, userGender });
          setStyleItems(demoResponse.data);
          setTotalPages(demoResponse.pages);
          setIsUsingDemoData(true);
        }
      }
    } catch (err) {
      console.warn("API Error, falling back to demo data.", err);
      const demoResponse = getFilteredDemoStyles({ ...filters, userGender });
      setStyleItems(demoResponse.data);
      setTotalPages(demoResponse.pages);
      setIsUsingDemoData(true);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
    }
  };

  const handleLike = async (styleId, e) => {
    e.stopPropagation();

    if (!styleId) return;

    if (isUsingDemoData) {
      setStyleItems((prev) =>
        prev.map((item) =>
          getStyleId(item) === styleId
            ? { ...item, likes: (item.likes || 0) + 1 }
            : item
        )
      );
      setLikedStyles((prev) => (prev.includes(styleId) ? prev : [...prev, styleId]));
      return;
    }

    try {
      const response = await likeStyle(styleId);
      if (response.success) {
        // Update local state
        setStyleItems((prev) =>
          prev.map((item) =>
            getStyleId(item) === styleId
              ? { ...item, likes: response.data.likes }
              : item
          )
        );
        setLikedStyles((prev) => (prev.includes(styleId) ? prev : [...prev, styleId]));
      }
    } catch (err) {
      console.error("Failed to like style:", err);
    }
  };

  const handleSave = async (styleId, e) => {
    e.stopPropagation();

    if (!styleId) return;

    if (isUsingDemoData) {
      setStyleItems((prev) =>
        prev.map((item) =>
          getStyleId(item) === styleId
            ? { ...item, saves: (item.saves || 0) + 1 }
            : item
        )
      );
      setSavedStyles((prev) => (prev.includes(styleId) ? prev : [...prev, styleId]));
      return;
    }

    try {
      const response = await saveStyle(styleId);
      if (response.success) {
        // Update local state
        setStyleItems((prev) =>
          prev.map((item) =>
            getStyleId(item) === styleId
              ? { ...item, saves: response.data.saves }
              : item
          )
        );
        setSavedStyles((prev) => (prev.includes(styleId) ? prev : [...prev, styleId]));
      }
    } catch (err) {
      console.error("Failed to save style:", err);
    }
  };

  const handleShare = (item, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleStyleClick = async (style) => {
    setSelectedStyle(style);
    setShowModal(true);

    const styleId = getStyleId(style);

    if (!styleId) return;

    if (isUsingDemoData) {
      setStyleItems((prev) =>
        prev.map((item) =>
          getStyleId(item) === styleId
            ? { ...item, views: (item.views || 0) + 1 }
            : item
        )
      );
      return;
    }

    // Increment view count
    try {
      await incrementView(styleId);
    } catch (err) {
      console.error("Failed to increment view:", err);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSeason("all");
    setSelectedOccasion("all");
    setSelectedPriceRange("all");
    setSelectedBodyType("all");
    setSelectedPersonality("all");
    setSearchTerm("");
    setSortBy("popular");
    setPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedSeason !== "all") count++;
    if (selectedOccasion !== "all") count++;
    if (selectedPriceRange !== "all") count++;
    if (selectedBodyType !== "all") count++;
    if (selectedPersonality !== "all") count++;
    if (searchTerm) count++;
    return count;
  };

  if (loading && styleItems.length === 0) {
    return <LoadingSpinner message="Loading style guide..." fullScreen />;
  }

  if (error && styleItems.length === 0) {
    return (
      <ErrorPage
        errorCode=""
        title="Oops! Something went wrong"
        message={error}
        showBackButton={true}
      />
    );
  }

  return (
    <section className="style-guide">
      <div className="container">
        {/* Header */}
        <div className="style-guide-header">
          <div className="header-content">
            <h1>Style Guide</h1>
            <p className="header-description">
              Discover curated fashion styles and find inspiration for your
              personal wardrobe. Each style is carefully crafted to help you
              express your unique personality.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search styles, tags, or vibes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            {/* Sort Dropdown */}
            <div className="sort-dropdown">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="icon" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="filter-badge">{getActiveFiltersCount()}</span>
              )}
            </button>

            {/* Reset Button */}
            {getActiveFiltersCount() > 0 && (
              <button className="reset-filter-btn" onClick={resetFilters}>
                <X className="icon" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-tab ${
                selectedCategory === category.id ? "active" : ""
              }`}
            >
              <category.icon className="tab-icon" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filter-grid">
              {/* Season Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Calendar className="label-icon" />
                  Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Seasons</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              {/* Occasion Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Target className="label-icon" />
                  Occasion
                </label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Occasions</option>
                  <option value="Work">Work</option>
                  <option value="Date">Date</option>
                  <option value="Party">Party</option>
                  <option value="Casual">Casual</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Gym">Gym</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <ShoppingBag className="label-icon" />
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Ranges</option>
                  <option value="Budget">Budget</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Body Type Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Users className="label-icon" />
                  Body Type
                </label>
                <select
                  value={selectedBodyType}
                  onChange={(e) => setSelectedBodyType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="Hourglass">Hourglass</option>
                  <option value="Pear">Pear</option>
                  <option value="Apple">Apple</option>
                  <option value="Rectangle">Rectangle</option>
                  <option value="Inverted Triangle">Inverted Triangle</option>
                </select>
              </div>

              {/* Style Personality Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Palette className="label-icon" />
                  Style Vibe
                </label>
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Vibes</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Bohemian">Bohemian</option>
                  <option value="Classic">Classic</option>
                  <option value="Edgy">Edgy</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Preppy">Preppy</option>
                  <option value="Streetwear">Streetwear</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Athleisure">Athleisure</option>
                  <option value="Glamorous">Glamorous</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Style Grid */}
        {isUsingDemoData && (
          <div className="demo-data-notice">
            Showing demo style data so new users can explore looks, filters, and recommendations visually.
          </div>
        )}

        <div className="styles-grid">
          {styleItems.length > 0 ? (
            styleItems.map((item) => (
              <div
                key={item._id || item.id}
                className="style-card"
                onClick={() => handleStyleClick(item)}
              >
                <div className="style-image">
                  <img
                    src={getStyleImage(item)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="style-overlay">
                    <div className="overlay-actions">
                      <button
                        className={`action-btn ${
                          likedStyles.includes(getStyleId(item)) ? "liked" : ""
                        }`}
                        onClick={(e) => handleLike(getStyleId(item), e)}
                        title="Add to favorites"
                      >
                        <Heart className="icon" />
                      </button>
                      <button
                        className={`action-btn ${
                          savedStyles.includes(getStyleId(item)) ? "saved" : ""
                        }`}
                        onClick={(e) => handleSave(getStyleId(item), e)}
                        title="Save to collection"
                      >
                        <Bookmark className="icon" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => handleShare(item, e)}
                        title="Share style"
                      >
                        <Share2 className="icon" />
                      </button>
                    </div>
                  </div>

                  {/* Trending Badge */}
                  {item.trending && (
                    <div className="trending-badge">
                      <TrendingUp className="badge-icon" />
                      Trending
                    </div>
                  )}

                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="featured-badge">
                      <Star className="badge-icon" />
                      Featured
                    </div>
                  )}
                </div>

                <div className="style-content">
                  <div className="style-header">
                    <h3 className="style-title">{item.title}</h3>
                    {item.rating > 0 && (
                      <div className="style-rating">
                        <Star className="star-icon filled" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {item.vibe && <p className="style-vibe">{item.vibe}</p>}

                  <p className="style-description">{item.description}</p>

                  <div className="style-tags">
                    {item.tags &&
                      item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
                      ))}
                    {item.tags && item.tags.length > 3 && (
                      <span className="tag">+{item.tags.length - 3}</span>
                    )}
                  </div>

                  <div className="style-footer">
                    <div className="style-stats">
                      <div className="stat">
                        <Heart className="stat-icon" />
                        <span>{item.likes || 0}</span>
                      </div>
                      <div className="stat">
                        <Bookmark className="stat-icon" />
                        <span>{item.saves || 0}</span>
                      </div>
                      <div className="stat">
                        <Eye className="stat-icon" />
                        <span>{item.views || 0}</span>
                      </div>
                    </div>
                    <button className="try-style-btn">View Details</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <Search size={64} />
              </div>
              <h3>No styles found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={resetFilters} className="reset-filters-btn">
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <div className="pagination-info">
              Page {page} of {totalPages}
            </div>
            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {showModal && selectedStyle && (
        <StyleDetailModal
          style={selectedStyle}
          onClose={() => {
            setShowModal(false);
            setSelectedStyle(null);
          }}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          isLiked={likedStyles.includes(getStyleId(selectedStyle))}
          isSaved={savedStyles.includes(getStyleId(selectedStyle))}
        />
      )}
    </section>
  );
};

// Detailed Style Modal Component
const StyleDetailModal = ({
  style,
  onClose,
  onLike,
  onSave,
  onShare,
  isLiked,
  isSaved,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>

        <div className="modal-body">
          {/* Left Side - Image */}
          <div className="modal-image-section">
            <img
              src={getStyleImage(style)}
              alt={style.title}
              className="modal-main-image"
            />

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                className={`modal-action-btn ${isLiked ? "liked" : ""}`}
                onClick={(e) => onLike(getStyleId(style), e)}
              >
                <Heart className="icon" />
                <span>{style.likes || 0} Likes</span>
              </button>
              <button
                className={`modal-action-btn ${isSaved ? "saved" : ""}`}
                onClick={(e) => onSave(getStyleId(style), e)}
              >
                <Bookmark className="icon" />
                <span>Save</span>
              </button>
              <button
                className="modal-action-btn"
                onClick={(e) => onShare(style, e)}
              >
                <Share2 className="icon" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="modal-details-section">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{style.title}</h2>
                {style.vibe && <p className="modal-vibe">{style.vibe}</p>}
              </div>
              {style.rating > 0 && (
                <div className="modal-rating">
                  <Star className="star-icon filled" />
                  <span className="rating-value">
                    {style.rating.toFixed(1)}
                  </span>
                  {style.ratingCount > 0 && (
                    <span className="rating-count">
                      ({style.ratingCount} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            <p className="modal-description">{style.description}</p>

            {/* Stats */}
            <div className="modal-stats">
              <div className="modal-stat">
                <Eye className="stat-icon" />
                <span>{style.views || 0} views</span>
              </div>
              <div className="modal-stat">
                <Heart className="stat-icon" />
                <span>{style.likes || 0} likes</span>
              </div>
              <div className="modal-stat">
                <Bookmark className="stat-icon" />
                <span>{style.saves || 0} saves</span>
              </div>
              {style.comments && style.comments.length > 0 && (
                <div className="modal-stat">
                  <MessageCircle className="stat-icon" />
                  <span>{style.comments.length} comments</span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="modal-metadata">
              {style.category && (
                <span className="metadata-tag">
                  <Shirt className="tag-icon" />
                  {style.category}
                </span>
              )}
              {style.occasion && (
                <span className="metadata-tag">
                  <Target className="tag-icon" />
                  {style.occasion}
                </span>
              )}
              {style.season && (
                <span className="metadata-tag">
                  <Calendar className="tag-icon" />
                  {style.season}
                </span>
              )}
              {style.priceRange && (
                <span className="metadata-tag">
                  <ShoppingBag className="tag-icon" />
                  {style.priceRange}
                </span>
              )}
            </div>

            {/* Color Palette */}
            {style.colorPalette && style.colorPalette.length > 0 && (
              <div className="modal-section">
                <h3 className="section-title">
                  <Palette className="section-icon" />
                  Color Palette
                </h3>
                <div className="color-palette">
                  {style.colorPalette.map((color, index) => (
                    <div key={index} className="color-item">
                      <div
                        className="color-swatch"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                      <span className="color-name">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Pieces */}
            {style.keyPieces && style.keyPieces.length > 0 && (
              <div className="modal-section">
                <h3 className="section-title">
                  <Shirt className="section-icon" />
                  Key Pieces
                </h3>
                <ul className="key-pieces-list">
                  {style.keyPieces.map((piece, index) => (
                    <li key={index} className="key-piece-item">
                      <span className="piece-name">{piece.item}</span>
                      {piece.description && (
                        <span className="piece-description">
                          {piece.description}
                        </span>
                      )}
                      {piece.priority && (
                        <span className={`piece-priority ${piece.priority}`}>
                          {piece.priority}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Styling Tips */}
            {style.stylingTips && (
              <div className="modal-section">
                <h3 className="section-title">
                  <Lightbulb className="section-icon" />
                  Styling Tips
                </h3>
                {style.stylingTips.dos && style.stylingTips.dos.length > 0 && (
                  <div className="tips-group">
                    <h4 className="tips-subtitle">✓ Do's</h4>
                    <ul className="tips-list">
                      {style.stylingTips.dos.map((tip, index) => (
                        <li key={index} className="tip-item do">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {style.stylingTips.donts &&
                  style.stylingTips.donts.length > 0 && (
                    <div className="tips-group">
                      <h4 className="tips-subtitle">✗ Don'ts</h4>
                      <ul className="tips-list">
                        {style.stylingTips.donts.map((tip, index) => (
                          <li key={index} className="tip-item dont">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {style.stylingTips.mixingTips &&
                  style.stylingTips.mixingTips.length > 0 && (
                    <div className="tips-group">
                      <h4 className="tips-subtitle">💡 Mixing Tips</h4>
                      <ul className="tips-list">
                        {style.stylingTips.mixingTips.map((tip, index) => (
                          <li key={index} className="tip-item mix">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Celebrities */}
            {style.celebrities && style.celebrities.length > 0 && (
              <div className="modal-section">
                <h3 className="section-title">
                  <Users className="section-icon" />
                  Celebrity Style Icons
                </h3>
                <div className="celebrities-grid">
                  {style.celebrities.map((celeb, index) => (
                    <div key={index} className="celebrity-item">
                      {celeb.imageUrl && (
                        <img
                          src={celeb.imageUrl}
                          alt={celeb.name}
                          className="celebrity-image"
                        />
                      )}
                      <span className="celebrity-name">{celeb.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {style.tags && style.tags.length > 0 && (
              <div className="modal-section">
                <div className="modal-tags">
                  {style.tags.map((tag, index) => (
                    <span key={index} className="modal-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Try This Style Button */}
            <button className="try-style-cta">
              Try This Style Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
