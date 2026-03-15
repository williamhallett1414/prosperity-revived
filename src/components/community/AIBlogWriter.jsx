import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Wand2, Pencil, Check, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { useQueryClient } from '@tanstack/react-query';

const TOPICS = [
  { value: 'faith',           label: 'Faith',          emoji: '✝️' },
  { value: 'fitness',         label: 'Fitness',         emoji: '💪' },
  { value: 'nutrition',       label: 'Nutrition',       emoji: '🥗' },
  { value: 'mental_health',   label: 'Mental Health',   emoji: '🧘' },
  { value: 'personal_growth', label: 'Personal Growth', emoji: '🌱' },
  { value: 'relationships',   label: 'Relationships',   emoji: '💕' },
  { value: 'general',         label: 'General',         emoji: '✨' },
];

const TONES = [
  { value: 'inspirational',  label: 'Inspirational' },
  { value: 'informative',    label: 'Informative' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'devotional',     label: 'Devotional' },
  { value: 'motivational',   label: 'Motivational' },
];

const SUGGESTED_TOPICS = [
  'How faith shapes my daily wellness routine',
  '5 small habits that changed my life',
  'Finding peace in the chaos of everyday life',
  'What I learned from 30 days of clean eating',
  'The power of community in personal growth',
  'Lessons from my fitness journey',
  'How to rebuild after burnout',
  'The link between spirituality and mental health',
];

const REFINE_SHORTCUTS = [
  'Make it shorter',
  'Add a personal story',
  'More devotional tone',
  'Add bullet points',
  'Stronger ending',
  'Add a scripture quote',
];

// ─── Chip button ──────────────────────────────────────────────────────────────
function Chip({ selected, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
        selected
          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
          : 'bg-white text-[#0A1A2F]/50 border-[#F2F6FA] hover:border-[#FAD98D]/50'
      }`}>
      {children}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIBlogWriter({ user, onClose, onPublished }) {
  const [step,               setStep]               = useState('setup');
  const [title,              setTitle]              = useState('');
  const [topic,              setTopic]              = useState('personal_growth');
  const [tone,               setTone]               = useState('inspirational');
  const [keywords,           setKeywords]           = useState('');
  const [content,            setContent]            = useState('');
  const [excerpt,            setExcerpt]            = useState('');
  const [editMode,           setEditMode]           = useState(false);
  const [isGenerating,       setIsGenerating]       = useState(false);
  const [isRefining,         setIsRefining]         = useState(false);
  const [refineInstruction,  setRefineInstruction]  = useState('');
  const [isPublishing,       setIsPublishing]       = useState(false);
  const queryClient = useQueryClient();

  const generate = async () => {
    if (!title.trim()) { toast.error('Please enter a title or idea first'); return; }
    setIsGenerating(true);
    setStep('generating');
    try {
      const topicLabel = TOPICS.find(t => t.value === topic)?.label || topic;
      const toneLabel  = TONES.find(t  => t.value === tone )?.label || tone;
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a compelling blog post for a wellness and faith community app called "Prosperity Revived".

Title: "${title}"
Topic: ${topicLabel}
Tone: ${toneLabel}
${keywords ? `Keywords to include: ${keywords}` : ''}

Requirements:
- Warm, authentic, personal voice — as if written by a real community member
- 400–600 words
- Markdown formatting (## subheadings, **bold**, bullet lists where natural)
- Engaging opening hook — NO generic "In today's world..." openers
- Include a personal insight or moment
- End with an actionable takeaway or reflective question
- Tone: ${toneLabel.toLowerCase()}, grounded, human — NO AI clichés

After the post, on a new line write exactly:
EXCERPT: [one compelling sentence that makes someone want to read, max 25 words]`,
      });

      const parts = result.split('\nEXCERPT:');
      setContent(parts[0].trim());
      setExcerpt(parts[1] ? parts[1].trim() : result.substring(0, 120) + '...');
      setStep('edit');
    } catch {
      toast.error('Failed to generate — please try again');
      setStep('setup');
    }
    setIsGenerating(false);
  };

  const refine = async () => {
    if (!refineInstruction.trim()) return;
    setIsRefining(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Here is a blog post:\n\n${content}\n\nRefine it with this instruction: "${refineInstruction}"\n\nReturn ONLY the revised post in markdown. No commentary outside the post.`,
      });
      setContent(result.trim());
      setRefineInstruction('');
      toast.success('Post refined ✨');
    } catch {
      toast.error('Failed to refine');
    }
    setIsRefining(false);
  };

  const publish = async () => {
    setIsPublishing(true);
    try {
      await base44.entities.BlogPost.create({
        title: title.trim(),
        content,
        excerpt,
        topic,
        tone,
        author_name: user?.full_name || 'Community Member',
        is_published: true,
        likes: 0,
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Published to the community! 🎉');
      onPublished?.();
      onClose();
    } catch {
      toast.error('Failed to publish');
    }
    setIsPublishing(false);
  };

  // "Redo" returns to setup but keeps title/topic/tone so you can tweak, not restart cold
  const handleRedo = () => {
    setContent('');
    setExcerpt('');
    setEditMode(false);
    setStep('setup');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[94dvh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] text-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
          {step === 'edit' && (
            <button onClick={handleRedo}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2 flex-1">
            <Wand2 className="w-5 h-5 text-[#FAD98D]" />
            <h2 className="font-bold text-base">
              {step === 'setup' ? 'AI Blog Writer' : step === 'generating' ? 'Writing your post…' : 'Review & Publish'}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center bg-[#0A1A2F]/5 px-5 py-2 gap-3 flex-shrink-0">
          {['Setup', 'Generate', 'Publish'].map((s, i) => {
            const stepIdx = step === 'setup' ? 0 : step === 'generating' ? 1 : 2;
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${i <= stepIdx ? 'text-[#c9a227]' : 'text-[#0A1A2F]/25'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${i <= stepIdx ? 'bg-[#c9a227] text-white' : 'bg-[#F2F6FA] text-[#0A1A2F]/30'}`}>
                    {i + 1}
                  </div>
                  {s}
                </div>
                {i < 2 && <div className={`flex-1 h-px ${i < stepIdx ? 'bg-[#c9a227]/40' : 'bg-[#F2F6FA]'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── Setup step ── */}
          {step === 'setup' && (
            <div className="p-5 space-y-5">
              {/* Suggested topics */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">✨ Topic ideas</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map(s => (
                    <button key={s} onClick={() => setTitle(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        title === s
                          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                          : 'bg-[#F2F6FA] text-[#0A1A2F]/55 border-[#F2F6FA] hover:border-[#FAD98D]/40'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-1.5">Blog title or main idea *</p>
                <input type="text"
                  placeholder="e.g. How my faith transformed my fitness journey"
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 transition-colors"
                />
              </div>

              {/* Topic */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Topic</p>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(t => (
                    <Chip key={t.value} selected={topic === t.value} onClick={() => setTopic(t.value)}>
                      {t.emoji} {t.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Writing tone</p>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button key={t.value} onClick={() => setTone(t.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                        tone === t.value
                          ? 'bg-[#FAD98D] text-[#0A1A2F] border-[#FAD98D]'
                          : 'bg-white text-[#0A1A2F]/50 border-[#F2F6FA] hover:border-[#FAD98D]/40'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-1.5">
                  Keywords <span className="normal-case font-normal text-[#0A1A2F]/25">(optional)</span>
                </p>
                <input type="text"
                  placeholder="e.g. prayer, discipline, morning routine"
                  value={keywords} onChange={e => setKeywords(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 transition-colors"
                />
              </div>
            </div>
          )}

          {/* ── Generating step ── */}
          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center px-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FAD98D] to-[#c9a227] rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <p className="font-bold text-[#0A1A2F] mb-1">Writing your post…</p>
                <p className="text-sm text-[#0A1A2F]/40">Crafting something meaningful just for you ✨</p>
              </div>
            </div>
          )}

          {/* ── Edit step ── */}
          {step === 'edit' && (
            <div className="p-5 space-y-4">
              {/* Title edit */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-1.5">Title</p>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] text-sm font-bold text-[#0A1A2F] focus:outline-none focus:border-[#FAD98D]/60 transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Content</p>
                  <button onClick={() => setEditMode(e => !e)}
                    className="text-xs font-bold text-[#c9a227] hover:opacity-70 transition-opacity flex items-center gap-1">
                    {editMode ? <><BookOpen className="w-3 h-3" /> Preview</> : <><Pencil className="w-3 h-3" /> Edit raw</>}
                  </button>
                </div>
                {editMode ? (
                  <textarea value={content} onChange={e => setContent(e.target.value)}
                    rows={12}
                    className="w-full resize-none px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] text-xs font-mono text-[#0A1A2F] focus:outline-none focus:border-[#FAD98D]/60 transition-colors leading-relaxed"
                  />
                ) : (
                  <div className="border border-[#F2F6FA] rounded-xl p-4 bg-[#F2F6FA] min-h-[200px] prose prose-sm max-w-none overflow-auto text-[#0A1A2F]/80 prose-headings:text-[#0A1A2F] prose-headings:font-bold">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-1.5">Excerpt (preview text)</p>
                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                  className="w-full resize-none px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] text-sm text-[#0A1A2F] focus:outline-none focus:border-[#FAD98D]/60 transition-colors leading-relaxed"
                />
              </div>

              {/* Refine with AI */}
              <div className="bg-white rounded-xl p-4 border border-[#FAD98D]/25">
                <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest mb-2.5">🪄 Refine with AI</p>
                <div className="flex gap-2 mb-2">
                  <input type="text"
                    value={refineInstruction} onChange={e => setRefineInstruction(e.target.value)}
                    placeholder='"Make it more personal" or "Add a scripture quote"'
                    className="flex-1 px-3 py-2 rounded-lg border border-[#F2F6FA] bg-white text-xs text-[#0A1A2F] focus:outline-none focus:border-[#FAD98D]/60 transition-colors"
                    onKeyDown={e => e.key === 'Enter' && refine()}
                  />
                  <button onClick={refine} disabled={isRefining || !refineInstruction.trim()}
                    className="px-3 py-2 rounded-lg bg-[#FAD98D] text-[#0A1A2F] font-bold text-xs disabled:opacity-40 hover:bg-[#c9a227] transition-colors flex items-center gap-1">
                    {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {REFINE_SHORTCUTS.map(s => (
                    <button key={s} onClick={() => setRefineInstruction(s)}
                      className="text-[11px] bg-white text-[#0A1A2F]/55 px-2.5 py-1 rounded-lg border border-[#F2F6FA] hover:border-[#FAD98D]/40 transition-colors font-medium">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="border-t border-[#F2F6FA] px-5 py-4 flex gap-3 flex-shrink-0 bg-white">
          {step === 'setup' && (
            <>
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#F2F6FA] text-[#0A1A2F]/50 font-semibold text-sm hover:bg-[#F2F6FA] transition-colors">
                Cancel
              </button>
              <button onClick={generate} disabled={!title.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate Post
              </button>
            </>
          )}
          {step === 'edit' && (
            <button onClick={publish} disabled={isPublishing}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isPublishing ? 'Publishing…' : 'Publish to Community'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
