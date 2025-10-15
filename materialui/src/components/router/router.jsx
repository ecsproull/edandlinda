import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundry from "../../components/errors/errorboundry";
import { useAuth } from "../../contexts/authentication";

// Lazy load components
const Blog = lazy(() => import("../blog/blog"));
const BlogDetail = lazy(() => import("../blog/blogdetail"));
const BlogForm = lazy(() => import("../../forms/blogform"));
const EditBlog = lazy(() => import("../../forms/editblog"));
const Travel = lazy(() => import("../travel/travel"));
const Map = lazy(() => import("../mapper/map"));
const Education = lazy(() => import("../education/education"));
const Home = lazy(() => import("../home/home"));
const Signin = lazy(() => import("../../forms/signin"));
const EditPlaces = lazy(() => import("../../forms/editplaces"));
const PlaceForm = lazy(() => import("../../forms/addeditplace"));
const ProtectedRoute = lazy(() => import("../../components/router/protectroute/protectroute"));
const EditUsers = lazy(() => import("../../forms/editusers"));
const SignupForm = lazy(() => import("../../forms/signup"));
const Unauthorized = lazy(() => import("../unauthorized/unauthorized"));
const EmailVerificationPending = lazy(() => import("../../verifyemailcode/emailverificationpending"));
const VerifyEmailCode = lazy(() => import("../../verifyemailcode/verifyemailcode"));
const ManualsForm = lazy(() => import("../../forms/manualsform"));

export default function Router() {
  const location = useLocation();
  const { hasRole } = useAuth();
  const protectedRoute = (element, allowedRoles = []) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      {element}
    </ProtectedRoute>
  );

  const errorRoute = (path, element) => (
    <Route
      path={path}
      element={
        <ErrorBoundry isAdmin={hasRole('Admin')}>
          {element}
        </ErrorBoundry>
      }
    />
  );

  const errorProtectedRoute = (path, element, allowedRoles) => (
    <Route
      path={path}
      element={protectedRoute(
        <ErrorBoundry isAdmin={hasRole('Admin')}>
          {element}
        </ErrorBoundry>,
        allowedRoles
      )}
    />
  );

  return (
    <ErrorBoundry isAdmin={hasRole('Admin')} key={location.pathname} fallback={(error, resetErrorBoundary) => (
      <div>
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try Again</button>
      </div>
    )}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {errorRoute("/", <Home />)}
          {errorRoute("/home", <Home />)}
          {errorRoute("/blog", <Blog />)}
          {errorRoute("/blog/:id", <BlogDetail />)}
          {errorRoute("/travel", <Travel />)}
          {errorRoute("/map", <Map />)}
          {errorRoute("/signin", <Signin />)}
          {errorRoute("/signup", <SignupForm />)}
          {errorRoute("/triplist", <Map />)}
          {errorRoute("/education", <Education />)}
          {errorRoute("/verify-email", <VerifyEmailCode />)}
          {errorRoute("/email-verification-pending", <EmailVerificationPending />)}
          {errorRoute("/manuals", <ManualsForm />)}

          {/* Admin-only routes */}
          {errorProtectedRoute("/edit-places", <EditPlaces />, ['Admin'])}
          {errorProtectedRoute("/add-place", <PlaceForm />, ['Admin'])}
          {errorProtectedRoute("/edit-blogs", <EditBlog />, ['Admin', 'Creator'])}
          {errorProtectedRoute("/edit-users", <EditUsers />, ['Admin'])}

          {/* Admin and Creator routes */}
          {errorProtectedRoute("/create-blog", <BlogForm />, ['Admin', 'Creator'])}
          {errorProtectedRoute("/edit-blog/:id", <BlogForm />, ['Admin', 'Creator'])}

          {errorRoute("/unauthorized", <Unauthorized />)}
        </Routes>
      </Suspense>
    </ErrorBoundry>
  )
}