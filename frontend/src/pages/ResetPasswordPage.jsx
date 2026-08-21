import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, Eye, EyeOff, AlertCircle, CheckCircle, LockKeyhole } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const ResetPasswordPage = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Inline validation
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passwordTooShort = password.length > 0 && password.length < 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.put(`/api/auth/resetpassword/${resettoken}`, { password });
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. The link may have expired.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.08] bg-[size:80px_80px]" />
          <div className="absolute top-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-md text-center relative z-10">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
            Create a new password
          </h1>
          <p className="text-primary-100 text-lg mb-10 leading-relaxed">
            Choose something strong and unique. Your new password will be active immediately after you save it.
          </p>
          <div className="space-y-5 text-left">
            {[
              "At least 6 characters required",
              "Mix letters, numbers & symbols",
              "Your data stays encrypted",
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-4 text-primary-50">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/20">
                  <span className="text-white text-sm font-bold">{idx + 1}</span>
                </div>
                <span className="font-medium text-lg">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">

          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="lg:hidden w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-600/20">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">New Password</h2>
            <p className="mt-3 text-gray-600 text-base">Set a new password for your ShopFlow account.</p>
          </div>

          {/* Success State */}
          {done ? (
            <div className="animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Password updated!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your password has been reset successfully.
                  <br />
                  Redirecting you to login...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 animate-slide-up shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-red-900">Reset Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    {error.toLowerCase().includes("expired") || error.toLowerCase().includes("invalid") ? (
                      <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        Request a new link →
                      </Link>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-bold text-gray-900 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      id="new-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`input text-base py-3.5 pl-12 pr-12 ${passwordTooShort ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 flex items-center justify-center"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordTooShort && (
                    <p className="mt-1 text-xs text-red-600">Password must be at least 6 characters.</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-900 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`input text-base py-3.5 pl-12 pr-12 ${passwordMismatch ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 flex items-center justify-center"
                      title={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                  )}
                </div>

                <button
                  id="reset-password-submit"
                  type="submit"
                  disabled={submitting || passwordMismatch || passwordTooShort}
                  className="btn btn-primary w-full text-base font-bold py-4 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Saving new password...
                    </>
                  ) : (
                    "Save New Password"
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Link expired?{" "}
                  <Link to="/forgot-password" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                    Request a new one
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
