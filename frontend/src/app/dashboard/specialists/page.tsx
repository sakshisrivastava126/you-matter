"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Stethoscope, Search, AlertCircle, RefreshCw, Users } from "lucide-react";
import { SpecialistCard } from "@/components/specialists/SpecialistCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { fetchSpecialists } from "@/services/authService";
import type { User } from "@/types";

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchSpecialists();
      if (res.success) {
        setSpecialists(res.specialists);
      } else {
        setError(res.message || "Could not load specialists.");
      }
    } catch {
      setError("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      specialists.filter((s) =>
        s.userName.toLowerCase().includes(search.toLowerCase())
      ),
    [specialists, search]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-400" />
            Specialists
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect with certified mental health professionals
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            id="specialist-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users className="w-4 h-4" />
          <span>
            {filtered.length} specialist{filtered.length !== 1 ? "s" : ""} available
            {search && ` for "${search}"`}
          </span>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <p className="text-white font-medium">{error}</p>
            <p className="text-slate-500 text-sm mt-1">
              Make sure the backend is running on port 4444.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={load} id="specialists-retry-btn">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Stethoscope className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <p className="text-white font-medium">
              {search ? "No specialists match your search" : "No specialists registered yet"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {search
                ? "Try a different name"
                : "Specialists can sign up with the 'Specialist' role."}
            </p>
          </div>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch("")} id="specialists-clear-search-btn">
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((specialist) => (
            <SpecialistCard key={specialist._id} specialist={specialist} />
          ))}
        </div>
      )}
    </div>
  );
}
