import React, { useEffect, useRef } from 'react';

const THEME_COLORS = {
  gideon: ['#FD9C2D', '#FAD98D', '#C9A227'],
  hannah: ['#AFC7E3', '#7EB5D9', '#38BDF8'],
  chef:   ['#FD9C2D', '#FAD98D', '#F97316'],
  coach:  ['#22C55E', '#86EFAC', '#4ADE80'],
};

const NUM_ORBS = 6;

export default function AvatarOrbs({ theme = 'gideon', isSpeaking = false }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const colors = THEME_COLORS[theme] || THEME_COLORS.gideon;

    if (!stateRef.current) {
      stateRef.current = Array.from({ length: NUM_ORBS }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     4 + Math.random() * 6,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        alpha: 0.1 + Math.random() * 0.4,
        dA:    0.003 + Math.random() * 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    const orbs = stateRef.current;
    const speedMult = isSpeaking ? 3 : 1;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const o of orbs) {
        o.x += o.vx * speedMult;
        o.y += o.vy * speedMult;
        o.alpha += o.dA * speedMult;
        if (o.alpha > 0.55 || o.alpha < 0.05) o.dA *= -1;
        if (o.x < 0 || o.x > W) o.vx *= -1;
        if (o.y < 0 || o.y > H) o.vy *= -1;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 2.5);
        g.addColorStop(0, o.color + Math.round(o.alpha * 255).toString(16).padStart(2, '0'));
        g.addColorStop(1, o.color + '00');
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [theme, isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={420}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}