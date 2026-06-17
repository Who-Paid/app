import { useEffect, useRef, useState } from 'react';
import { GoldCoin } from './GoldCoin';
import { Icon } from './ui/Icon';

// ─── types ────────────────────────────────────────────────────────────────────

interface Props {
  topName: string;
  botName: string;
  topColor: string;  // literal hex — CSS vars are silent no-ops on canvas.fillStyle
  botColor: string;
  target?: number;
  onResult: (loserSide: 'top' | 'bot') => void;
  onExit: () => void;
}

interface HUD {
  topScore: number;
  botScore: number;
  phase: 'countdown' | 'play' | 'over';
  count: number;
  winner: 'top' | 'bot' | null;
}

interface GS {
  // geometry
  W: number; H: number;
  padW: number; padH: number; inset: number;
  topSurf: number; botSurf: number; ballR: number;
  // paddles
  topX: number; topTargetX: number;
  botX: number; botTargetX: number;
  // ball
  bx: number; by: number; bvx: number; bvy: number;
  // game
  topScore: number; botScore: number;
  phase: 'countdown' | 'play' | 'over';
  serveTo: 'top' | 'bot';
  countdownEnd: number;
  countdownDur: number;
  baseSpeed: number; speed: number;
  target: number;
  winner: 'top' | 'bot' | null;
  // coin roll
  rotDeg: number; prevBx: number; prevBy: number;
  // multi-touch input
  pointers: Map<number, 'top' | 'bot'>;
  ctrlTop: number | null;
  ctrlBot: number | null;
  // lifecycle
  rafId: number;
  lastTime: number;
  audioCtx: AudioContext | null;
  // hud dirty key
  lastHudKey: string;
}

// ─── pure helpers (no React) ──────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function makeGS(W: number, H: number, target: number): GS {
  const padH = 13, inset = 32;
  const padW = clamp(W * 0.30, 58, 168);
  const ballR = W * 0.075;
  const baseSpeed = Math.max(440, H * 0.72);
  return {
    W, H, padW, padH, inset,
    topSurf: inset + padH,
    botSurf: H - inset - padH,
    ballR,
    topX: W / 2, topTargetX: W / 2,
    botX: W / 2, botTargetX: W / 2,
    bx: W / 2, by: H / 2, bvx: 0, bvy: 0,
    topScore: 0, botScore: 0,
    phase: 'countdown', serveTo: 'bot',
    countdownEnd: 0, countdownDur: 1400,
    baseSpeed, speed: baseSpeed,
    target, winner: null,
    rotDeg: 0, prevBx: W / 2, prevBy: H / 2,
    pointers: new Map(), ctrlTop: null, ctrlBot: null,
    rafId: 0, lastTime: 0, audioCtx: null,
    lastHudKey: '',
  };
}

function doServe(gs: GS) {
  const angle = (Math.random() - 0.5) * 0.5;
  const dir = gs.serveTo === 'top' ? -1 : 1;
  gs.bx = gs.W / 2; gs.by = gs.H / 2;
  gs.bvx = gs.speed * Math.sin(angle);
  gs.bvy = dir * gs.speed * Math.cos(angle);
}

function doCountdown(gs: GS, serveTo: 'top' | 'bot', dur: number, now: number) {
  gs.phase = 'countdown';
  gs.serveTo = serveTo;
  gs.bx = gs.W / 2; gs.by = gs.H / 2;
  gs.bvx = 0; gs.bvy = 0;
  gs.speed = gs.baseSpeed;
  gs.countdownDur = dur;
  gs.countdownEnd = now + dur;
}

function doBounce(gs: GS, side: 'top' | 'bot') {
  const px = side === 'top' ? gs.topX : gs.botX;
  const off = clamp((gs.bx - px) / (gs.padW / 2), -1, 1);
  const angle = off * 0.92;
  const spd = Math.min(gs.baseSpeed * 2.4, gs.speed * 1.05);
  gs.speed = spd;
  const dir = side === 'top' ? 1 : -1;  // top paddle sends ball down, bot sends up
  gs.bvx = spd * Math.sin(angle);
  gs.bvy = dir * spd * Math.cos(angle);
}

function blip(gs: GS, type: 'wall' | 'paddle' | 'score') {
  if (!gs.audioCtx) return;
  try {
    const ac = gs.audioCtx, t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = 'square';
    if (type === 'paddle') {
      o.frequency.value = 440;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      o.start(t); o.stop(t + 0.06);
    } else if (type === 'wall') {
      o.frequency.value = 220;
      g.gain.setValueAtTime(0.04, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.start(t); o.stop(t + 0.04);
    } else {
      o.frequency.value = 330;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.start(t); o.stop(t + 0.15);
    }
  } catch { /* ignore */ }
}

function drawRR(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

function drawPaddles(canvas: HTMLCanvasElement, gs: GS, topColor: string, botColor: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, gs.W, gs.H);
  const r = gs.padH / 2;
  ctx.fillStyle = topColor;
  drawRR(ctx, gs.topX - gs.padW / 2, gs.inset, gs.padW, gs.padH, r);
  ctx.fillStyle = botColor;
  drawRR(ctx, gs.botX - gs.padW / 2, gs.H - gs.inset - gs.padH, gs.padW, gs.padH, r);
}

// ─── component ────────────────────────────────────────────────────────────────

export function PongGame({
  topName, botName, topColor, botColor, target = 3, onResult, onExit,
}: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinRef  = useRef<HTMLDivElement>(null);
  const gsRef    = useRef<GS | null>(null);
  const [hud, setHud] = useState<HUD>({ topScore: 0, botScore: 0, phase: 'countdown', count: 3, winner: null });
  const [coinSize, setCoinSize] = useState(58);

  // ── main game loop effect ──────────────────────────────────────────────────
  useEffect(() => {
    const wrap   = wrapRef.current!;
    const canvas = canvasRef.current!;
    const coinEl = coinRef.current!;

    const W = wrap.clientWidth, H = wrap.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;

    const gs = makeGS(W, H, target);
    gsRef.current = gs;
    const t0 = performance.now();
    gs.lastTime   = t0;
    gs.countdownEnd = t0 + 1400;

    // Snap coin to centre before first frame
    setCoinSize(Math.round(gs.ballR * 2));
    coinEl.style.transform = `translate(-50%,-50%) translate(${gs.bx}px,${gs.by}px) rotate(0deg)`;

    function pushHud(countNum: number) {
      const key = `${gs.phase}|${gs.topScore}|${gs.botScore}|${countNum}|${gs.winner ?? ''}`;
      if (key === gs.lastHudKey) return;
      gs.lastHudKey = key;
      setHud({ topScore: gs.topScore, botScore: gs.botScore, phase: gs.phase, count: countNum, winner: gs.winner });
    }

    function loop(now: number) {
      gs.rafId = requestAnimationFrame(loop);

      const dt = Math.min(0.034, (now - gs.lastTime) / 1000);
      gs.lastTime = now;

      // Ease paddles toward touch target
      const ease = Math.min(1, dt * 20);
      gs.topX += (gs.topTargetX - gs.topX) * ease;
      gs.botX += (gs.botTargetX - gs.botX) * ease;
      gs.topX = clamp(gs.topX, gs.padW / 2, gs.W - gs.padW / 2);
      gs.botX = clamp(gs.botX, gs.padW / 2, gs.W - gs.padW / 2);

      let countNum = 1;

      if (gs.phase === 'countdown') {
        const rem = gs.countdownEnd - now;
        if (rem <= 0) {
          doServe(gs);
          gs.phase = 'play';
        } else {
          countNum = clamp(Math.ceil(rem / 500), 1, 3);
        }
      } else if (gs.phase === 'play') {
        // Integrate ball
        gs.bx += gs.bvx * dt;
        gs.by += gs.bvy * dt;

        // Left / right walls
        if (gs.bx - gs.ballR < 0) {
          gs.bx = gs.ballR;
          gs.bvx = Math.abs(gs.bvx);
          blip(gs, 'wall');
        } else if (gs.bx + gs.ballR > gs.W) {
          gs.bx = gs.W - gs.ballR;
          gs.bvx = -Math.abs(gs.bvx);
          blip(gs, 'wall');
        }

        // Top paddle
        if (gs.bvy < 0 && gs.by - gs.ballR <= gs.topSurf) {
          if (Math.abs(gs.bx - gs.topX) <= gs.padW / 2 + gs.ballR) {
            gs.by = gs.topSurf + gs.ballR;
            doBounce(gs, 'top');
            blip(gs, 'paddle');
            navigator.vibrate?.(8);
          }
        }

        // Bot paddle
        if (gs.bvy > 0 && gs.by + gs.ballR >= gs.botSurf) {
          if (Math.abs(gs.bx - gs.botX) <= gs.padW / 2 + gs.ballR) {
            gs.by = gs.botSurf - gs.ballR;
            doBounce(gs, 'bot');
            blip(gs, 'paddle');
            navigator.vibrate?.(8);
          }
        }

        // Scoring: ball past top → bot scores; ball past bottom → top scores
        if (gs.by + gs.ballR < 0) {
          blip(gs, 'score');
          gs.botScore++;
          if (gs.botScore >= gs.target) { gs.phase = 'over'; gs.winner = 'bot'; }
          else doCountdown(gs, 'bot', 1100, now);
        } else if (gs.by - gs.ballR > gs.H) {
          blip(gs, 'score');
          gs.topScore++;
          if (gs.topScore >= gs.target) { gs.phase = 'over'; gs.winner = 'top'; }
          else doCountdown(gs, 'top', 1100, now);
        }

        // Accumulate coin rotation proportional to distance rolled
        const rdx = gs.bx - gs.prevBx, rdy = gs.by - gs.prevBy;
        gs.rotDeg += Math.hypot(rdx, rdy) * 0.8;
        gs.prevBx = gs.bx;
        gs.prevBy = gs.by;
      }

      // Draw paddles on canvas; coin is a DOM element so no canvas draw needed
      drawPaddles(canvas, gs, topColor, botColor);
      coinEl.style.transform = `translate(-50%,-50%) translate(${gs.bx}px,${gs.by}px) rotate(${gs.rotDeg}deg)`;

      pushHud(countNum);
    }

    gs.rafId = requestAnimationFrame(loop);

    // Resize: scale existing positions/velocities proportionally
    const ro = new ResizeObserver(() => {
      const nW = wrap.clientWidth, nH = wrap.clientHeight;
      if (nW === gs.W && nH === gs.H) return;
      const sx = nW / gs.W, sy = nH / gs.H;
      gs.topX *= sx; gs.topTargetX *= sx;
      gs.botX *= sx; gs.botTargetX *= sx;
      gs.bx *= sx; gs.by *= sy;
      gs.bvx *= sx; gs.bvy *= sy;
      gs.prevBx *= sx; gs.prevBy *= sy;
      gs.W = nW; gs.H = nH;
      gs.padW = clamp(nW * 0.30, 58, 168);
      gs.topSurf = gs.inset + gs.padH;
      gs.botSurf = nH - gs.inset - gs.padH;
      gs.ballR = nW * 0.075;
      gs.baseSpeed = Math.max(440, nH * 0.72);
      const dpr2 = window.devicePixelRatio || 1;
      canvas.width = nW * dpr2;
      canvas.height = nH * dpr2;
      setCoinSize(Math.round(gs.ballR * 2));
    });
    ro.observe(wrap);

    // Pause / resume on tab visibility
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(gs.rafId);
      } else {
        gs.lastTime = performance.now();
        gs.rafId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(gs.rafId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gs.audioCtx?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── pointer event helpers ─────────────────────────────────────────────────

  const toLocal = (e: React.PointerEvent) => {
    const el = wrapRef.current!;
    const r = el.getBoundingClientRect();
    const sx = r.width / el.clientWidth;
    const sy = r.height / el.clientHeight;
    return { x: (e.clientX - r.left) / sx, y: (e.clientY - r.top) / sy };
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const gs = gsRef.current;
    if (!gs) return;
    // Don't capture pointer when the user is clicking a button inside the game overlay
    if ((e.target as HTMLElement).closest?.('button')) return;
    const { x, y } = toLocal(e);
    const side: 'top' | 'bot' = y < gs.H / 2 ? 'top' : 'bot';
    gs.pointers.set(e.pointerId, side);
    if (side === 'top' && gs.ctrlTop === null) gs.ctrlTop = e.pointerId;
    if (side === 'bot' && gs.ctrlBot === null) gs.ctrlBot = e.pointerId;
    const cx = clamp(x, gs.padW / 2, gs.W - gs.padW / 2);
    if (gs.ctrlTop === e.pointerId) gs.topTargetX = cx;
    if (gs.ctrlBot === e.pointerId) gs.botTargetX = cx;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!gs.audioCtx) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gs.audioCtx = new ((window as any).AudioContext ?? (window as any).webkitAudioContext)();
      } catch { /* ignore */ }
    }
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const gs = gsRef.current;
    if (!gs || (gs.ctrlTop !== e.pointerId && gs.ctrlBot !== e.pointerId)) return;
    const { x } = toLocal(e);
    const cx = clamp(x, gs.padW / 2, gs.W - gs.padW / 2);
    if (gs.ctrlTop === e.pointerId) gs.topTargetX = cx;
    if (gs.ctrlBot === e.pointerId) gs.botTargetX = cx;
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const gs = gsRef.current;
    if (!gs) return;
    gs.pointers.delete(e.pointerId);
    if (gs.ctrlTop === e.pointerId) {
      gs.ctrlTop = null;
      for (const [pid, s] of gs.pointers) if (s === 'top') { gs.ctrlTop = pid; break; }
    }
    if (gs.ctrlBot === e.pointerId) {
      gs.ctrlBot = null;
      for (const [pid, s] of gs.pointers) if (s === 'bot') { gs.ctrlBot = pid; break; }
    }
  };

  // ── rematch ───────────────────────────────────────────────────────────────

  const handleRematch = () => {
    const gs = gsRef.current;
    if (!gs) return;
    gs.topScore = 0; gs.botScore = 0;
    gs.winner = null; gs.lastHudKey = '';
    gs.speed = gs.baseSpeed;
    doCountdown(gs, 'bot', 1400, performance.now());
  };

  // ── derived render values ─────────────────────────────────────────────────

  const loserSide: 'top' | 'bot' = hud.winner === 'top' ? 'bot' : 'top';
  const loserName = hud.winner === 'top' ? botName : topName;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapRef}
      style={{ position: 'absolute', inset: 0, zIndex: 50, touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* Paddles drawn on canvas; transparent bg so table bands show through */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* The coin IS the ball — positioned by rAF imperatively via coinRef */}
      <div ref={coinRef} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <GoldCoin size={coinSize} mood="idle" drop />
      </div>

      {/* Countdown number */}
      {hud.phase === 'countdown' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span
            key={hud.count}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 80,
              fontWeight: 700,
              color: 'var(--ink-900)',
              lineHeight: 1,
              animation: 'pong-pop .22s cubic-bezier(.34,1.3,.64,1) both',
            }}
          >
            {hud.count}
          </span>
        </div>
      )}

      {/* Game-over card */}
      {hud.phase === 'over' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,27,41,.08)' }}>
          <div style={{
            background: 'var(--card)',
            border: '2px solid var(--ink-900)',
            boxShadow: '0 6px 0 var(--ink-900)',
            borderRadius: 20,
            padding: '28px 32px',
            textAlign: 'center',
            minWidth: 240,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Game Over
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.1 }}>
              {hud.topScore} – {hud.botScore}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginTop: 4 }}>
              {loserName} pays 😬
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
              Ah, bad luck.
            </div>
            <button
              onClick={() => onResult(loserSide)}
              style={{
                marginTop: 14, padding: '14px 24px', borderRadius: 999,
                border: 'none', cursor: 'pointer',
                background: 'var(--mint-400)', color: 'var(--text-on-brand)',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
                boxShadow: '0 4px 0 var(--mint-600)',
              }}
            >
              Settle it 🪙
            </button>
            <button
              onClick={handleRematch}
              style={{
                marginTop: 4, padding: '12px 24px', borderRadius: 999,
                border: '2px solid var(--ink-900)', background: 'transparent', cursor: 'pointer',
                color: 'var(--ink-900)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
              }}
            >
              Rematch
            </button>
          </div>
        </div>
      )}

      {/* Close — top-left, respects safe-area notch */}
      <button
        onClick={onExit}
        aria-label="Close"
        style={{
          position: 'absolute', top: 'var(--wp-pad-top)', left: 14,
          width: 38, height: 38, borderRadius: 99, border: 'none', cursor: 'pointer',
          background: 'rgba(28,27,41,.08)', color: 'var(--ink-900)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="x" size={20} />
      </button>
    </div>
  );
}
