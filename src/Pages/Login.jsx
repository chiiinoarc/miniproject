import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signInWithGoogle, signInWithEmail } from "../config/auth";
import heroBg from "../assets/Login_Hero.jpg";
import formBg from "../assets/Login_BG.jpg";
import logo from "../assets/logo.png";

const fonts = {
  montserrat: "'Montserrat', sans-serif",
  poppins: "'Poppins', sans-serif",
};

const colors = {
  primary: "#3F4F3B",
  primaryHover: "#2e3a2b",
  secondary: "#7B8070",
  accent: "#484B42",
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [signInHover, setSignInHover] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate("/CustomerDashboard");
    } catch (err) {
      setError(friendlyError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/CustomerDashboard");
    } catch (err) {
      console.error("Google sign-in error:", err.code, err.message);
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setError(friendlyError(err.code, err.message));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: fonts.poppins }}
      className="flex h-screen w-screen overflow-hidden"
    >
      {/* ── Left panel – hero image ── */}
      <div
        className="relative hidden lg:flex lg:w-[58%] xl:w-[62%] flex-col justify-end"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(32,43,28,0.88) 0%, rgba(32,43,28,0.35) 55%, rgba(32,43,28,0.10) 100%)",
          }}
        />

        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <button
            onClick={() => navigate("/")}
            title="Back to home"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 cursor-pointer"
            style={{ fontFamily: fonts.poppins, color: "#484B42", border: "1.5px solid rgba(197,212,106,0.45)" }}
          >
            <ArrowLeft size={13} />
            Back
          </button>
          <img
            src={logo}
            alt="Nadine's Diner"
            className="w-10 h-10 rounded-full object-cover"
            style={{ background: "#484B42" }}
          />
          <span
            style={{ fontFamily: fonts.montserrat, color: "#484B42" }}
            className="font-bold text-lg tracking-wide"
          >
            Nadine's Diner
          </span>
        </div>

        <div className="relative z-10 p-10 pb-12">
          <p
            style={{ fontFamily: fonts.montserrat, color: "#A8C5A0" }}
            className="text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Good food. Good vibes.
          </p>
          <h2
            style={{ fontFamily: fonts.montserrat, color: "#fff" }}
            className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4"
          >
            Where every meal
            <br />
            feels like home.
          </h2>
          <p
            style={{ color: "rgba(255,255,255,0.88)", fontFamily: fonts.poppins }}
            className="text-sm max-w-sm leading-relaxed"
          >
            Order your favourite wraps, bowls, and bites — fresh, fast,
            and made with love every single time.
          </p>
        </div>
      </div>

      {/* ── Right panel – login form ── */}
      <div
        className="flex flex-1 items-center justify-center px-8 py-10"
        style={{
          backgroundImage: `url(${formBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-[400px]">
          {/* Mobile brand mark */}
          <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
            <button
              onClick={() => navigate("/")}
              title="Back to home"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-[#6B7A2D]/10 active:scale-95 cursor-pointer"
              style={{ fontFamily: fonts.poppins, color: "#6B7A2D", border: `1.5px solid rgba(107,122,45,0.4)` }}
            >
              <ArrowLeft size={13} />
              Back
            </button>
            <img
              src={logo}
              alt="Nadine's Diner"
              className="w-10 h-10 rounded-full object-cover"
              style={{ background: "#fff" }}
            />
            <span
              style={{ fontFamily: fonts.montserrat, color: colors.primary }}
              className="font-bold text-lg"
            >
              Nadine's Diner
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{ fontFamily: fonts.montserrat, color: colors.primary }}
            className="text-3xl font-extrabold mb-1"
          >
            Welcome back
          </h1>
          <p
            style={{ color: colors.secondary, fontFamily: fonts.poppins }}
            className="text-sm mb-8"
          >
            Sign in to place your order
          </p>

          {/* Error banner */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: "rgba(220,53,69,0.1)",
                border: "1.5px solid rgba(220,53,69,0.3)",
                color: "#b91c1c",
                fontFamily: fonts.poppins,
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  fontFamily: fonts.montserrat,
                  color: colors.accent,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
                className="block mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail size={16} color={colors.secondary} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    fontFamily: fonts.poppins,
                    backgroundColor: "rgba(255,255,255,0.72)",
                    border: "1.5px solid rgba(63,79,59,0.2)",
                    color: colors.primary,
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl placeholder:text-gray-400
                    focus:border-[#3F4F3B] focus:shadow-[0_0_0_3px_rgba(63,79,59,0.12)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  fontFamily: fonts.montserrat,
                  color: colors.accent,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
                className="block mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={16} color={colors.secondary} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    fontFamily: fonts.poppins,
                    backgroundColor: "rgba(255,255,255,0.72)",
                    border: "1.5px solid rgba(63,79,59,0.2)",
                    color: colors.primary,
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  className="w-full pl-10 pr-11 py-3 rounded-xl placeholder:text-gray-400
                    focus:border-[#3F4F3B] focus:shadow-[0_0_0_3px_rgba(63,79,59,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: colors.secondary, lineHeight: 0 }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mt-1">
              <label
                style={{ fontFamily: fonts.poppins, color: colors.secondary }}
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: colors.primary }}
                  className="w-4 h-4 rounded"
                />
                Remember me
              </label>
              <a
                href="#"
                style={{
                  color: colors.primary,
                  fontFamily: fonts.poppins,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
                className="hover:underline cursor-pointer"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setSignInHover(true)}
              onMouseLeave={() => setSignInHover(false)}
              style={{
                backgroundColor: signInHover && !loading ? colors.primaryHover : colors.primary,
                fontFamily: fonts.montserrat,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                transform: signInHover && !loading ? "translateY(-2px)" : "translateY(0)",
                boxShadow: signInHover && !loading
                  ? "0 8px 20px rgba(63,79,59,0.35)"
                  : "0 2px 8px rgba(63,79,59,0.15)",
                opacity: loading ? 0.7 : 1,
                transition: "background-color 0.2s, transform 0.2s, box-shadow 0.2s, opacity 0.2s",
              }}
              className="w-full mt-2 py-3.5 rounded-xl text-white font-bold uppercase flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && <Spinner />}
              {loading ? "Signing in…" : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <hr style={{ borderColor: "rgba(63,79,59,0.18)" }} className="flex-1" />
              <span
                style={{ color: colors.secondary, fontFamily: fonts.poppins }}
                className="text-xs"
              >
                or
              </span>
              <hr style={{ borderColor: "rgba(63,79,59,0.18)" }} className="flex-1" />
            </div>

            {/* Google button */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              onMouseEnter={() => setGoogleHover(true)}
              onMouseLeave={() => setGoogleHover(false)}
              style={{
                backgroundColor: googleHover && !googleLoading ? "#ffffff" : "rgba(255,255,255,0.75)",
                border: `1.5px solid ${googleHover ? "rgba(63,79,59,0.45)" : "rgba(63,79,59,0.22)"}`,
                fontFamily: fonts.poppins,
                color: colors.accent,
                fontSize: "0.88rem",
                transform: googleHover && !googleLoading ? "translateY(-2px)" : "translateY(0)",
                boxShadow: googleHover && !googleLoading
                  ? "0 8px 20px rgba(63,79,59,0.15)"
                  : "0 2px 6px rgba(63,79,59,0.06)",
                opacity: googleLoading ? 0.7 : 1,
                transition: "background-color 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s, opacity 0.2s",
              }}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Spinner color={colors.secondary} />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>
          </form>

          {/* Sign up link */}
          <p
            style={{ fontFamily: fonts.poppins, color: colors.secondary }}
            className="text-sm text-center mt-7"
          >
            Don't have an account?{" "}
            <a
              href="#"
              style={{ color: colors.primary, fontWeight: 600 }}
              className="hover:underline cursor-pointer"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── helpers ── */

function Spinner({ color = "#fff" }) {
  return (
    <svg
      className="animate-spin"
      style={{ color }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function friendlyError(code, message = "") {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled. Enable it in the Firebase Console.";
    case "auth/unauthorized-domain":
      return "This domain is not authorised. Add it in Firebase Console → Authentication → Settings.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Allow popups for this site and try again.";
    case "auth/internal-error":
      return "Firebase internal error. Check your Firebase project configuration.";
    default:
      return message || "Something went wrong. Please try again.";
  }
}

export default Login;
