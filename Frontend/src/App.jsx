import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import("./components/Homepage"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const SignupPage = lazy(() => import("./components/SignupPage"));
const RecommendationPage = lazy(() => import("./components/RecommendationPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const StyleGuidePage = lazy(() => import("./components/StyleGuidePage"));
const FashionQuizPage = lazy(() => import("./components/FashionQuizPage"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const WardrobePage = lazy(() => import("./components/WardrobePage"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Suspense fallback={<LoadingSpinner message="Loading page..." fullScreen />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
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
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
