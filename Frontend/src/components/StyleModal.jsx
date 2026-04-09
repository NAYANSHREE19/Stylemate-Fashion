import React, { useState } from "react";
import { X, Heart, Bookmark, Share2, Star, Check, ChevronLeft, ChevronRight } from "lucide-react";
import "./StyleModal.css";

const StyleModal = ({ style, isOpen, onClose, onLike, onSave, onShare, isLiked, isSaved }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!isOpen || !style) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === style.imageGallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? style.imageGallery.length - 1 : prev - 1
    );
  };

  return (
    <div className="style-modal-overlay" onClick={onClose}>
      <div className="style-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Content Grid */}
        <div className="modal-content-grid">
          {/* Left Side - Image Gallery */}
          <div className="modal-left">
            <div className="image-gallery">
              <img
                src={style.imageGallery[currentImageIndex]}
                alt={style.title}
                className="gallery-main-image"
              />

              {/* Gallery Navigation */}
              {style.imageGallery.length > 1 && (
                <>
                  <button className="gallery-nav gallery-prev" onClick={prevImage}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="gallery-nav gallery-next" onClick={nextImage}>
                    <ChevronRight size={24} />
                  </button>

                  {/* Image Indicators */}
                  <div className="gallery-indicators">
                    {style.imageGallery.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Color Palette */}
            <div className="color-palette-section">
              <h4>Color Palette</h4>
              <div className="color-swatches">
                {style.colorPalette.map((color, index) => (
                  <div
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="modal-right">
            {/* Header */}
            <div className="modal-header">
              <div>
                <div className="style-badge-group">
                  <span className="category-badge">{style.category}</span>
                  {style.trending && <span className="trending-badge">🔥 Trending</span>}
                </div>
                <h2 className="modal-title">{style.title}</h2>
                <div className="modal-meta">
                  <div className="rating">
                    <Star size={16} fill="#FFD700" color="#FFD700" />
                    <span>{style.rating}</span>
                  </div>
                  <span className="divider">•</span>
                  <span>{style.difficulty}</span>
                  <span className="divider">•</span>
                  <span>{style.priceRange}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button
                  className={`action-btn ${isLiked ? 'liked' : ''}`}
                  onClick={onLike}
                  title="Like this style"
                >
                  <Heart size={20} fill={isLiked ? "#FF6B6B" : "none"} />
                  <span>{style.likes}</span>
                </button>
                <button
                  className={`action-btn ${isSaved ? 'saved' : ''}`}
                  onClick={onSave}
                  title="Save to collection"
                >
                  <Bookmark size={20} fill={isSaved ? "#667eea" : "none"} />
                  <span>{style.saves}</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  title="Share style"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Share Options */}
            {showShareOptions && (
              <div className="share-options">
                <button onClick={() => onShare('facebook')}>Facebook</button>
                <button onClick={() => onShare('twitter')}>Twitter</button>
                <button onClick={() => onShare('pinterest')}>Pinterest</button>
                <button onClick={() => onShare('copy')}>Copy Link</button>
              </div>
            )}

            {/* Description */}
            <div className="modal-section">
              <h3>About This Style</h3>
              <p className="style-description">{style.description}</p>
              <p className="style-personality"><strong>Personality:</strong> {style.stylePersonality}</p>
              <p className="style-best-for"><strong>Best For:</strong> {style.bestFor}</p>
            </div>

            {/* Key Pieces */}
            <div className="modal-section">
              <h3>Essential Pieces</h3>
              <div className="key-pieces-list">
                {style.keyPieces.map((piece, index) => (
                  <div key={index} className={`key-piece ${piece.priority.toLowerCase().replace('-', '')}`}>
                    <Check size={16} />
                    <span>{piece.item}</span>
                    <span className="priority-badge">{piece.priority}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Info Grid */}
            <div className="style-info-grid">
              <div className="info-item">
                <h4>Seasons</h4>
                <div className="tag-list">
                  {style.seasons.map((season, i) => (
                    <span key={i} className="info-tag">{season}</span>
                  ))}
                </div>
              </div>
              <div className="info-item">
                <h4>Occasions</h4>
                <div className="tag-list">
                  {style.occasions.slice(0, 3).map((occasion, i) => (
                    <span key={i} className="info-tag">{occasion}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Styling Tips */}
            <div className="modal-section">
              <h3>Styling Tips</h3>
              <ul className="tips-list">
                {style.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Do's and Don'ts */}
            <div className="modal-section dos-donts">
              <h3>Do's & Don'ts</h3>
              <div className="dos-donts-grid">
                <div className="dos">
                  <h4>✓ Do</h4>
                  <ul>
                    {style.dosDonts.dos.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="donts">
                  <h4>✗ Don't</h4>
                  <ul>
                    {style.dosDonts.donts.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Style Icons */}
            <div className="modal-section">
              <h3>Style Icons</h3>
              <div className="celebrities-list">
                {style.celebrities.map((celeb, i) => (
                  <span key={i} className="celebrity-tag">{celeb}</span>
                ))}
              </div>
            </div>

            {/* Related Styles */}
            <div className="modal-section">
              <h3>Related Styles</h3>
              <div className="related-styles">
                {style.relatedStyles.map((related, i) => (
                  <span key={i} className="related-tag">{related}</span>
                ))}
              </div>
            </div>

            {/* Try This Style Button */}
            <button className="try-style-main-btn">
              Try This Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleModal;
