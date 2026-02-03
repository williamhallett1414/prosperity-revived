import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ContentModeration({ content, onFlag }) {
  const [isFlagged, setIsFlagged] = useState(false);
  const [checking, setChecking] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    checkContent();
  }, [content]);

  const checkContent = async () => {
    setChecking(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this community post for potentially sensitive or inappropriate content. Consider: hate speech, harassment, explicit content, misinformation about faith, or harmful advice. Content: "${content}"`,
        response_json_schema: {
          type: "object",
          properties: {
            is_inappropriate: { type: "boolean" },
            severity: { type: "string", enum: ["none", "low", "medium", "high"] },
            reason: { type: "string" }
          }
        }
      });
      
      if (result.is_inappropriate && (result.severity === 'medium' || result.severity === 'high')) {
        setIsFlagged(true);
        setReason(result.reason);
        if (onFlag) {
          onFlag({ content, reason: result.reason, severity: result.severity });
        }
      }
    } catch (error) {
      console.error('Content moderation failed', error);
    }
    setChecking(false);
  };

  if (!isFlagged) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-amber-900">Content Under Review</p>
          <p className="text-xs text-amber-700 mt-1">
            This post has been flagged for review: {reason}
          </p>
        </div>
      </div>
    </div>
  );
}