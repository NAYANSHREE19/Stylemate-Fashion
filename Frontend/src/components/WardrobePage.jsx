import React, { useEffect, useState } from "react";
import {
  getWardrobeItems,
  deleteWardrobeItem,
} from "../services/wardrobeService";
import LoadingSpinner from "./LoadingSpinner";
import "./WardrobePage.css";

const WardrobePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [items, setItems] = useState([]);

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
        showToast("Item removed");
      }
    } catch (err) {
      showToast(err.message || "Failed to remove item");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading wardrobe..." fullScreen />;
  }

  return (
    <section className="wardrobe-page">
      <div className="container wardrobe-container">
        <div className="wardrobe-header">
          <h1>My Wardrobe</h1>
          <p>Your saved outfits and style picks</p>
        </div>

        {error && <div className="wardrobe-error">{error}</div>}
        {toast && <div className="wardrobe-toast">{toast}</div>}

        {items.length === 0 ? (
          <div className="wardrobe-empty">No items saved yet</div>
        ) : (
          <div className="wardrobe-grid">
            {items.map((item) => (
              <article className="wardrobe-card" key={item._id}>
                <div className="wardrobe-image-wrap">
                  {item.imageUrl || item.image ? (
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className="wardrobe-image"
                    />
                  ) : (
                    <div className="wardrobe-image-fallback">👗</div>
                  )}
                </div>

                <div className="wardrobe-card-content">
                  <h3>{item.name}</h3>
                  {item.notes && <p>{item.notes}</p>}
                  <p className="category">Source: {item.source || 'Manual'}</p>
                  <p className="category">Category: {item.category || "Others"}</p>
                  <p className="color-tag">Color: {item.color || "Unknown"}</p>
                  {item.tags?.length > 0 && (
                    <div className="tag-row">
                      {item.tags.slice(0, 6).map((tag, index) => (
                        <span key={`${item._id}-${index}`} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WardrobePage;
