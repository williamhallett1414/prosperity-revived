/**
 * VisemeAvatar — Pixar portrait with idle + speaking video layers.
 *
 * DESIGN
 * ──────
 * Two intertwined systems:
 *
 * 1. IDLE LAYER (bottom). Two <video> elements always mounted, z-index
 *    swapped. At random 15-20s intervals, a clip plays from frame 0 and
 *    then pauses on its last frame. Alternates randomly between the
 *    registered idle clips so users see variety. This layer runs
 *    continuously whether speaking or not.
 *
 * 2. TALKING LAYER (top). One <video loop> mounted always. When
 *    isSpeaking becomes true, z-index rises to 10 (above idle) and the
 *    video plays continuously. When isSpeaking becomes false, z-index
 *    drops to 0 and the video pauses. The idle layer was running
 *    underneath the whole time, so the transition from speech to idle
 *    reveals whichever idle state is current — no re-init delay.
 *
 * WHY THIS SHAPE
 * ──────────────
 * CharmXP and similar premium AI companion apps don't attempt real
 * phoneme sync — users don't perceive the lack of sync when ambient
 * motion is present and the audio is clear. This architecture nails the
 * "present, alive, talking when TTS is audible, resting between" pattern
 * without any lip-sync engineering.
 *
 * IDLE LAYER INTERNALS (two-slot crossfade)
 * ─────────────────────────────────────────
 * When it's time to switch idle clips (e.g. cycle 2 swaps from clip A to
 * clip B), setting `src` on a single <video> causes a brief frame-loss
 * while the new source loads. To avoid that, two <video> elements are
 * kept mounted:
 *
 *   slot A — currently visible, holds clip A
 *   slot B — invisible, holds clip B (preloaded)
 *
 * When it's time to play clip B, we show slot B (which already has clip B
 * loaded and paused at frame 0) and hide slot A. The change is a hard
 * z-index swap with no loading gap.
 *
 * Because both idle clips are Gideon in closed-mouth warm poses (by
 * design), a hard cut between them reads as natural micro-motion, not a
 * glitch. No fades are needed.
 *
 * TALKING LAYER INTERNALS
 * ───────────────────────
 * The talking reel is a single pre-stitched ~4s video spliced from the
 * best speaking moments across multiple Kling generations. It plays on
 * native loop while isSpeaking is true. Because it's only visible when
 * active and the audio is also only playing when active, the user
 * perceives it as continuous talking regardless of the loop.
 *
 * The neutral PNG is kept mounted and serves two roles:
 *  1. Cold-start fallback before slot A has its first frame ready.
 *  2. Inter-clip rest pose — the PNG rises ABOVE both video slots
 *     (z-index 3) during the IDLE_MIN_MS..IDLE_MAX_MS pause between
 *     idle clips, so the user sees the calm forward-facing portrait
 *     between expressive idle moments instead of a frozen mid-
 *     expression video frame. The talking layer (z-index 10) still
 *     overrides everything when speaking.
 *
 * TUNING
 * ──────
 * IDLE_MIN_MS / IDLE_MAX_MS: random wait between idle plays. 15-20 seconds.
 * FIRST_TRIGGER_DELAY_MS: wait before first idle play after mount.
 */
import React, { useRef, useEffect, useState } from 'react';
import AvatarOrbs from './AvatarOrbs';

// ─── Tuning ──────────────────────────────────────────────────────────────────
const IDLE_MIN_MS            = 15000;
const IDLE_MAX_MS            = 20000;
const FIRST_TRIGGER_DELAY_MS = 3000;

// ─── Asset imports ───────────────────────────────────────────────────────────
import gideonNeutral from '@/assets/gideon-neutral.png';
import gideonIdle1   from '@/assets/gideon-idle.mp4';
import gideonIdle2   from '@/assets/gideon-idle-2.mp4';
import gideonTalking from '@/assets/gideon-talking.mp4';

import hannahNeutral from '@/assets/hannah-neutral.png';
import hannahIdle1   from '@/assets/hannah-idle.mp4';
import hannahIdle2   from '@/assets/hannah-idle-2.mp4';
import hannahTalking from '@/assets/hannah-talking.mp4';

import chefNeutral   from '@/assets/chef-daniel-neutral.png';
import chefIdle1     from '@/assets/chef-daniel-idle.mp4';
import chefIdle2     from '@/assets/chef-daniel-idle-2.mp4';
import chefTalking   from '@/assets/chef-daniel-talking.mp4';

import coachNeutral  from '@/assets/coach-david-neutral.png';
import coachIdle1    from '@/assets/coach-david-idle.mp4';
import coachIdle2    from '@/assets/coach-david-idle-2.mp4';
import coachTalking  from '@/assets/coach-david-talking.mp4';

// ─── Pose registry ───────────────────────────────────────────────────────────
const POSE_REGISTRY = {
  gideon: {
    neutral:     gideonNeutral,
    idleClips:   [gideonIdle1, gideonIdle2],
    // Talking reel — a short (~4s) loop of Gideon actively speaking.
    // Plays continuously on native <video loop> while isSpeaking is true,
    // layered above the idle slots via z-index. When speech ends, it
    // hides and the idle cycle is revealed underneath mid-state.
    talkingClip: gideonTalking,
  },
  hannah: {
    neutral:   hannahNeutral,
    idleClips: [hannahIdle1, hannahIdle2],
    // Talking reel built from a single Kling generation (3D6D9532),
    // splicing the two strongest speaking windows: 8.0-10.7s (engaged
    // empathetic listening + talking, very Hannah) and 2.0-3.2s (clean
    // mouth motion). Concatenated and sped 1.3x for natural pace.
    // Final reel: ~3 seconds, 480x658.
    talkingClip: hannahTalking,
  },
  chef: {
    neutral:   chefNeutral,
    idleClips: [chefIdle1, chefIdle2],
    // Idle clips from two Kling 3.0 generations (5905D61C — emotive,
    // smile→surprised→contemplative; 2F640EE0 — cheerful with head turns).
    // Both trimmed to 12s (skipping 1s warmup) and cropped 1024x1408 from
    // the 1080x1482 source to remove the bottom-right Kling watermark,
    // then scaled to 480x660 to match Hannah/Gideon. The neutral PNG was
    // cropped/scaled with the same proportions so cross-fades stay aligned.
    // Talking reel cut from a third Kling 3.0 generation (552BCF46) at
    // t=4.5–7.5s, the cleanest forward-facing talking window with mouth
    // moving, eyes open, and minimal head drift. A subtle hand gesture
    // appears in the final ~0.3s — accepted because VisemeAvatar cuts back
    // to the idle clip the moment speech ends, so the loop seam mostly
    // only shows during sustained speech. Same 1024x1408 → 480x660 crop
    // pipeline as idle clips. Final reel: 3 seconds, 167K, ~450 kbps.
    talkingClip: chefTalking,
  },
  coach: {
    neutral:   coachNeutral,
    idleClips: [coachIdle1, coachIdle2],
    // Idle clips from two Kling 3.0 generations (51DBF3F0 — head turn,
    // smile, hands-up gesture, contemplative beat; 910F5173 — energetic
    // smile with body movement, includes a known generation artifact:
    // a floating disembodied fist in the right edge from t=1.3s to
    // t=9.5s. Will accepted keeping the artifact rather than stitching
    // around it (the stitch produced a worse hard-cut). Both clips
    // trimmed before the talking starts at end (idle.mp4: 11s, idle-2.mp4:
    // 10s) so the cross-fade to the neutral PNG during the inter-clip
    // pause doesn't catch a mid-word frame. Same 1024x1408 → 480x660
    // crop pipeline as Chef.
    // Talking reel cut from Kling 3.0 generation 124F4476 at t=6–11s,
    // a 5-second window of varied energetic talking with mouth motion
    // throughout, eyes open, no hand artifacts, no head turns. Both
    // endpoints are mid-talk forward-facing for a clean loop seam.
    // Same crop pipeline. Final reel: 5s, 195K, ~315 kbps.
    talkingClip: coachTalking,
  },
  // paul — add once assets exist.
};

export function hasPoseSet(character) {
  const entry = POSE_REGISTRY[character];
  return !!(entry && entry.neutral);
}

function randomDelay() {
  return IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS);
}

function pickNextClip(currentIndex, totalClips) {
  if (totalClips <= 1) return 0;
  let next = currentIndex;
  while (next === currentIndex) {
    next = Math.floor(Math.random() * totalClips);
  }
  return next;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function VisemeAvatar({
  character,
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 360,
  height      = 420,
}) {
  const entry = POSE_REGISTRY[character];
  const idleClips = entry?.idleClips || (entry?.idle ? [entry.idle] : []);
  const hasIdleVideo = idleClips.length > 0;
  const hasTalkingVideo = !!entry?.talkingClip;

  // Two video slots. Each holds the src of the clip currently loaded in it,
  // or null if it hasn't been populated yet. activeSlot is whichever is
  // currently visible to the user (playing or paused).
  const [slotAClip, setSlotAClip] = useState(hasIdleVideo ? idleClips[0] : null);
  const [slotBClip, setSlotBClip] = useState(null);
  const [activeSlot, setActiveSlot] = useState('a'); // 'a' | 'b'

  // PNG-pause state: when true, the neutral PNG is z-index'd ABOVE both
  // video slots, so the user sees the calm portrait between idle clip
  // plays instead of a frozen mid-expression video frame. Initialized
  // true so the PNG also shows during the cold-start period before the
  // first cycle fires.
  //
  // Lifecycle:
  //   - true on mount (PNG shows during FIRST_TRIGGER_DELAY_MS)
  //   - false right before each setActiveSlot+play (video takes over)
  //   - true again in onClipEnded (video pauses, PNG covers it)
  //   - false again when the next cycle's video is about to play
  //
  // The talking layer (z-index 10 when speaking) overrides everything
  // here, so paused-state PNG and the talking video coexist correctly.
  const [isPaused, setIsPaused] = useState(true);

  // Track which clip index each slot holds, so we can pick "a different
  // index than currently active" each cycle.
  const slotAIndexRef = useRef(0);
  const slotBIndexRef = useRef(-1);
  const activeSlotRef = useRef('a');

  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  // Talking reel video — mounted always, plays on loop while isSpeaking.
  // Layered above the idle slots via z-index so it takes over visibility
  // during speech without disrupting the idle cycle underneath.
  const talkingVideoRef = useRef(null);

  // Timers for the cycle machine.
  const cycleTimerRef = useRef(null);

  // Ref holding runCycle so onEnded (attached via JSX, outside the effect)
  // can invoke it without stale-closure issues.
  const runCycleRef = useRef(null);
  const cancelledRef = useRef(false);

  // Called by JSX onEnded on whichever slot's video finishes. Pauses the
  // finished video, brings the neutral PNG forward (so the user sees the
  // calm portrait instead of a frozen video frame), and schedules the
  // next cycle.
  const onClipEnded = (slot) => () => {
    if (cancelledRef.current) return;
    const v = slot === 'a' ? videoARef.current : videoBRef.current;
    if (v) { try { v.pause(); } catch {} }
    setIsPaused(true);
    cycleTimerRef.current = setTimeout(() => {
      if (runCycleRef.current) runCycleRef.current();
    }, randomDelay());
  };

  useEffect(() => {
    if (!hasIdleVideo) return;
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  useEffect(() => {
    if (!hasIdleVideo) return;

    cancelledRef.current = false;

    // Kick off a single play cycle. Picks a new clip index, loads it into
    // the INACTIVE slot, waits for it to be ready, swaps activeSlot to
    // reveal it, and plays.
    const runCycle = () => {
      if (cancelledRef.current) return;

      const currentSlot = activeSlotRef.current;
      const nextSlot = currentSlot === 'a' ? 'b' : 'a';

      // Figure out what clip is currently playing/paused (to avoid repeating).
      const currentClipIdx =
        currentSlot === 'a' ? slotAIndexRef.current : slotBIndexRef.current;
      const nextClipIdx = pickNextClip(currentClipIdx, idleClips.length);

      // Load the chosen clip into the inactive slot. If that slot already
      // has the right clip, we can skip the src change and go straight to
      // swap + play.
      const nextSlotIndexRef = nextSlot === 'a' ? slotAIndexRef : slotBIndexRef;
      const nextSlotSetter = nextSlot === 'a' ? setSlotAClip : setSlotBClip;
      const nextSlotVideoRef = nextSlot === 'a' ? videoARef : videoBRef;

      const alreadyLoaded = nextSlotIndexRef.current === nextClipIdx;
      if (!alreadyLoaded) {
        nextSlotIndexRef.current = nextClipIdx;
        nextSlotSetter(idleClips[nextClipIdx]);
      }

      // Wait briefly so React applies the src change + the video element
      // has a chance to load its first frame. Then seek to 0 and WAIT for
      // the seek to complete before swapping active — otherwise we'd
      // reveal the element while it's still showing the last-pause frame
      // from a previous run, then flicker to frame 0.
      const SWAP_DELAY = alreadyLoaded ? 0 : 300;
      setTimeout(() => {
        if (cancelledRef.current) return;
        const v = nextSlotVideoRef.current;
        if (!v) return;

        // Seek to 0 and wait for it to take effect. Then swap + play.
        const onSeeked = () => {
          v.removeEventListener('seeked', onSeeked);
          if (cancelledRef.current) return;
          // Drop the PNG behind the video right before the swap so the
          // user sees video frame 0, not a flash of PNG.
          setIsPaused(false);
          setActiveSlot(nextSlot);
          activeSlotRef.current = nextSlot;
          const p = v.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              if (!cancelledRef.current) {
                cycleTimerRef.current = setTimeout(runCycle, 3000);
              }
            });
          }
        };

        if (v.currentTime === 0) {
          // Already at 0 (first play of this element, never played before).
          onSeeked();
        } else {
          v.addEventListener('seeked', onSeeked);
          try { v.currentTime = 0; } catch {
            // If seek fails for any reason, give up gracefully and just
            // swap + play anyway.
            v.removeEventListener('seeked', onSeeked);
            setIsPaused(false);
            setActiveSlot(nextSlot);
            activeSlotRef.current = nextSlot;
            try { v.play().catch(() => {}); } catch {}
          }
        }
      }, SWAP_DELAY);
    };

    // Expose runCycle to the onClipEnded callback (which is defined at
    // component scope so JSX onEnded can use it without stale closures).
    runCycleRef.current = runCycle;

    // Initial play: kick off slot A's clip after a brief grace period.
    // runCycle picks a DIFFERENT slot than currentSlot, so for the very
    // first run we temporarily set activeSlotRef to 'b' so runCycle swaps
    // to 'a' (which already has clip index 0 loaded from initial state).
    activeSlotRef.current = 'b';
    cycleTimerRef.current = setTimeout(runCycle, FIRST_TRIGGER_DELAY_MS);

    return () => {
      cancelledRef.current = true;
      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      const vA = videoARef.current;
      const vB = videoBRef.current;
      if (vA) { try { vA.pause(); } catch {} }
      if (vB) { try { vB.pause(); } catch {} }
      runCycleRef.current = null;
    };
  }, [hasIdleVideo, idleClips.length]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Talking video control: starts the loop when isSpeaking becomes true,
  // pauses when it becomes false. The <video loop> attribute handles the
  // continuous back-to-back repeat, so we only need to manage play/pause
  // transitions here.
  //
  // Note: we rely on CSS z-index (below) to actually show/hide the
  // talking layer. The play/pause here is just for efficiency — we don't
  // want the talking video decoding frames while it's hidden behind the
  // idle layer.
  useEffect(() => {
    if (!hasTalkingVideo) return;
    const v = talkingVideoRef.current;
    if (!v) return;

    if (isSpeaking) {
      try { v.currentTime = 0; } catch {}
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      try { v.pause(); } catch {}
    }
  }, [isSpeaking, hasTalkingVideo]);

  const commonMediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center bottom',
    userSelect: 'none',
    pointerEvents: 'none',
    display: 'block',
    mixBlendMode: 'multiply',
  };

  if (!entry || !entry.neutral) return null;

  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden' }}>
      {/* Static portrait — neutral PNG of the character. Sits behind both
          video slots (z-index 0) while a video is actively playing, but
          rises ABOVE both slots (z-index 3) during the inter-clip pause
          and on cold start. This way the user sees the calm forward-
          facing portrait between idle clip plays instead of whatever
          mid-expression frame the previous video happened to pause on.
          The talking layer (z-index 10) still overrides everything when
          isSpeaking is true, so this doesn't interfere with speech. */}
      <img
        src={entry.neutral}
        alt=""
        draggable={false}
        style={{ ...commonMediaStyle, zIndex: isPaused ? 3 : 0 }}
      />

      {/* Slot A — video element, always mounted. Visibility toggled via
          z-index rather than opacity so there's zero fade; a hard cut is
          what we want between paused-frame and playing-frame of the same
          character. */}
      {hasIdleVideo && slotAClip && (
        <video
          ref={videoARef}
          src={slotAClip}
          muted
          playsInline
          preload="auto"
          aria-hidden
          onEnded={onClipEnded('a')}
          style={{
            ...commonMediaStyle,
            zIndex: activeSlot === 'a' ? 2 : 1,
          }}
        />
      )}

      {/* Slot B — second video element. Holds whichever clip is loaded
          into it during the current cycle, ready to swap to active. */}
      {hasIdleVideo && slotBClip && (
        <video
          ref={videoBRef}
          src={slotBClip}
          muted
          playsInline
          preload="auto"
          aria-hidden
          onEnded={onClipEnded('b')}
          style={{
            ...commonMediaStyle,
            zIndex: activeSlot === 'b' ? 2 : 1,
          }}
        />
      )}

      {/* Talking reel — always mounted, plays on loop whenever isSpeaking
          is true. Layered above both idle slots (zIndex 10 when speaking)
          so it takes visual priority during speech. When not speaking, it
          drops to zIndex 0 (below everything visible) and is paused. The
          idle cycle continues running underneath the whole time, so when
          speech ends, whichever idle state was current snaps back into
          view — no "waiting for idle to re-initialize" delay. */}
      {hasTalkingVideo && (
        <video
          ref={talkingVideoRef}
          src={entry.talkingClip}
          muted
          playsInline
          preload="auto"
          loop
          aria-hidden
          style={{
            ...commonMediaStyle,
            zIndex: isSpeaking ? 10 : 0,
          }}
        />
      )}

      {/* Ambient orbs layer — pulsing gold motes that speed up during
          speech (the "Gideon is speaking" visual cue). mixBlendMode:screen
          keeps them glowing on dark areas and invisible over Gideon. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      >
        <AvatarOrbs theme={character} isSpeaking={isSpeaking} />
      </div>
    </div>
  );
}