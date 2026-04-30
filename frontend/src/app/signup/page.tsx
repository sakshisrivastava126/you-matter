"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Calendar, Shield, Heart, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthContext } from "@/context/AuthContext";

const ROLES = [
  { value: "user", label: "User — I'm seeking support" },
  { value: "specialist", label: "Specialist — I'm a professional" },
];

export default function SignupPage() {
  const { signup, user, isLoading } = useAuthContext();
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    age: "",
    role: "user",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [user, isLoading, router]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { userName, email, password, age, role } = form;
    if (!userName || !email || !password || !age || !role) {
      setError("Please fill in all fields.");
      return;
    }
    if (Number(age) < 13 || Number(age) > 100) {
      setError("Please enter a valid age (13–100).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await signup({ userName, email, password, age: Number(age), role });
    setSubmitting(false);

    if (result.success) {
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => router.replace("/login"), 1500);
    } else {
      setError(result.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-auth-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-4">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">You Matter</h1>
          <p className="text-slate-400 text-sm mt-1.5">Create your free account</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Get started</h2>
          <p className="text-slate-400 text-sm mb-7">
            Join our community of support
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl mb-5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="signup-username"
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={form.userName}
              onChange={set("userName")}
              icon={<User className="w-4 h-4" />}
            />

            <Input
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              icon={<Mail className="w-4 h-4" />}
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set("password")}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="signup-age"
                label="Age"
                type="number"
                placeholder="25"
                min="13"
                max="100"
                value={form.age}
                onChange={set("age")}
                icon={<Calendar className="w-4 h-4" />}
              />

              {/* Role select */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-role" className="text-sm font-medium text-slate-300">
                  Role
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Shield className="w-4 h-4" />
                  </span>
                  <select
                    id="signup-role"
                    value={form.role}
                    onChange={set("role")}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value} className="bg-slate-900">
                        {r.value.charAt(0).toUpperCase() + r.value.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button
              id="signup-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={submitting}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
