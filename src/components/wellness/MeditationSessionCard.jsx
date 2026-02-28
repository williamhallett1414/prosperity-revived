import React from "react";
import { Play, Clock } from "lucide-react";

const statusColors = {
  pending: "bg-gray-500",
  generating: "bg-yellow-500",
  ready: "bg-green-500",
  error: "bg-red-500"
};

export default function MeditationSessionCard({ session, onBegin }) {
  const statusLabel =
    session.status === "ready"
      ? "Ready"
      : session.status === "generating"
      ? "Generating…"
      : session.status === "error"
      ? "Error"
      : "Pending";

  return (
    <div
      className="bg-white/5 rounded-2xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => onBegin(session)}
    >
      {session.image_url && (
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={session.image_url}
            alt={session.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1 bg-black/70 rounded-full text-xs font-semibold text-white">
            <span className={`inline-block w-2 h-2 rounded-full ${statusColors[session.status]}`} />
            {session.duration_minutes}m
          </span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">
          {session.title}
        </h3>

        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {session.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{session.category}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBegin(session);
          }}
          className={`w-full font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition ${
            session.status === "ready"
              ? "bg-[#c9a227] hover:bg-[#b89320] text-white"
              : "bg-gray-700 text-gray-300 cursor-not-allowed"
          }`}
          disabled={session.status !== "ready"}
        >
          <Play className="w-4 h-4" />
          {session.status === "ready" ? "Begin Session" : "Audio Not Ready"}
        </button>
      </div>
    </div>
  );
}