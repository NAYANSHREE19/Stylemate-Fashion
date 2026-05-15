import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";
import "./App.css";

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import("./components/LandingPage"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const SignupPage = lazy(() => import("./components/SignupPage"));
const RecommendationPage = lazy(() => import("./components/RecommendationPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const StyleGuidePage = lazy(() => import("./components/StyleGuidePage"));
const FashionQuizPage = lazy(() => import("./components/FashionQuizPage"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const WardrobePage = lazy(() => import("./components/WardrobePage"));
const OutfitAnalyzerPage = lazy(() => import("./components/OutfitAnalyzerPage"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));

/* ── Smart Home: LandingPage for guests, Dashboard for logged-in users ── */
const SmartHome = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Loading..." fullScreen />;
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Suspense fallback={<LoadingSpinner message="Loading page..." fullScreen />}>
              <Routes>
                <Route path="/" element={<SmartHome />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/style-guide" element={<StyleGuidePage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Protected Routes - Require Authentication */}
                <Route
                  path="/quiz"
                  element={
                    <ProtectedRoute>
                      <FashionQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <RecommendationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wardrobe"
                  element={
                    <ProtectedRoute>
                      <WardrobePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/outfit-analyzer"
                  element={
                    <ProtectedRoute>
                      <OutfitAnalyzerPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Page */}
                <Route
                  path="*"
                  element={
                    <ErrorPage
                      errorCode="404"
                      title="Page Not Found"
                      message="The page you're looking for doesn't exist."
                      showBackButton={true}
                    />
                  }
                />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
