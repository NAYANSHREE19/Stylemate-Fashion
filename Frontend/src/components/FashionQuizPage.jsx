import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { submitQuiz } from "../services/quizService";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { QUIZ_QUESTIONS_MALE, INITIAL_QUIZ_STATE_MALE } from "../data/quizQuestionsMale";
import { QUIZ_QUESTIONS_FEMALE, INITIAL_QUIZ_STATE_FEMALE } from "../data/quizQuestionsFemale";
import "../components/FashionQuizPage.css";

const Quiz = () => {
  const { user, loading: authLoading } = useAuth();
  const isMale = user?.gender === "male";
  const questions = isMale ? QUIZ_QUESTIONS_MALE : QUIZ_QUESTIONS_FEMALE;
  const initialState = isMale ? INITIAL_QUIZ_STATE_MALE : INITIAL_QUIZ_STATE_FEMALE;

  const [currentQuestion, setCurrentQuestion]   = useState(0);
  const [answers, setAnswers]                   = useState(initialState);
  const [showResults, setShowResults]           = useState(false);
  const [progress, setProgress]                 = useState(0);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState("");
  const [quizResult, setQuizResult]             = useState(null);
  const navigate = useNavigate();

  // ── Progress ──────────────────────────────────────────────────────
  useEffect(() => {
    setProgress(((currentQuestion + 1) / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  useEffect(() => {
    setAnswers(initialState);
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizResult(null);
    setError("");
  }, [initialState]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleSelect = (questionId, optionId) => {
    const q = questions.find((q) => q.id === questionId);

    if (q.type === "single") {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    } else {
      setAnswers((prev) => {
        const current = prev[questionId] || [];
        const alreadySelected = current.includes(optionId);

        if (alreadySelected) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        }
        // Enforce maxSelect cap
        if (q.maxSelect && current.length >= q.maxSelect) return prev;
        return { ...prev, [questionId]: [...current, optionId] };
      });
    }
  };

  const isSelected = (questionId, optionId) => {
    const val = answers[questionId];
    if (Array.isArray(val)) return val.includes(optionId);
    return val === optionId;
  };

  const canProceed = () => {
    const q    = questions[currentQuestion];
    const val  = answers[q.id];
    if (q.type === "single")   return val !== null && val !== undefined;
    return Array.isArray(val) && val.length > 0;
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () =>
    currentQuestion > 0 && setCurrentQuestion((p) => p - 1);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(initialState);
    setShowResults(false);
    setProgress(0);
    setQuizResult(null);
    setError("");
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Resolve label from option id for each question
      const labelOf = (questionId, optionId) => {
        const q   = questions.find((q) => q.id === questionId);
        const opt = q?.options.find((o) => o.id === optionId);
        return opt?.label || optionId;
      };

      const resolve = (questionId) => {
        const val = answers[questionId];
        if (Array.isArray(val)) return val.map((id) => labelOf(questionId, id));
        return val ? labelOf(questionId, val) : "";
      };

      // Map new fields onto the backend-expected shape
      // (backend still accepts lifestyle / stylePersonality / colorPreferences / bodyType / budget)
      const payload = {
        lifestyle        : resolve("occasion"),          // occasion → lifestyle
        stylePersonality : resolve("style"),             // array
        colorPreferences : resolve("mood"),              // mood → colorPreferences array
        bodyType         : resolve("bodyType"),
        budget           : resolve("budget"),
        // extra fields passed along for Pexels query builder
        occasion         : resolve("occasion"),
        style            : Array.isArray(resolve("style"))
                             ? resolve("style").join(", ")
                             : resolve("style"),
        season           : resolve("season"),
        mood             : resolve("mood"),
      };

      const response = await submitQuiz(payload);

      if (response.success) {
        setQuizResult(response.data);
        setShowResults(true);
      }
    } catch (err) {
      setError(err.message || "Failed to submit quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <section className="quiz">
        <div className="container">
          <LoadingSpinner message="Loading your quiz profile..." />
        </div>
      </section>
    );
  }

  // ── Results view ──────────────────────────────────────────────────
  if (showResults) {
    return (
      <section className="quiz-results">
        <div className="container">
          <div className="results-content">
            <div className="results-header">
              <div className="success-icon"><Sparkles className="icon" /></div>
              <h1>Your Style Profile is Ready!</h1>
              <p>Based on your answers, we've curated personalized picks just for you.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {quizResult && (
              <>
                <div className="recommendations-grid">
                  <div className="recommendation-card">
                    <h3>Your Style DNA</h3>
                    <div className="style-dna-text">
                      <p>{quizResult.styleDNA}</p>
                    </div>
                    <div className="style-tags">
                      {questions.map((q) => {
                        const val = answers[q.id];
                        const ids = Array.isArray(val) ? val : val ? [val] : [];
                        return ids.map((id) => {
                          const opt = q.options.find((o) => o.id === id);
                          return opt ? (
                            <span key={`${q.id}-${id}`} className="style-tag">
                              {opt.icon} {opt.label}
                            </span>
                          ) : null;
                        });
                      })}
                    </div>
                  </div>

                  <div className="recommendation-card">
                    <h3>Recommended for You</h3>
                    <ul className="recommendation-list">
                      {(quizResult.recommendations || []).length > 0
                        ? quizResult.recommendations.map((rec, i) => (
                            <li key={i}>
                              {typeof rec === "string" ? rec : <><strong>{rec.title}</strong>{rec.description && <p>{rec.description}</p>}</>}
                            </li>
                          ))
                        : <li>Versatile pieces that suit your unique style</li>
                      }
                    </ul>
                  </div>
                </div>

                <div className="results-actions">
                  <button onClick={() => navigate("/recommendations")} className="btn-primary">
                    <Sparkles className="btn-icon" /> View Full Recommendations
                  </button>
                  <button onClick={handleRestart} className="btn-secondary">
                    <RotateCcw className="btn-icon" /> Retake Quiz
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── Quiz view ─────────────────────────────────────────────────────
  const currentQ = questions[currentQuestion];
  const optionCountClass = currentQ.options.length <= 4 ? "options-grid--even" : "options-grid--dense";

  return (
    <section className="quiz">
      <div className="container">
        {/* Progress */}
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="question-content">
          <div className="question-header">
            <h1>{currentQ.title}</h1>
            <p className="question-subtitle">
              {currentQ.subtitle}
              {currentQ.maxSelect && (
                <span className="max-select-hint"> (max {currentQ.maxSelect})</span>
              )}
            </p>
          </div>

          <div className={`options-grid ${optionCountClass}`}>
            {currentQ.options.map((option) => (
              <div
                key={option.id}
                className={`option-card ${isSelected(currentQ.id, option.id) ? "selected" : ""}`}
                onClick={() => handleSelect(currentQ.id, option.id)}
              >
                <div className="option-icon">{option.icon}</div>
                <div className="option-content">
                  <h3>{option.label}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="quiz-navigation">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || loading}
            >
              <ChevronLeft /> Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? "Submitting..." : currentQuestion < questions.length - 1
                ? <> Next <ChevronRight /> </>
                : <> Finish <ChevronRight /> </>
              }
            </button>
          </div>

          {loading && (
            <div style={{ marginTop: "2rem" }}>
              <LoadingSpinner message="Generating your style profile..." />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Quiz;
