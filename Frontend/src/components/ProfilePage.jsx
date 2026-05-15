import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Mail,
  User,
  Calendar,
  Sparkles,
  ShirtIcon,
  BookOpen,
  Award,
  TrendingUp,
  Palette,
} from "lucide-react";
import { getCurrentUser } from "../services/authService";
import { getLatestQuiz } from "../services/quizService";
import { getWardrobeItems } from "../services/wardrobeService";
import { updateUserProfile } from "../services/userService";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null);
  const [latestQuiz, setLatestQuiz] = useState(null);
  const [wardrobeCount, setWardrobeCount] = useState(0);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState("female");
  const [savingGender, setSavingGender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");

      try {
        const [userResponse, quizResponse, wardrobeResponse] =
          await Promise.all([
            getCurrentUser(),
            getLatestQuiz().catch(() => null),
            getWardrobeItems().catch(() => null),
          ]);

        if (userResponse?.success) {
          setUserData(userResponse.data);
          setSelectedGender(userResponse.data?.gender || "female");
        }

        if (quizResponse?.success) {
          setLatestQuiz(quizResponse.data);
        }

        if (wardrobeResponse?.success) {
          setWardrobeCount(wardrobeResponse.data?.length || 0);
        }
      } catch (err) {
        setError(err.message || "Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading profile..." fullScreen />;
  }

  const handleGenderSave = async () => {
    setSavingGender(true);
    setError("");
    setSuccess("");
    try {
      const response = await updateUserProfile({ gender: selectedGender });
      if (response?.success) {
        const updatedUser = response.data;
        setUserData(updatedUser);
        updateUser(updatedUser);
        setSuccess(
          "Gender updated successfully. Quiz and recommendations will now adapt."
        );
        setShowGenderModal(false);
      }
    } catch (err) {
      setError(err?.message || "Failed to update gender.");
    } finally {
      setSavingGender(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stylePersonalities = latestQuiz?.answers?.stylePersonality || [];
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <section className="profile-page">
      <div className="container profile-container">
        {error && <div className="profile-alert profile-alert--error">{error}</div>}
        {success && <div className="profile-alert profile-alert--success">{success}</div>}

        {/* ═══════════════════════════════════════════════════════
            PROFILE HERO CARD
        ═══════════════════════════════════════════════════════ */}
        <div className="profile-hero fade-in-up">
          <div className="profile-hero__glow" />

          <div className="profile-hero__avatar">
            <div className="profile-avatar">
              {getInitials(userData?.name)}
            </div>
            <div className="profile-hero__info">
              <h1>{userData?.name || "StyleMate User"}</h1>
              <p className="profile-hero__email">{userData?.email}</p>
              <div className="profile-hero__badges">
                <span
                  className={`profile-gender-pill ${userData?.gender === "male" ? "male" : "female"}`}
                >
                  {userData?.gender === "male" ? "♂ Male" : "♀ Female"}
                </span>
                <span className="profile-member-pill">
                  <Calendar size={12} />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          <button
            className="profile-hero__edit"
            onClick={() => setShowGenderModal(true)}
          >
            <Edit3 size={14} />
            Edit Profile
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════
            STATS CARDS
        ═══════════════════════════════════════════════════════ */}
        <div className="profile-stats fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="profile-stat-card">
            <div className="profile-stat-card__icon">
              <ShirtIcon size={22} />
            </div>
            <div>
              <span className="profile-stat-card__value">{wardrobeCount}</span>
              <span className="profile-stat-card__label">Wardrobe Items</span>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-card__icon">
              <BookOpen size={22} />
            </div>
            <div>
              <span className="profile-stat-card__value">
                {latestQuiz ? "1" : "0"}
              </span>
              <span className="profile-stat-card__label">Quizzes Taken</span>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-card__icon">
              <Palette size={22} />
            </div>
            <div>
              <span className="profile-stat-card__value">
                {stylePersonalities.length || "—"}
              </span>
              <span className="profile-stat-card__label">Style Types</span>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-card__icon">
              <Award size={22} />
            </div>
            <div>
              <span className="profile-stat-card__value">
                {latestQuiz?.answers?.budget || "—"}
              </span>
              <span className="profile-stat-card__label">Budget Range</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            DETAILS GRID
        ═══════════════════════════════════════════════════════ */}
        <div className="profile-grid fade-in-up" style={{ animationDelay: "0.2s" }}>
          {/* ─── Style DNA ──────────────────────────── */}
          <div className="profile-card profile-card--dna">
            <div className="profile-card__header">
              <Sparkles size={18} className="profile-card__header-icon" />
              <h2>Style DNA</h2>
            </div>
            <p className="profile-dna-text">
              {latestQuiz?.styleDNA ||
                "Take the style quiz to generate your unique Style DNA."}
            </p>

            {stylePersonalities.length > 0 && (
              <div className="profile-dna-tags">
                {stylePersonalities.map((sp) => (
                  <span key={sp} className="profile-dna-tag">
                    {sp}
                  </span>
                ))}
              </div>
            )}

            <button
              className="btn-primary profile-retake-btn"
              onClick={() => navigate("/quiz")}
            >
              <TrendingUp size={16} />
              {latestQuiz ? "Retake Quiz" : "Take Style Quiz"}
            </button>
          </div>

          {/* ─── Preferences ────────────────────────── */}
          <div className="profile-card">
            <div className="profile-card__header">
              <User size={18} className="profile-card__header-icon" />
              <h2>Preferences</h2>
            </div>

            <div className="profile-field-list">
              <div className="profile-field">
                <span className="profile-field__label">Lifestyle</span>
                <span className="profile-field__value">
                  {latestQuiz?.answers?.lifestyle || "—"}
                </span>
              </div>
              <div className="profile-field">
                <span className="profile-field__label">Body Type</span>
                <span className="profile-field__value">
                  {latestQuiz?.answers?.bodyType || "—"}
                </span>
              </div>
              <div className="profile-field">
                <span className="profile-field__label">Budget</span>
                <span className="profile-field__value">
                  {latestQuiz?.answers?.budget || "—"}
                </span>
              </div>
              <div className="profile-field">
                <span className="profile-field__label">Last Quiz</span>
                <span className="profile-field__value">
                  {latestQuiz?.completedAt
                    ? new Date(latestQuiz.completedAt).toLocaleDateString()
                    : "Not completed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          GENDER MODAL
      ═══════════════════════════════════════════════════════ */}
      {showGenderModal &&
        createPortal(
          <div
            className="gender-modal-overlay"
            onClick={() => setShowGenderModal(false)}
          >
            <div
              className="gender-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Update Gender Preferences</h3>
              <p>
                This updates your quiz options, recommendation logic, and
                generated outfit images.
              </p>

              <div className="gender-choice-row">
                <button
                  className={`gender-choice ${selectedGender === "male" ? "active" : ""}`}
                  onClick={() => setSelectedGender("male")}
                >
                  ♂ Male
                </button>
                <button
                  className={`gender-choice ${selectedGender === "female" ? "active" : ""}`}
                  onClick={() => setSelectedGender("female")}
                >
                  ♀ Female
                </button>
              </div>

              <div className="gender-modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowGenderModal(false)}
                  disabled={savingGender}
                >
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleGenderSave}
                  disabled={savingGender}
                >
                  {savingGender ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default ProfilePage;
