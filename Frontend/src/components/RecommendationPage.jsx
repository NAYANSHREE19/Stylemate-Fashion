import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLatestQuiz } from '../services/quizService';
import { getCurrentUser } from '../services/authService';
import { generateAIOutfits } from '../services/aiService';
import { addWardrobeItem } from '../services/wardrobeService';
import { submitRecommendationFeedback } from '../services/recommendationService';
import { getClientFallbackOutfits } from '../data/fallbackOutfitsData';
import { Sparkles, Heart, ThumbsDown, Bookmark, BookmarkCheck, RefreshCw, Loader2 } from 'lucide-react';
import '../components/RecommendationPage.css';

const STYLE_OPTIONS = [
  'Minimalist', 'Streetwear', 'Classic', 'Sporty', 'Bohemian',
  'Edgy', 'Preppy', 'Vintage', 'Luxury', 'Romantic', 'Indie / artsy', 'Smart casual'
];
const BUDGET_OPTIONS = [
  'Under ₹1,000', '₹1,000 – ₹3,000', '₹3,000 – ₹7,000', '₹7,000 – ₹15,000', 'Luxury (₹15,000+)'
];
const OCCASION_OPTIONS = [
  'Daily college wear', 'Office / corporate', 'Business casual',
  'Date night', 'Wedding guest', 'Festive (Diwali, Puja)',
  'Travel / airport', 'Gym / active', 'Brunch / café',
  'Night out / club', 'Family function', 'Interview / professional'
];

const DEFAULT_INPUTS = {
  style: 'Minimalist',
  lifestyle: 'Casual',
  budget: '₹1,000 – ₹3,000',
  bodyType: 'Average',
  occasion: 'Daily college wear',
  colorPreferences: [],
  mood: [],
  season: ''
};

const compressDataUrlImage = (dataUrl) =>
  new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl || null);
      return;
    }

    const image = new Image();
    image.onload = () => {
      const maxWidth = 768;
      const scale = Math.min(1, maxWidth / image.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(image.width * scale));
      canvas.height = Math.max(1, Math.floor(image.height * scale));

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });

const AI_CACHE_VERSION = 'v2';

const getUserIdToken = (user) => user?.id || user?._id || 'anon';

const buildAiCacheKey = ({ userId, quizId, completedAt }) =>
  `stylemate-ai-outfits-${AI_CACHE_VERSION}-${userId}-${quizId || 'no-quiz'}-${completedAt || 'none'}`;

const slugifyToken = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const hashToken = (value) => {
  const input = String(value || '');
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const extractCategory = (tags = [], description = '') => {
  const text = `${tags.join(' ')} ${description}`.toLowerCase();
  if (/dress|gown|one-piece/.test(text)) return 'Dresses';
  if (/jacket|coat|blazer|outerwear/.test(text)) return 'Outerwear';
  if (/heel|sneaker|boot|shoe/.test(text)) return 'Shoes';
  if (/top|shirt|blouse|tee/.test(text)) return 'Tops';
  if (/pant|jean|trouser|skirt|short/.test(text)) return 'Bottoms';
  if (/bag|belt|watch|ring|necklace|accessor/.test(text)) return 'Accessories';
  return 'Others';
};

const extractColor = (tags = [], description = '') => {
  const palette = [
    'black', 'white', 'beige', 'brown', 'gray', 'grey', 'navy', 'blue', 'green',
    'red', 'burgundy', 'pink', 'purple', 'lavender', 'yellow', 'orange', 'gold',
    'silver', 'cream', 'olive', 'tan'
  ];

  const text = `${tags.join(' ')} ${description}`.toLowerCase();
  const match = palette.find((color) => text.includes(color));
  if (!match) return 'Mixed';
  return match === 'grey' ? 'Gray' : match.charAt(0).toUpperCase() + match.slice(1);
};

const outfitNameFromDescription = (description = '') => {
  const trimmed = String(description || '').trim();
  if (!trimmed) return 'AI Outfit Recommendation';
  return trimmed.length > 90 ? `${trimmed.slice(0, 87)}...` : trimmed;
};

const resolveProviderLabel = (imageUrl) =>
  String(imageUrl || '').startsWith('data:image/') ? 'AI Generated' : 'Pexels';

// ─── Skeleton Card Component ────────────────────────────────────
const SkeletonCard = ({ index }) => (
  <article className="ai-outfit-card ai-outfit-card--skeleton" style={{ animationDelay: `${index * 0.1}s` }}>
    <div className="ai-outfit-image-wrap">
      <div className="skeleton skeleton--image" />
    </div>
    <div className="ai-outfit-content">
      <div className="skeleton skeleton--text" style={{ width: '85%', height: '14px' }} />
      <div className="skeleton skeleton--text" style={{ width: '60%', height: '14px', marginTop: '0.5rem' }} />
      <div className="ai-tag-row">
        <div className="skeleton skeleton--chip" />
        <div className="skeleton skeleton--chip" />
        <div className="skeleton skeleton--chip" />
      </div>
      <div className="skeleton skeleton--btn" />
    </div>
  </article>
);

// ─── Fashion tips shown during loading ──────────────────────────
const LOADING_TIPS = [
  "✨ Mixing textures adds depth to any outfit",
  "👗 The right fit matters more than the brand",
  "🎨 A pop of color can transform a neutral look",
  "👠 Invest in quality basics — they last longer",
  "🧥 Layer strategically for visual interest",
  "💎 Accessories can make or break an outfit"
];

const RecommendationsPage = () => {
  const { user } = useAuth();

  const [aiOutfits, setAiOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [fallbackNotice, setFallbackNotice] = useState('');
  const [toast, setToast] = useState('');
  const [feedbackByOutfit, setFeedbackByOutfit] = useState({});
  const [savingByOutfit, setSavingByOutfit] = useState({});
  const [savedByOutfit, setSavedByOutfit] = useState({});
  const [ready, setReady] = useState(false);
  const [cacheKey, setCacheKey] = useState('');
  const [autoLoadedFromCache, setAutoLoadedFromCache] = useState(false);
  const [loadingTip, setLoadingTip] = useState(LOADING_TIPS[0]);
  const bootstrappedRef = useRef(false);

  const [baseProfile, setBaseProfile] = useState({
    lifestyle: DEFAULT_INPUTS.lifestyle,
    bodyType: DEFAULT_INPUTS.bodyType,
    colorPreferences: DEFAULT_INPUTS.colorPreferences,
    mood: DEFAULT_INPUTS.mood,
    season: DEFAULT_INPUTS.season
  });

  const [filters, setFilters] = useState({
    style: DEFAULT_INPUTS.style,
    budget: DEFAULT_INPUTS.budget,
    occasion: DEFAULT_INPUTS.occasion
  });

  // Rotate fashion tips during loading
  useEffect(() => {
    if (!loading && !generating) return;
    const interval = setInterval(() => {
      setLoadingTip(LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading, generating]);

  const buildPrompt = useCallback(
    (activeFilters, activeBase) =>
      `Fashion editorial outfit for a ${activeFilters.style} style personality, ${activeBase.lifestyle} lifestyle, ${activeFilters.budget} budget, suitable for ${activeFilters.occasion}, tailored to ${activeBase.bodyType} body type.`,
    []
  );

  const normalizeOutfits = useCallback(
    (outfitsArray, activeFilters, activeBase) =>
      outfitsArray
        .map((item, index) => {
          const image = item?.image || item?.imageUrl || item?.url || '';
          if (!image) return null;

          const seed = `${item?.prompt || ''}|${image.slice(0, 160)}|${index}`;
          const styleToken = slugifyToken(activeFilters.style);
          const occasionToken = slugifyToken(activeFilters.occasion);

          return {
            id: `ai-${styleToken}-${occasionToken}-${hashToken(seed)}`,
            image,
            description: item.description || `${activeFilters.style} AI outfit concept ${index + 1}.`,
            tags: Array.isArray(item.tags) ? item.tags : [],
            prompt: item.prompt || buildPrompt(activeFilters, activeBase)
          };
        })
        .filter(Boolean),
    [buildPrompt]
  );

  const generateOutfits = useCallback(
    async (activeFilters = filters, activeBase = baseProfile, options = {}) => {
      const { persist = true } = options;
      setGenerating(true);
      setLoading(true);
      setError('');
      setFallbackNotice('');

      try {
        const payload = {
          gender: user?.gender || 'male',
          style: activeFilters.style,
          stylePersonality: activeFilters.style,
          lifestyle: activeBase.lifestyle,
          budget: activeFilters.budget,
          bodyType: activeBase.bodyType,
          occasion: activeFilters.occasion,
          colorPreferences: activeBase.colorPreferences || [],
          mood: activeBase.mood || [],
          season: activeBase.season || ''
        };

        const response = await generateAIOutfits(payload);
        const outfitsArray = Array.isArray(response) ? response : [];
        const normalized = normalizeOutfits(outfitsArray, activeFilters, activeBase);

        if (normalized.length === 0) {
          throw new Error('No images returned from AI provider');
        }

        const isAlternativeProvider = normalized.some((outfit) =>
          String(outfit.image).startsWith('/assets/outfits/')
        );

        if (isAlternativeProvider) {
          setFallbackNotice('Showing curated Pexels picks for this style');
        }

        setAiOutfits(normalized.slice(0, 6));
        setFeedbackByOutfit({});
        setSavingByOutfit({});
        setSavedByOutfit({});

        if (persist && cacheKey && !isAlternativeProvider) {
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                filters: activeFilters,
                baseProfile: activeBase,
                outfitIds: normalized.slice(0, 6).map(o => o.id),
                fallbackNotice: isAlternativeProvider ? 'curated' : '',
                error: ''
              })
            );
          } catch { /* localStorage full — ignore */ }
        }
      } catch (err) {
        const fallbackOutfits = getClientFallbackOutfits(activeFilters, activeBase, 6);
        setAiOutfits(fallbackOutfits);
        setFeedbackByOutfit({});
        setSavingByOutfit({});
        setSavedByOutfit({});
        // Show subtle notice instead of error — Unsplash images are real and useful
        setFallbackNotice('Showing curated style picks. Try refreshing for personalised results.');
        setError('');
        console.error('Failed to generate AI outfits:', err);

        if (persist && cacheKey) {
          localStorage.removeItem(cacheKey);
        }
      } finally {
        setLoading(false);
        setGenerating(false);
      }
    },
    [baseProfile, cacheKey, filters, normalizeOutfits, user?.gender]
  );

  useEffect(() => {
    const generateFromQuiz = async () => {
      setLoading(true);
      setError('');

      try {
        const [quizResult, meResult] = await Promise.allSettled([
          getLatestQuiz(),
          getCurrentUser()
        ]);

        const answers =
          quizResult.status === 'fulfilled' ? quizResult.value?.data?.answers || null : null;
        const preferences =
          meResult.status === 'fulfilled' ? meResult.value?.data?.preferences || {} : {};
        const latestQuiz = quizResult.status === 'fulfilled' ? quizResult.value?.data || null : null;

        const lifestyle = answers?.lifestyle || preferences.lifestyle || DEFAULT_INPUTS.lifestyle;
        const nextBase = {
          lifestyle,
          bodyType: answers?.bodyType || preferences.bodyType || DEFAULT_INPUTS.bodyType,
          colorPreferences: answers?.colorPreferences || preferences.colorPreferences || [],
          mood: answers?.mood || preferences.mood || [],
          season: answers?.season || preferences.season || ''
        };

        const nextFilters = {
          style:
            answers?.stylePersonality?.[0] ||
            preferences.stylePersonality?.[0] ||
            DEFAULT_INPUTS.style,
          budget: answers?.budget || preferences.budget || DEFAULT_INPUTS.budget,
          occasion: answers?.occasion || DEFAULT_INPUTS.occasion
        };

        setBaseProfile(nextBase);
        setFilters(nextFilters);

        const key = buildAiCacheKey({
          userId: getUserIdToken(user),
          quizId: latestQuiz?._id || null,
          completedAt: latestQuiz?.completedAt || null
        });

        setCacheKey(key);
        setReady(true);
      } catch (err) {
        const nextBase = {
          lifestyle: DEFAULT_INPUTS.lifestyle,
          bodyType: DEFAULT_INPUTS.bodyType,
          colorPreferences: DEFAULT_INPUTS.colorPreferences
        };
        const nextFilters = {
          style: DEFAULT_INPUTS.style,
          budget: DEFAULT_INPUTS.budget,
          occasion: DEFAULT_INPUTS.occasion
        };
        setBaseProfile(nextBase);
        setFilters(nextFilters);
        const key = buildAiCacheKey({
          userId: getUserIdToken(user),
          quizId: null,
          completedAt: null
        });
        setCacheKey(key);
        setReady(true);
        console.error('Failed to load quiz defaults:', err);
      } finally {
        setLoading(false);
      }
    };

    generateFromQuiz();
  }, [user]);

  useEffect(() => {
    if (!ready || !cacheKey || bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    generateOutfits(filters, baseProfile, { persist: true });
  }, [baseProfile, cacheKey, filters, generateOutfits, ready]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const updateFilter = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const preferenceChips = useMemo(
    () => [filters.style, baseProfile.lifestyle, baseProfile.bodyType, filters.budget, filters.occasion],
    [baseProfile.bodyType, baseProfile.lifestyle, filters.budget, filters.occasion, filters.style]
  );

  const handleSaveOutfit = async (outfit) => {
    if (savedByOutfit[outfit.id]) {
      showToast('Already saved to wardrobe ✓');
      return;
    }

    setSavingByOutfit((prev) => ({ ...prev, [outfit.id]: true }));

    try {
      const compressedImage = await compressDataUrlImage(outfit.image);
      const meaningfulName = outfitNameFromDescription(outfit.description);
      const response = await addWardrobeItem({
        name: meaningfulName,
        image: compressedImage,
        tags: outfit.tags,
        category: extractCategory(outfit.tags, outfit.description),
        color: extractColor(outfit.tags, outfit.description),
        notes: outfit.description,
        source: 'AI',
        sourceOutfitId: outfit.id
      });

      if (response.success) {
        setSavedByOutfit((prev) => ({ ...prev, [outfit.id]: true }));
        showToast(response.duplicate ? 'Already in wardrobe ✓' : 'Saved to wardrobe! 🎉');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save');
    } finally {
      setSavingByOutfit((prev) => ({ ...prev, [outfit.id]: false }));
    }
  };

  const handleFeedback = async (outfit, feedback) => {
    try {
      const response = await submitRecommendationFeedback({
        outfitId: outfit.id,
        prompt: outfit.prompt,
        feedback
      });

      if (response.success) {
        setFeedbackByOutfit((prev) => ({ ...prev, [outfit.id]: feedback }));
        showToast(feedback === 'like' ? 'Loved it! ❤️' : 'Noted — we\'ll improve!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback');
    }
  };

  const handleImageError = (event) => {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.style.display = 'none';
  };

  return (
    <div className="recommendations-page">
      <div className="container">
        {/* ─── Header Section ─────────────────────────────── */}
        <div className="rec-header fade-in-up">
          <div className="rec-header__top">
            <div className="rec-header__badge">
              <Sparkles size={16} />
              <span>AI-Powered</span>
            </div>
            <h1 className="rec-header__title">
              Your <span className="gradient-text">Outfit</span> Recommendations
            </h1>
            <p className="rec-header__subtitle">
              {user?.name ? `Hey ${user.name.split(' ')[0]}! ` : ''}
              Personalized looks crafted by AI based on your style profile.
            </p>
          </div>

          {/* ─── Filters ───────────────────────────────────── */}
          <div className="rec-filters">
            <div className="rec-filter-group">
              <label htmlFor="occasion-filter">Occasion</label>
              <select
                id="occasion-filter"
                value={filters.occasion}
                onChange={updateFilter('occasion')}
              >
                {OCCASION_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="rec-filter-group">
              <label htmlFor="style-filter">Style</label>
              <select id="style-filter" value={filters.style} onChange={updateFilter('style')}>
                {STYLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="rec-filter-group">
              <label htmlFor="budget-filter">Budget</label>
              <select id="budget-filter" value={filters.budget} onChange={updateFilter('budget')}>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ─── Chips ─────────────────────────────────────── */}
          <div className="rec-chip-row">
            {preferenceChips.filter(Boolean).map((chip) => (
              <span className="rec-chip" key={chip}>{chip}</span>
            ))}
          </div>

          {/* ─── Generate Button ────────────────────────────── */}
          <button
            type="button"
            className="btn-primary rec-generate-btn"
            onClick={() => generateOutfits(filters, baseProfile, { persist: true })}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Generate New Outfits
              </>
            )}
          </button>
        </div>

        {/* ─── Status Messages ───────────────────────────── */}
        {error && <div className="rec-alert rec-alert--error">{error}</div>}
        {fallbackNotice && <div className="rec-alert rec-alert--info">{fallbackNotice}</div>}
        {toast && <div className="rec-toast">{toast}</div>}

        {/* ─── Loading Tip ───────────────────────────────── */}
        {(loading || generating) && (
          <div className="rec-loading-tip">
            <p>{loadingTip}</p>
          </div>
        )}

        {/* ─── Outfits Grid ──────────────────────────────── */}
        <div className="rec-grid">
          {loading || generating ? (
            // Skeleton cards while loading
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`skel-${i}`} index={i} />)
          ) : aiOutfits.length > 0 ? (
            aiOutfits.map((outfit, index) => (
              <article
                className="ai-outfit-card fade-in-up"
                key={outfit.id}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="ai-outfit-image-wrap">
                  <img
                    src={outfit.image}
                    alt={outfit.description}
                    className="ai-outfit-image"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="ai-outfit-image-overlay">
                    <span className="ai-outfit-badge">{resolveProviderLabel(outfit.image)}</span>
                  </div>
                </div>
                <div className="ai-outfit-content">
                  <p className="ai-outfit-desc">{outfit.description}</p>
                  {outfit.tags.length > 0 && (
                    <div className="ai-tag-row">
                      {outfit.tags.slice(0, 5).map((tag) => (
                        <span className="ai-tag" key={`${outfit.id}-${tag}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="ai-actions">
                    <button
                      className={`ai-action-btn ai-action-btn--like ${feedbackByOutfit[outfit.id] === 'like' ? 'active' : ''}`}
                      onClick={() => handleFeedback(outfit, 'like')}
                      title="Love this look"
                    >
                      <Heart size={16} fill={feedbackByOutfit[outfit.id] === 'like' ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      className={`ai-action-btn ai-action-btn--dislike ${feedbackByOutfit[outfit.id] === 'dislike' ? 'active' : ''}`}
                      onClick={() => handleFeedback(outfit, 'dislike')}
                      title="Not my style"
                    >
                      <ThumbsDown size={16} />
                    </button>
                    <button
                      className="ai-action-btn ai-action-btn--save"
                      onClick={() => handleSaveOutfit(outfit)}
                      disabled={Boolean(savedByOutfit[outfit.id]) || Boolean(savingByOutfit[outfit.id])}
                      title="Save to wardrobe"
                    >
                      {savedByOutfit[outfit.id] ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      <span>
                        {savingByOutfit[outfit.id]
                          ? 'Saving...'
                          : savedByOutfit[outfit.id]
                            ? 'Saved'
                            : 'Save'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rec-empty">
              <Sparkles size={48} />
              <h3>No outfits yet</h3>
              <p>Click "Generate New Outfits" to get AI-powered recommendations.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => generateOutfits(filters, baseProfile)}
              >
                <Sparkles size={18} />
                Generate Outfits
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
