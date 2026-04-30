"use client";

import React from "react";
import { Star, Mail, MessageCircle, Award, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import type { User } from "@/types";

interface SpecialistCardProps {
  specialist: User;
}

// Deterministic fake rating and specialty seeded by user id
const getSpecialistMeta = (id: string) => {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const specialties = [
    "Anxiety & Depression",
    "Trauma & PTSD",
    "Relationship Counselling",
    "Stress Management",
    "Cognitive Behaviour Therapy",
    "Grief & Loss",
  ];
  const rating = (3.8 + (hash % 12) * 0.1).toFixed(1);
  const reviews = 20 + (hash % 80);
  const experience = 2 + (hash % 15);
  const specialty = specialties[hash % specialties.length];
  return { rating, reviews, experience, specialty };
};

export const SpecialistCard = ({ specialist }: SpecialistCardProps) => {
  const meta = getSpecialistMeta(specialist._id);

  return (
    <Card className="hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 group">
      <CardBody className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar name={specialist.userName} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base truncate">
              {specialist.userName}
            </h3>
            <p className="text-violet-400 text-sm mt-0.5">{meta.specialty}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(Number(meta.rating))
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
              <span className="text-slate-400 text-xs ml-1">
                {meta.rating} ({meta.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5">
            <Award className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">{meta.experience}+ yrs</p>
              <p className="text-slate-500 text-xs">Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5">
            <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">Available</p>
              <p className="text-slate-500 text-xs">Mon – Fri</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            id={`book-specialist-${specialist._id}`}
            onClick={() =>
              alert(`Booking with ${specialist.userName} — integrate scheduling here!`)
            }
          >
            <MessageCircle className="w-4 h-4" />
            Book Session
          </Button>
          <Button
            variant="secondary"
            size="sm"
            id={`email-specialist-${specialist._id}`}
            onClick={() =>
              (window.location.href = `mailto:${specialist.email}`)
            }
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
