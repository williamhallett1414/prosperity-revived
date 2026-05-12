import React, { Suspense, lazy } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Capacitor init — no-op in web environment (native SDKs not installed)
const useCapacitorInit = () => {};

// ── Public auth pages (lazy) ──────────────────────────────────────────────────
const Welcome = lazy(() => import('@/auth/Welcome'));
const QuizFlow = lazy(() => import('@/auth/quiz/QuizFlow'));
const Login = lazy(() => import('@/auth/Login'));
const Signup = lazy(() => import('@/auth/Signup'));
const VerifyEmail = lazy(() => import('@/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('@/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/auth/ResetPassword'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// ─── Global Error Boundary ────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F2F6FA] dark:bg-[#0A1A2F] px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FD9C2D]/20 flex items-center justify-center">
              <span className="text-3xl">🙏</span>
            </div>
            <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              We hit an unexpected issue. Please try again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-6 py-3 bg-[#FD9C2D] text-white font-semibold rounded-xl shadow-md dark:shadow-none hover:bg-[#e88d1f] transition-colors min-h-[44px]"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Lazy-loading fallback ────────────────────────────────────────────────────
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-10 h-10 mx-auto mb-3 border-4 border-[#FD9C2D]/30 border-t-[#FD9C2D] rounded-full animate-spin" />
      <p className="text-sm text-gray-400 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

// ─── Full-screen boot spinner (used while AuthContext is settling) ────────────
const BootSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#FBF6EC] dark:bg-[#0A1A2F]">
    <div className="w-8 h-8 border-4 border-[#FD9C2D]/30 border-t-[#FD9C2D] rounded-full animate-spin" />
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// ─── RequireAuth: redirect to /login if unauthenticated ───────────────────────
const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const location = useLocation();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return <BootSpinner />;
  }

  if (authError) {
    if (authError.type === 'account_deleted') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F2F6FA] dark:bg-[#0A1A2F] px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-3xl">🗑️</span>
            </div>
            <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-2">Account Deleted</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              This account has been permanently deleted and can no longer be accessed.
            </p>
          </div>
        </div>
      );
    }
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    if (authError.type === 'auth_required') {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

// ─── PublicOnly: redirect authenticated users away from login/signup ──────────
const PublicOnly = ({ children }) => {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings } = useAuth();
  if (isLoadingAuth || isLoadingPublicSettings) {
    return <BootSpinner />;
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ─── Authenticated app routes ─────────────────────────────────────────────────
const AuthenticatedRoutes = () => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Suspense fallback={<PageLoadingFallback />}>
                <Page />
              </Suspense>
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Suspense>
);

// ─── App routing root ─────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Suspense fallback={<BootSpinner />}>
    <Routes>
      {/* Public auth routes — accessible without authentication */}
      <Route path="/welcome" element={<PublicOnly><Welcome /></PublicOnly>} />
      <Route path="/quiz" element={<PublicOnly><QuizFlow /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route path="/verify-email" element={<PublicOnly><VerifyEmail /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      <Route path="/reset-password" element={<PublicOnly><ResetPassword /></PublicOnly>} />
      {/* Everything else requires auth */}
      <Route path="/*" element={<RequireAuth><AuthenticatedRoutes /></RequireAuth>} />
    </Routes>
  </Suspense>
);


function App() {
  useCapacitorInit();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
