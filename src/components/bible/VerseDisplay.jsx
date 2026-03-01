import React from 'react';
import { BookOpen } from 'lucide-react';

export default function VerseDisplay({ reference, text }) {
  return (
    <div className="my-4 p-4 bg-gradient-to-r from-[#FAD98D]/10 to-[#FFF8E7] rounded-lg border-l-4 border-[#D9B878]">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-[#8a6e1a] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#0A1A2F] mb-2">
            {reference}
          </p>
          <p className="text-sm text-[#0A1A2F]/75 italic leading-relaxed">
            "{text}"
          </p>
        </div>
      </div>
    </div>
  );
}