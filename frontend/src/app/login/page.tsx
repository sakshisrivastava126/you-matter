"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Heart, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user, isLoading } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      router.replace("/dashboard");
    } else {
      setError(result.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-auth-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CFE8F3] to-[#E6DDF5] flex items-center justify-center shadow-[0_4px_20px_rgba(74,111,165,.18)] mb-4">
            <Heart className="w-7 h-7 text-[#4A6FA5] fill-[#4A6FA5]" />
          </div>
          <h1 className="text-3xl font-bold text-[#333333] tracking-tight">
            You Matter
          </h1>
          <p className="text-[#B8C0CC] text-sm mt-1.5">
            Your mental health journey starts here
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8EDF2] rounded-2xl p-8 shadow-[0_4px_24px_rgba(74,111,165,.10)]">
          <h2 className="text-xl font-semibold text-[#333333] mb-1">Welcome back</h2>
          <p className="text-[#B8C0CC] text-sm mb-7">
            Sign in to continue to your account
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-[#5A6475]">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8C0CC] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#E8EDF2] hover:border-[#D1DAE5] rounded-xl pl-10 pr-12 py-3 text-[#333333] placeholder:text-[#B8C0CC] focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/20 focus:border-[#4A6FA5]/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8C0CC] hover:text-[#5A6475] transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={submitting}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-[#B8C0CC] text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#4A6FA5] hover:text-[#3A5A8F] font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-[#B8C0CC] text-xs mt-6">
          A safe, private space for your mental wellness.
        </p>
      </div>
    </div>
  );
}
