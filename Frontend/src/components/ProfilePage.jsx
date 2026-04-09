import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Edit3, Mail, User, Calendar, Sparkles } from "lucide-react";
import { getCurrentUser } from "../services/authService";
import { getLatestQuiz } from "../services/quizService";
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
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState("female");
  const [savingGender, setSavingGender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");

      try {
        const [userResponse, quizResponse] = await Promise.all([
          getCurrentUser(),
          getLatestQuiz().catch(() => null),
        ]);

        if (userResponse?.success) {
          setUserData(userResponse.data);
          setSelectedGender(userResponse.data?.gender || "female");
        }

        if (quizResponse?.success) {
          setLatestQuiz(quizResponse.data);
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
        setSuccess("Gender updated successfully. Quiz and recommendations will now adapt.");
        setShowGenderModal(false);
      }
    } catch (err) {
      setError(err?.message || "Failed to update gender.");
    } finally {
      setSavingGender(false);
    }
  };

  return (
    <section className="profile-page">
      <div className="container profile-container">
        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <div className="profile-card style-dna-card">
          <div className="profile-title-row">
            <h1>My Profile</h1>
            <button className="gender-edit-btn" onClick={() => setShowGenderModal(true)}>
              <Edit3 size={14} />
              Change Gender
            </button>
          </div>
          <p className="style-dna-label">Style DNA</p>
          <p className="style-dna-value">
            {latestQuiz?.styleDNA || "Take the quiz to generate your Style DNA."}
          </p>
          <div className="gender-pill-wrap">
            <span className={`gender-pill ${userData?.gender === "male" ? "male" : "female"}`}>
              {userData?.gender === "male" ? "Male Profile" : "Female Profile"}
            </span>
          </div>
          <button className="retake-quiz-btn" onClick={() => navigate("/quiz")}>
            Retake Quiz
          </button>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <h2>Account Details</h2>
            <div className="profile-field">
              <span className="field-icon"><User size={16} /></span>
              <span className="label">Name</span>
              <span className="value">{userData?.name || "-"}</span>
            </div>
            <div className="profile-field">
              <span className="field-icon"><Mail size={16} /></span>
              <span className="label">Email</span>
              <span className="value">{userData?.email || "-"}</span>
            </div>
            <div className="profile-field">
              <span className="field-icon"><Sparkles size={16} /></span>
              <span className="label">Gender</span>
              <span className="value">{userData?.gender || "-"}</span>
            </div>
            <div className="profile-field">
              <span className="field-icon"><Calendar size={16} /></span>
              <span className="label">Last Quiz Date</span>
              <span className="value">
                {latestQuiz?.completedAt
                  ? new Date(latestQuiz.completedAt).toLocaleDateString()
                  : "Not completed yet"}
              </span>
            </div>
          </div>

          <div className="profile-card">
            <h2>Preferences</h2>
            <div className="profile-field no-icon">
              <span className="label">Style Personality</span>
              <span className="value">
                {latestQuiz?.answers?.stylePersonality?.length
                  ? latestQuiz.answers.stylePersonality.join(", ")
                  : "-"}
              </span>
            </div>
            <div className="profile-field no-icon">
              <span className="label">Lifestyle</span>
              <span className="value">{latestQuiz?.answers?.lifestyle || "-"}</span>
            </div>
            <div className="profile-field no-icon">
              <span className="label">Budget</span>
              <span className="value">{latestQuiz?.answers?.budget || "-"}</span>
            </div>
            <div className="profile-field no-icon">
              <span className="label">Body Type</span>
              <span className="value">{latestQuiz?.answers?.bodyType || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      {showGenderModal &&
        createPortal(
          <div className="gender-modal-overlay" onClick={() => setShowGenderModal(false)}>
            <div className="gender-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Update Gender Preferences</h3>
              <p>
                This updates your quiz options, recommendation logic, and generated outfit images.
              </p>

              <div className="gender-choice-row">
                <button
                  className={`gender-choice ${selectedGender === "male" ? "active" : ""}`}
                  onClick={() => setSelectedGender("male")}
                >
                  Male
                </button>
                <button
                  className={`gender-choice ${selectedGender === "female" ? "active" : ""}`}
                  onClick={() => setSelectedGender("female")}
                >
                  Female
                </button>
              </div>

              <div className="gender-modal-actions">
                <button className="btn-cancel" onClick={() => setShowGenderModal(false)} disabled={savingGender}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleGenderSave} disabled={savingGender}>
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
