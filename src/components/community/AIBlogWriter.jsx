import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, RefreshCw, Pencil, Check, ChevronDown, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const TOPICS = [
  { value: 'faith',           label: '✝️ Faith' },
  { value: 'fitness',         label: '💪 Fitness' },
  { value: 'nutrition',       label: '🥗 Nutrition' },
  { value: 'mental_health',   label: '🧘 Mental Health' },
  { value: 'personal_growth', label: '🌱 Personal Growth' },
  { value: 'relationships',   label: '💕 Relationships' },
  { value: 'general',         label: '✨ General' },
];

const TONES = [
  { value: 'inspirational',  label: 'Inspirational' },
  { value: 'informative',    label: 'Informative' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'devotional',     label: 'Devotional' },
  { value: 'motivational',   label: 'Motivational' },
];

const SUGGESTED_TOPICS = [
  "How faith shapes my daily wellness routine",
  "5 small habits that changed my life",
  "Finding peace in the chaos of everyday life",
  "What I learned from 30 days of clean eating",
  "The power of community in personal growth",
  "Lessons from my fitness journey",
  "How to rebuild after burnout",
  "The link between spirituality and mental health",
];

export default function AIBlogWriter({ user, onClose, onPublished }) {
  const [step, setStep] = useState('setup'); // setup | generating | edit | preview
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('personal_growth');
  const [tone, setTone] = useState('inspirational');
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const generate = async () => {
    if (!title.trim()) { toast.error('Please enter a title or topic first'); return; }
    setIsGenerating(true);
    setStep('generating');
    try {
      const topicLabel = TOPICS.find(t => t.value === topic)?.label || topic;
      const toneLabel  = TONES.find(t => t.value === tone)?.label || tone;
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a compelling blog post for a wellness and faith community app called "Prosperity Revived".

Title: "${title}"
Topic category: ${topicLabel}
Tone: ${toneLabel}
${keywords ? `Key themes / keywords to include: ${keywords}` : ''}

Requirements:
- Write in a warm, authentic, personal voice — as if written by a real community member sharing their journey
- Length: 400-600 words
- Use markdown formatting (## subheadings, **bold** for emphasis, bullet lists where appropriate)
- Start with an engaging opening hook (no generic "In today's world..." openings)
- Include a personal insight or story moment
- End with an actionable takeaway or reflective question for readers
- Tone should be ${toneLabel.toLowerCase()} but always grounded and human
- Do NOT use AI-sounding clichés

After the blog post, on a NEW LINE write exactly:
EXCERPT: [one compelling sentence that makes someone want to read the full post, max 25 words]`,
        add_context_from_internet: false,
      });

      // Split content and excerpt
      const parts = result.split('\nEXCERPT:');
      const postContent = parts[0].trim();
      const postExcerpt = parts[1] ? parts[1].trim() : postContent.substring(0, 120) + '...';

      setContent(postContent);
      setExcerpt(postExcerpt);
      setStep('edit');
    } catch (e) {
      toast.error('Failed to generate post');
      setStep('setup');
    } finally {
      setIsGenerating(false);
    }
  };

  const refine = async () => {
    if (!refineInstruction.trim()) return;
    setIsRefining(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Here is a blog post:\n\n${content}\n\nPlease refine it with this instruction: "${refineInstruction}"\n\nReturn ONLY the revised blog post content in markdown. Do not add any explanation or commentary outside the post.`,
        add_context_from_internet: false,
      });
      setContent(result.trim());
      setRefineInstruction('');
      toast.success('Post refined!');
    } catch (e) {
      toast.error('Failed to refine');
    } finally {
      setIsRefining(false);
    }
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
      toast.success('Blog post published! 🎉');
      onPublished?.();
      onClose();
    } catch (e) {
      toast.error('Failed to publish');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3C4E53] to-[#5a7480] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            <h2 className="font-bold text-lg">AI Blog Writer</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* STEP: Setup */}
          {(step === 'setup') && (
            <div className="p-5 space-y-5">
              {/* Suggested Topics */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">✨ Suggested topics</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map(s => (
                    <button
                      key={s}
                      onClick={() => setTitle(s)}
                      className="text-xs bg-gray-100 hover:bg-[#3C4E53]/10 text-gray-700 px-3 py-1.5 rounded-full transition-colors border border-gray-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Blog title or main idea *</label>
                <Input
                  placeholder="e.g. How my faith transformed my fitness journey"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Topic</label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTopic(t.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${topic === t.value ? 'bg-[#3C4E53] text-white border-[#3C4E53]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3C4E53]'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Writing tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${tone === t.value ? 'bg-[#FD9C2D] text-white border-[#FD9C2D]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#FD9C2D]'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Key themes / keywords <span className="text-gray-400 font-normal">(optional)</span></label>
                <Input
                  placeholder="e.g. prayer, discipline, morning routine"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          )}

          {/* STEP: Generating */}
          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
              <Loader2 className="w-10 h-10 text-[#3C4E53] animate-spin" />
              <p className="font-semibold text-gray-700">Writing your blog post...</p>
              <p className="text-sm text-gray-500">Crafting something meaningful just for you ✨</p>
            </div>
          )}

          {/* STEP: Edit */}
          {step === 'edit' && (
            <div className="p-5 space-y-4">
              {/* Title edit */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 font-semibold text-lg h-11" />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Content</label>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="text-xs text-[#3C4E53] underline"
                  >
                    {editMode ? 'Preview' : 'Edit raw'}
                  </button>
                </div>
                {editMode ? (
                  <Textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="min-h-[260px] text-sm font-mono"
                  />
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-[260px] prose prose-sm max-w-none overflow-auto text-gray-800">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Excerpt (preview text)</label>
                <Textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="mt-1 text-sm h-16"
                />
              </div>

              {/* Refine with AI */}
              <div className="bg-[#FD9C2D]/10 rounded-xl p-4 border border-[#FD9C2D]/30">
                <p className="text-xs font-semibold text-[#3C4E53] mb-2">🪄 Refine with AI</p>
                <div className="flex gap-2">
                  <Input
                    value={refineInstruction}
                    onChange={e => setRefineInstruction(e.target.value)}
                    placeholder='e.g. "Make it more personal" or "Add a scripture quote"'
                    className="text-sm h-9"
                    onKeyDown={e => e.key === 'Enter' && refine()}
                  />
                  <Button
                    onClick={refine}
                    disabled={isRefining || !refineInstruction.trim()}
                    className="bg-[#FD9C2D] hover:bg-[#e08820] text-white h-9 px-3 flex-shrink-0"
                  >
                    {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Make it shorter', 'Add a personal story', 'More devotional tone', 'Add bullet points', 'Make the ending stronger'].map(s => (
                    <button key={s} onClick={() => setRefineInstruction(s)} className="text-xs bg-white text-gray-600 px-2 py-1 rounded border hover:border-[#FD9C2D] transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t px-5 py-4 flex gap-3 flex-shrink-0 bg-white">
          {step === 'setup' && (
            <>
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                onClick={generate}
                disabled={!title.trim()}
                className="flex-1 bg-gradient-to-r from-[#3C4E53] to-[#5a7480] text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Blog Post
              </Button>
            </>
          )}
          {step === 'edit' && (
            <>
              <Button variant="outline" onClick={() => setStep('setup')} className="flex-shrink-0">
                <RefreshCw className="w-4 h-4 mr-1" /> Redo
              </Button>
              <Button
                onClick={publish}
                disabled={isPublishing}
                className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#e08820] text-white font-semibold"
              >
                {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Publish to Community
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}