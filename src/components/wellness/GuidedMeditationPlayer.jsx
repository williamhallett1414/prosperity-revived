import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import MeditationSessionCard from "./MeditationSessionCard";
import GuidedMeditationSession from "./GuidedMeditationSession";
import { Sparkles } from "lucide-react";

const MEDITATION_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "breathing", label: "Breathing" },
  { id: "stress_relief", label: "Stress Relief" },
  { id: "sleep", label: "Sleep" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "compassion", label: "Compassion" },
  { id: "gratitude", label: "Gratitude" },
  { id: "healing", label: "Emotional Healing" },
  { id: "focus", label: "Focus" },
  { id: "confidence", label: "Confidence" },
  { id: "reflection", label: "Reflection" }
];

export default function GuidedMeditationPlayer() {
  const [activeSession, setActiveSession] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: meditations = [], isLoading } = useQuery({
    queryKey: ["meditations"],
    queryFn: () => base44.entities.Meditation.list()
  });

  const filtered = meditations.filter((m) =>
    selectedCategory === "all" ? true : m.category === selectedCategory
  );

  const handleBeginSession = (session) => {
    if (session.status !== "ready") {
      alert("Audio is still being generated for this session.");
      return;
    }
    setActiveSession(session);
  };

  const readyCount = meditations.filter(m => m.status === "ready").length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Guided Sessions
          </h3>
          <span className="text-sm text-gray-400">
            {readyCount} / {meditations.length} ready
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {MEDITATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading meditations...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((session) => (
              <MeditationSessionCard
                key={session.id}
                session={session}
                onBegin={handleBeginSession}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No meditations in this category yet.</p>
          </div>
        )}
      </div>

      {activeSession && (
        <GuidedMeditationSession
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </>
  );
}