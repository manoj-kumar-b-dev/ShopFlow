import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axiosInstance.post("/api/auth/forgotpassword", { email });
      setSent(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
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
            Forgot your password?
          </h1>
          <p className="text-primary-100 text-lg mb-10 leading-relaxed">
            No worries. Enter your email and we&apos;ll send you a secure reset link right away.
          </p>
          <div className="space-y-5 text-left">
            {[
              "Reset link expires in 10 minutes",
              "Secure token — single use only",
              "Delivered instantly to your inbox",
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Reset password</h2>
            <p className="mt-3 text-gray-600 text-base">
              Remember it?{" "}
              <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to login
              </Link>
            </p>
          </div>

          {/* Success State */}
          {sent ? (
            <div className="animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check your inbox!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-bold text-gray-900">{email}</span>.
                  <br />
                  The link expires in <strong>10 minutes</strong>.
                </p>
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                Didn&apos;t get it? Check your spam folder or{" "}
                <button
                  onClick={() => { setSent(false); setError(""); }}
                  className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  try again
                </button>.
              </p>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 animate-slide-up shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-red-900">Request Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input text-base py-3.5 pl-12"
                      placeholder="you@example.com"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the email address associated with your ShopFlow account.
                  </p>
                </div>

                <button
                  id="forgot-password-submit"
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full text-base font-bold py-4 shadow-md hover:shadow-lg"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <Link
                  to="/login"
                  className="btn bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 w-full text-base font-bold py-4 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
