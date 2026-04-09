import "../components/OutfitCard.css";
const OutfitCard = ({
  outfit,
  onSaveToWardrobe,
  onRemoveFromWardrobe,
  onLike,
  onDislike,
  actionState = {},
}) => {
  const isSaving = Boolean(actionState.isSaving);
  const isSaved = Boolean(actionState.isSaved);
  const isRemoving = Boolean(actionState.isRemoving);
  const feedback = actionState.feedback || null;

  return (
    <div className="outfit-card">
      <div className="outfit-image">
        <img src={outfit.image} alt={outfit.title} />
      </div>
      <div className="outfit-content">
        <h3>{outfit.title}</h3>
        <p>{outfit.description}</p>
        {outfit.reason && (
          <p className="recommendation-reason">{outfit.reason}</p>
        )}
        <div className="outfit-items">
          <h4>Items:</h4>
          <ul>
            {outfit.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="outfit-actions">
          <button
            className="save-wardrobe-btn"
            onClick={() => onSaveToWardrobe && onSaveToWardrobe(outfit)}
            disabled={isSaving || isSaved}
          >
            {isSaving ? "Saving..." : isSaved ? "Saved to Wardrobe" : "👗 Save to Wardrobe"}
          </button>

          {isSaved && (
            <button
              className="remove-saved-btn"
              onClick={() => onRemoveFromWardrobe && onRemoveFromWardrobe(outfit)}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "✖ Remove from Wardrobe"}
            </button>
          )}

          <div className="feedback-actions">
            <button
              className={`feedback-btn ${feedback === "like" ? "active-like" : ""}`}
              onClick={() => onLike && onLike(outfit)}
            >
              ❤️ Like
            </button>
            <button
              className={`feedback-btn ${feedback === "dislike" ? "active-dislike" : ""}`}
              onClick={() => onDislike && onDislike(outfit)}
            >
              👎 Dislike
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;
