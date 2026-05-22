import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./authStore";
import { useEffect, useState } from "react";
import axios from "axios";

// ── Splash Loader ─────────────────────────────────────────────────────────────
const SplashLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
    <style>{`
      @keyframes spinRing  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
      @keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse     { 0%,100%{ transform:scale(1); }  50%{ transform:scale(1.07); } }
      @keyframes dotBounce { 0%,80%,100%{ transform:translateY(0); } 40%{ transform:translateY(-8px); } }
    `}</style>

    {/* Outer decorative ring */}
    <div className="relative w-24 h-24 mb-6">
      {/* Static track */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="#eef0f7"
          strokeWidth="5"
        />
      </svg>

      {/* Spinning arc */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 96 96"
        style={{ animation: "spinRing 1.1s linear infinite" }}
      >
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="#4eb956"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="264"
          strokeDashoffset="200"
          style={{ transformOrigin: "center" }}
        />
      </svg>

      {/* Second slower arc */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 96 96"
        style={{ animation: "spinRing 2s linear infinite reverse" }}
      >
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="#1e2558"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="264"
          strokeDashoffset="220"
          style={{ transformOrigin: "center" }}
        />
      </svg>

      {/* Center logo badge */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "pulse 2.4s ease-in-out infinite" }}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#1e2558] flex items-center justify-center shadow-lg">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4eb956"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <line x1="10" y1="14" x2="14" y2="14" />
          </svg>
        </div>
      </div>
    </div>

    {/* Brand name */}
    <div
      className="text-xl font-extrabold text-[#1e2558] tracking-tight mb-1"
      style={{ animation: "fadeSlide 0.4s ease 0.1s both" }}
    >
      Jobs<span className="text-[#4eb956]">Plus</span>
    </div>

    {/* Status text */}
    <p
      className="text-sm font-semibold text-[#1e2558]/70 mb-4"
      style={{ animation: "fadeSlide 0.4s ease 0.2s both" }}
    >
      Verifying your session…
    </p>

    {/* Dot loader */}
    <div
      className="flex items-center gap-1.5"
      style={{ animation: "fadeSlide 0.4s ease 0.3s both" }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#4eb956]"
          style={{
            animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>

    {/* Bottom gradient bar */}
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1e2558] via-[#4eb956] to-[#1e2558]" />
  </div>
);

// ── Auth verify hook ──────────────────────────────────────────────────────────
const useAuthVerify = () => {
  const {
    tokens,
    refreshTokens,
    fetchMe,
    logoutLocal,
    setAuthHeader,
    isAuthenticated,
  } = useAuthStore();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!tokens?.accessToken) {
        if (!cancelled) setStatus("fail");
        return;
      }

      setAuthHeader(tokens.accessToken);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.accessToken}`;

      const meResult = await fetchMe();
      if (cancelled) return;

      if (meResult?.success) {
        setStatus("ok");
        return;
      }

      if (meResult?.unauthorized) {
        const refreshResult = await refreshTokens();
        if (cancelled) return;

        if (refreshResult?.success) {
          const retry = await fetchMe();
          if (cancelled) return;
          if (retry?.success) {
            setStatus("ok");
            return;
          }
        }

        logoutLocal(false);
        setStatus("fail");
        return;
      }

      // Network error — trust local state
      setStatus(isAuthenticated ? "ok" : "fail");
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
};

// ── AdminGuard ────────────────────────────────────────────────────────────────
// Only users with role === "admin" can pass through.
// Everyone else is redirected to /login.
export const AdminGuard = () => {
  const status = useAuthVerify();
  const user = useAuthStore((s) => s.user);

  // Still checking session
  if (status === "checking") return <SplashLoader />;

  // Not authenticated → go to login
  if (status === "fail") return <Navigate to="/login" replace />;

  // Authenticated but NOT admin → redirect non-admins away
  if (user?.role !== "admin") return <Navigate to="/login" replace />;

  // ✅ Authenticated admin → render child routes
  return <Outlet />;
};

export default AdminGuard;
