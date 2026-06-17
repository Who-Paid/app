import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Table, Person } from '../lib/types';
import { paidLabel } from '../lib/util';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { IconButton } from '../components/ui/IconButton';
import { Icon } from '../components/ui/Icon';
import { ShareUpIcon } from '../components/ui/ShareUpIcon';
import { HeartBurst } from '../components/HeartBurst';
import { GoldCoin, type Mood } from '../components/GoldCoin';
import { PongGame } from '../components/PongGame';

function PongIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="9" height="3" rx="1.5" fill="currentColor" />
      <rect x="13" y="18" width="9" height="3" rx="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

const COIN = 86;
const MARGIN = 7;

interface Props {
  table: Table;
  onBack: () => void;
  onPaid: (tableId: string, personId: string) => void;
  onEditPerson: (tableId: string, personId: string) => void;
  onAddPerson: (tableId: string) => void;
  onInvite: (table: Table) => void;
  onSavePerson: (tableId: string, personId: string, upd: Partial<Person>) => void;
}

export function TableScreen({ table, onBack, onPaid, onEditPerson, onAddPerson, onInvite, onSavePerson }: Props) {
  const order = table.people; // others first, "me" last (bottom)
  const n = order.length;
  const paidIdx = order.findIndex((p) => p.id === table.paidBy);
  const hasPayer = paidIdx >= 0;

  const other = order.find((p) => !p.isMe);
  const showSyncNudge = !table.synced && !!(other && other.name && other.name.trim());

  const [nudgeDismissed, setNudgeDismissed] = useState(() => {
    try { return !!localStorage.getItem(`sync-nudge-${table.id}`); } catch { return false; }
  });
  const showNudge = showSyncNudge && !nudgeDismissed;

  const handleInvite = () => {
    if (showNudge) {
      setNudgeDismissed(true);
      try { localStorage.setItem(`sync-nudge-${table.id}`, '1'); } catch { /* ignore */ }
    }
    onInvite(table);
  };

  const [inlineNames, setInlineNames] = useState<Record<string, string>>({});
  const tableRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const flyingRef = useRef(false);
  const spinRef = useRef(0);
  const dragRef = useRef({ active: false, moved: false, startY: 0, startX: 0 });
  const velRef = useRef({ vx: 0, vy: 0, lastX: 0, lastY: 0, t: 0 });
  const [celebrate, setCelebrate] = useState<{ id: number; payerIdx: number } | null>(null);
  const [hoverBandIdx, setHoverBandIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<'idle' | 'pong'>('idle');

  const startPong = () => { setMode('pong'); };

  const onPongResult = (loserSide: 'top' | 'bot') => {
    const loserIdx = loserSide === 'top' ? 0 : n - 1;
    setMode('idle');
    const cid = Date.now();
    setCelebrate({ id: cid, payerIdx: loserIdx });
    setTimeout(() => setCelebrate(c => (c && c.id === cid ? null : c)), 1500);
    onPaid(table.id, order[loserIdx].id);
  };
  const [mood, setMood] = useState<Mood>(() => {
    if (!hasPayer) return 'idle';
    return order[paidIdx].isMe ? 'pay' : 'safe';
  });

  // Sync mood when paidBy changes externally (e.g. realtime)
  useEffect(() => {
    if (flyingRef.current) return;
    if (!hasPayer) { setMood('idle'); return; }
    setMood(order[paidIdx].isMe ? 'pay' : 'safe');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.paidBy]);

  // Coin wiggle on new (unpaid) tables
  useEffect(() => {
    if (!hasPayer && squashRef.current) {
      squashRef.current.style.animation = 'wp-coin-wiggle 0.65s ease-in-out, wp-coin-idle 2.8s 0.65s ease-in-out infinite';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Where the coin rests inside a band (n ≤ 3): pulled toward the screen's centre so
  // it never covers that person's avatar + name, and clamped on-screen.
  const landY = (i: number, H: number) => {
    const bandH = H / n;
    const c = (i + 0.5) * bandH;
    const dir = c < H / 2 ? 1 : -1;
    const y = c + dir * bandH * 0.36;
    const top = COIN / 2 + MARGIN + (i === 0 ? 40 : 0);
    const bot = H - (COIN / 2 + MARGIN);
    return Math.max(top, Math.min(bot, y));
  };

  // Resting Y for 2×2 grid (n=4): settle toward the horizontal centre line.
  const landY4 = (i: number, H: number) => {
    const row = Math.floor(i / 2);
    const rowH = H / 2;
    const c = (row + 0.5) * rowH;
    const dir = row === 0 ? 1 : -1;
    const y = c + dir * rowH * 0.3;
    const top = COIN / 2 + MARGIN + (row === 0 ? 40 : 0);
    const bot = H - (COIN / 2 + MARGIN);
    return Math.max(top, Math.min(bot, y));
  };

  // Which band index is a point (px) over?
  const getBandIdx = (x: number, y: number, W: number, H: number) => {
    if (n === 4) return (y < H / 2 ? 0 : 2) + (x < W / 2 ? 0 : 1);
    return Math.min(n - 1, Math.max(0, Math.floor((y / H) * n)));
  };

  // Smooth drop after a slow conscious drag (no bouncing).
  const landAt = (targetIdx: number) => {
    flyingRef.current = true;
    const w = coinRef.current!;
    const el = tableRef.current!;
    const H = el.clientHeight;
    const W = el.clientWidth;
    const targetY = n === 4 ? landY4(targetIdx, H) : landY(targetIdx, H);
    const targetX = n === 4 ? W * (targetIdx % 2 === 0 ? 0.25 : 0.75) : W / 2;
    const nearestUpright = Math.round(spinRef.current / 360) * 360;
    spinRef.current = nearestUpright;
    w.style.transition = 'top 0.38s cubic-bezier(.34,1.3,.64,1), left 0.38s cubic-bezier(.34,1.3,.64,1), transform 0.38s cubic-bezier(.34,1.3,.64,1)';
    w.style.top = `${targetY}px`;
    w.style.left = `${targetX}px`;
    w.style.transform = `translate(-50%,-50%) rotate(${nearestUpright}deg)`;
    if (squashRef.current) squashRef.current.style.animation = 'none';
    setTimeout(() => {
      w.style.transition = '';
      flyingRef.current = false;
      if (squashRef.current) squashRef.current.style.animation = 'wp-coin-idle 2.8s ease-in-out infinite';
      setMood(order[targetIdx].isMe ? 'pay' : 'safe');
      const cid2 = Date.now();
      setCelebrate({ id: cid2, payerIdx: targetIdx });
      setTimeout(() => setCelebrate((c) => (c && c.id === cid2 ? null : c)), 1500);
      onPaid(table.id, order[targetIdx].id);
    }, 400);
  };

  // Imperatively position the coin so React re-renders don't fight the rAF loop.
  useLayoutEffect(() => {
    if (flyingRef.current) return;
    const el = tableRef.current, w = coinRef.current;
    if (!el || !w) return;
    const H = el.clientHeight;
    if (!H) return;
    w.style.transition = 'none';
    if (n === 4) {
      w.style.top  = `${hasPayer ? landY4(paidIdx, H) : H / 2}px`;
      w.style.left = hasPayer ? `${paidIdx % 2 === 0 ? 25 : 75}%` : '50%';
    } else {
      w.style.top  = `${hasPayer ? landY(paidIdx, H) : H / 2}px`;
      w.style.left = '50%';
    }
    w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.id, table.paidBy, n]);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t: number) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  const otherTarget = () => {
    if (!hasPayer || n > 2) {
      const pool = order.map((_, i) => i).filter((i) => i !== paidIdx);
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return paidIdx === 0 ? 1 : 0;
  };
  const randomTarget = () => Math.floor(Math.random() * n);

  // The coin bounces off all four walls in 2D before landing in the target band.
  // Direction is determined by the flick velocity (or random for a tap).
  // The face always lands upright: spin eases to the nearest 360° multiple.
  function glideTo(targetIdx: number) {
    if (flyingRef.current || !tableRef.current) return;
    flyingRef.current = true;
    setMood('flick');

    const w = coinRef.current!, sq = squashRef.current;
    const H = tableRef.current.clientHeight;
    const W = tableRef.current.clientWidth;

    if (sq) sq.style.animation = 'none';
    w.style.transition = 'none';

    // Current position in pixels (left may be a % from useLayoutEffect).
    const leftRaw = w.style.left;
    const startX = leftRaw.endsWith('%') ? W * parseFloat(leftRaw) / 100 : (parseFloat(leftRaw) || W / 2);
    const startY = parseFloat(w.style.top) || (hasPayer ? landY(paidIdx, H) : H / 2);

    // Target resting position.
    const targetY = n === 4 ? landY4(targetIdx, H) : landY(targetIdx, H);
    const targetX = n === 4 ? W * (targetIdx % 2 === 0 ? 0.25 : 0.75) : W / 2;

    // Direction from flick velocity; random unit vector for tap.
    let vx = velRef.current.vx, vy = velRef.current.vy;
    const fspeed = Math.hypot(vx, vy);
    if (fspeed < 0.05) {
      const a = Math.random() * 2 * Math.PI;
      vx = Math.cos(a); vy = Math.sin(a);
    } else {
      vx /= fspeed; vy /= fspeed;
    }

    // Bounce walls (coin radius + margin + 44px top-bar clearance).
    const r = COIN / 2;
    const minX = r + MARGIN, maxX = W - r - MARGIN;
    const minY = r + MARGIN + 44, maxY = H - r - MARGIN;

    // Pre-compute bounce waypoints.
    const N_BOUNCES = 5;
    type WP = { x: number; y: number; dur: number; final?: boolean };
    const wps: WP[] = [];
    let bx = startX, by = startY, bdx = vx, bdy = vy;

    for (let i = 0; i < N_BOUNCES; i++) {
      const dtx = bdx > 0 ? (maxX - bx) / bdx : bdx < 0 ? (minX - bx) / bdx : Infinity;
      const dty = bdy > 0 ? (maxY - by) / bdy : bdy < 0 ? (minY - by) / bdy : Infinity;
      const dt = Math.min(Math.abs(dtx), Math.abs(dty));

      const nx = Math.max(minX, Math.min(maxX, bx + bdx * dt));
      const ny = Math.max(minY, Math.min(maxY, by + bdy * dt));
      wps.push({ x: nx, y: ny, dur: Math.max(60, Math.hypot(nx - bx, ny - by) * 0.4) });

      if (Math.abs(dtx) <= Math.abs(dty)) bdx = -bdx;
      if (Math.abs(dty) <= Math.abs(dtx)) bdy = -bdy;
      bx = nx; by = ny;
      bdx *= 0.82; bdy *= 0.82;
    }

    // Final landing arc.
    const finalDist = Math.hypot(targetX - bx, targetY - by);
    wps.push({ x: targetX, y: targetY, dur: Math.max(340, finalDist * 0.9), final: true });

    // Pre-compute total bounce distance to determine final upright rotation.
    const SPIN_RATE = 0.42;
    let totalBounceDist = Math.hypot(wps[0].x - startX, wps[0].y - startY);
    for (let i = 1; i < wps.length - 1; i++) totalBounceDist += Math.hypot(wps[i].x - wps[i-1].x, wps[i].y - wps[i-1].y);
    const spinAfterBounce = spinRef.current + totalBounceDist * SPIN_RATE;
    // Round to nearest 360° — always forward so the face never spins backward to settle.
    let finalSpin = Math.round(spinAfterBounce / 360) * 360;
    if (finalSpin < spinAfterBounce - 1) finalSpin += 360;

    // Animation loop.
    let wpI = 0, wpStart: number | null = null;
    let animX = startX, animY = startY;
    let contactT = -1, contactStr = 0;

    const frame = (now: number) => {
      if (wpStart === null) wpStart = now;
      const wp = wps[wpI];
      const fromX = wpI === 0 ? startX : wps[wpI - 1].x;
      const fromY = wpI === 0 ? startY : wps[wpI - 1].y;
      const t = Math.min(1, (now - wpStart) / wp.dur);
      const et = wp.final ? easeOutBack(t) : easeOutCubic(t);

      const x = fromX + (wp.x - fromX) * et;
      const y = fromY + (wp.y - fromY) * et;

      // Spin: ease to upright during final arc; accumulate during bounces.
      if (wp.final) {
        spinRef.current = spinAfterBounce + (finalSpin - spinAfterBounce) * easeOutCubic(t);
      } else {
        spinRef.current += Math.hypot(x - animX, y - animY) * SPIN_RATE;
      }
      animX = x; animY = y;

      w.style.top = `${y}px`;
      w.style.left = `${x}px`;
      w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;

      // Squash on wall contact.
      if (sq) {
        const s = contactT < 0 ? 0 : contactStr * Math.max(0, 1 - (now - contactT) / 160);
        sq.style.transform = `scaleX(${1 + 0.22 * s}) scaleY(${1 - 0.22 * s})`;
      }

      if (t < 1) { requestAnimationFrame(frame); return; }

      if (wpI < wps.length - 1) {
        contactT = now; contactStr = Math.max(0.15, 0.9 - wpI * 0.15);
        wpI++; wpStart = now;
        requestAnimationFrame(frame);
        return;
      }

      // Landing.
      spinRef.current = finalSpin;
      w.style.transform = `translate(-50%,-50%) rotate(${finalSpin}deg)`;
      w.style.transition = '';
      if (sq) { sq.style.transform = ''; sq.style.animation = 'wp-coin-idle 2.8s ease-in-out infinite'; }
      flyingRef.current = false;
      setMood(order[targetIdx].isMe ? 'pay' : 'safe');
      const cid = Date.now();
      setCelebrate({ id: cid, payerIdx: targetIdx });
      setTimeout(() => setCelebrate((c) => (c && c.id === cid ? null : c)), 1500);
      onPaid(table.id, order[targetIdx].id);
    };

    requestAnimationFrame(frame);
  }

  const onDown = (e: React.PointerEvent) => {
    if (flyingRef.current) return;
    e.stopPropagation();
    dragRef.current = { active: true, moved: false, startY: e.clientY, startX: e.clientX };
    coinRef.current?.setPointerCapture?.(e.pointerId);
    setMood('flick');
    // Scale coin up so the user knows they've grabbed it.
    if (scaleRef.current) {
      scaleRef.current.style.transition = 'transform 0.12s ease-out';
      scaleRef.current.style.transform = 'scale(1.22)';
    }
    if (shadowRef.current) {
      shadowRef.current.style.transition = 'transform 0.12s ease-out, opacity 0.12s ease-out, filter 0.12s ease-out';
      shadowRef.current.style.transform = 'translate(-50%, calc(-50% + 10px)) scale(1.35)';
      shadowRef.current.style.opacity = '0.32';
      shadowRef.current.style.filter = 'blur(18px)';
    }
    if (squashRef.current) squashRef.current.style.animation = 'none';
    // Set initial hovered band from the grab position.
    const el = tableRef.current!;
    const rect = el.getBoundingClientRect();
    const sy = (e.clientY - rect.top) / (rect.height / el.clientHeight || 1);
    const sx = (e.clientX - rect.left) / (rect.width / el.clientWidth || 1);
    setHoverBandIdx(getBandIdx(sx, sy, el.clientWidth, el.clientHeight));
    velRef.current = { vx: 0, vy: 0, lastX: e.clientX, lastY: e.clientY, t: performance.now() };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    if (Math.abs(e.clientY - d.startY) > 6 || Math.abs(e.clientX - d.startX) > 6) d.moved = true;
    // Track velocity for flick detection.
    const now = performance.now();
    const dt = now - velRef.current.t;
    if (dt > 0 && dt < 150) {
      velRef.current.vx = (e.clientX - velRef.current.lastX) / dt;
      velRef.current.vy = (e.clientY - velRef.current.lastY) / dt;
    }
    velRef.current.lastX = e.clientX;
    velRef.current.lastY = e.clientY;
    velRef.current.t = now;
    // Move coin freely in 2D.
    const el = tableRef.current!;
    const rect = el.getBoundingClientRect();
    const sx = rect.width / el.clientWidth || 1;
    const sy = rect.height / el.clientHeight || 1;
    const H = el.clientHeight;
    const W = el.clientWidth;
    const y = Math.max(COIN / 2, Math.min(H - COIN / 2, (e.clientY - rect.top) / sy));
    const x = Math.max(COIN / 2, Math.min(W - COIN / 2, (e.clientX - rect.left) / sx));
    const w = coinRef.current!;
    w.style.transition = 'none';
    w.style.top = `${y}px`;
    w.style.left = `${x}px`;
    w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;
    setHoverBandIdx(getBandIdx(x, y, W, H));
  };
  const onUp = () => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    // Release scale.
    if (scaleRef.current) {
      scaleRef.current.style.transition = 'transform 0.18s ease-in';
      scaleRef.current.style.transform = '';
    }
    if (shadowRef.current) {
      shadowRef.current.style.transition = 'transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease';
      shadowRef.current.style.transform = 'translate(-50%,-50%)';
      shadowRef.current.style.opacity = '1';
      shadowRef.current.style.filter = 'blur(11px)';
    }
    setHoverBandIdx(null);
    if (!d.moved) {
      // Tap: bounce to a random other person.
      glideTo(otherTarget());
      return;
    }
    // Flick detection: speed in px/s.
    const timeSince = performance.now() - velRef.current.t;
    const speed = timeSince < 150
      ? Math.hypot(velRef.current.vx, velRef.current.vy) * 1000
      : 0;
    if (speed > 350) {
      // Fast flick → 2D bouncy animation using current velocity direction.
      glideTo(otherTarget());
    } else {
      // Slow conscious drag → smooth land on whichever band the coin is over.
      const el = tableRef.current!;
      const curY = parseFloat(coinRef.current!.style.top);
      const curX = parseFloat(coinRef.current!.style.left);
      const target = getBandIdx(curX, curY, el.clientWidth, el.clientHeight);
      landAt(target);
    }
  };

  return (
    <div ref={tableRef} style={{ position: 'relative', height: '100%', overflow: 'hidden', background: 'var(--surface-app)' }}>
      {celebrate && order.map((_, i) =>
        i === celebrate.payerIdx ? null : (
          <HeartBurst
            key={`${celebrate.id}-${i}`}
            originX={n === 4 ? (i % 2 === 0 ? '25%' : '75%') : '50%'}
            originY={n === 4 ? `${(Math.floor(i / 2) + 0.5) / 2 * 100}%` : `${((i + 0.5) / n) * 100}%`}
          />
        )
      )}

      {/* bands */}
      {order.map((p, i) => {
        const isPayer = hasPayer && i === paidIdx;
        const isMe = !!p.isMe;
        const named = p.name && p.name.trim().length > 0;
        const is4 = n === 4;
        const row4 = Math.floor(i / 2);
        const col4 = i % 2;
        const avatarSize = is4 ? 'sm' : n === 3 ? 'md' : 'lg';
        const fontSize = is4 ? 17 : n === 3 ? 21 : 26;
        const addBox = is4 ? 44 : 60;
        const addIcon = is4 ? 18 : 24;
        const isInlineEdit = !named && !isMe;
        const bandStyle: React.CSSProperties = {
          position: 'absolute',
          top: is4 ? `${row4 * 50}%` : `${(i / n) * 100}%`,
          height: is4 ? '50%' : `${(1 / n) * 100}%`,
          left: is4 ? (col4 === 0 ? 0 : '50%') : 0,
          right: is4 ? (col4 === 0 ? '50%' : 0) : 0,
          ...(is4 ? {} : { width: '100%' }),
          border: 'none', cursor: 'pointer', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: is4 ? 5 : 7, padding: '0 14px', overflow: 'hidden',
          background: p.photo ? `center/cover url(${p.photo})`
            : isPayer ? 'var(--mint-50)' : (isMe ? 'var(--surface-sunken)' : 'var(--card)'),
          borderTop: (is4 ? row4 > 0 : i > 0) ? '1.5px solid var(--ink-100)' : 'none',
          ...(is4 && col4 > 0 ? { borderLeft: '1.5px solid var(--ink-100)' } : {}),
          transition: 'background .3s ease',
        };
        const bandInner = (
          <>
            {p.photo && <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,27,41,.15), rgba(28,27,41,.55))' }} />}
            {hoverBandIdx === i && (
              <span style={{ position: 'absolute', inset: 0, background: 'rgba(52,211,153,.18)', pointerEvents: 'none' }} />
            )}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: is4 ? 5 : 8 }}>
              {!p.photo && (named
                ? <Avatar name={isMe ? 'You' : p.name} src={p.profilePhoto ?? null} size={avatarSize} ring={isPayer} />
                : <span style={{ width: addBox, height: addBox, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--ink-300)', color: 'var(--ink-300)' }}><Icon name="user-plus" size={addIcon} /></span>)}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                {isInlineEdit ? (
                  <input
                    type="text"
                    placeholder="Add name"
                    autoFocus={!hasPayer}
                    value={inlineNames[p.id] ?? ''}
                    onChange={e => setInlineNames(prev => ({ ...prev, [p.id]: e.target.value }))}
                    onBlur={() => {
                      const name = (inlineNames[p.id] ?? '').trim();
                      if (name) onSavePerson(table.id, p.id, { name });
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    style={{
                      background: 'transparent', border: 'none', outline: 'none',
                      fontFamily: 'var(--font-display)', fontWeight: 600,
                      fontSize, lineHeight: 1,
                      color: 'var(--ink-900)',
                      textAlign: 'center',
                      width: '100%', minWidth: 0,
                      padding: '4px 8px',
                      caretColor: 'var(--mint-400)',
                    }}
                  />
                ) : (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize, lineHeight: 1, whiteSpace: 'nowrap', color: p.photo ? '#fff' : (named ? 'var(--ink-900)' : 'var(--ink-300)') }}>
                    {isMe ? 'You' : (named ? p.name : 'Add name')}
                  </span>
                )}
                {isPayer
                  ? <Badge color="mint" solid dot>paid last · {paidLabel(table.paidAt)}</Badge>
                  : (showNudge && !isMe && named)
                    ? <Badge color="neutral" dot><ShareUpIcon size={12} style={{ verticalAlign: '-1px', marginRight: 3 }} />not in sync</Badge>
                    : p.amount != null
                      ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span className="wp-amount" style={{ fontSize: 14, color: p.photo ? '#fff' : 'var(--text-muted)' }}>${p.amount.toFixed(2)}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: p.photo ? 'rgba(255,255,255,.55)' : 'var(--text-faint)', letterSpacing: '0.02em' }}>+ add payment</span>
                        </div>
                      : !isInlineEdit
                        ? <span style={{ fontSize: 12.5, fontWeight: 700, color: p.photo ? 'rgba(255,255,255,.85)' : 'var(--text-faint)' }}>
                            tap to edit
                          </span>
                        : null}
              </div>
            </div>
          </>
        );
        return isInlineEdit ? (
          <div key={p.id} onClick={() => onEditPerson(table.id, p.id)} style={bandStyle}>
            {bandInner}
          </div>
        ) : (
          <button key={p.id} onClick={() => onEditPerson(table.id, p.id)} style={bandStyle}>
            {bandInner}
          </button>
        );
      })}

      {/* the coin / puck — hidden while Pong game is playing */}
      <div ref={coinRef}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 30, cursor: 'grab', touchAction: 'none', width: COIN, height: COIN, display: mode === 'pong' ? 'none' : undefined }}>
        <div ref={shadowRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: COIN * 0.86, height: COIN * 0.86, borderRadius: '50%', background: 'rgba(28,27,41,.22)', filter: 'blur(11px)', zIndex: -1 }} />
        {/* scaleRef handles the grab-scale; squashRef handles bob + squash during flight */}
        <div ref={scaleRef} style={{ transformOrigin: '50% 50%' }}>
          <div ref={squashRef} style={{ animation: 'wp-coin-idle 2.8s ease-in-out infinite', transformOrigin: '50% 50%' }}>
            <GoldCoin size={COIN} mood={mood} drop={false} />
          </div>
        </div>
        {!hasPayer && mode === 'idle' && (
          <>
            <svg style={{ position: 'absolute', left: '50%', top: -(COIN / 2 + 26), transform: 'translateX(-50%)', color: 'var(--ink-400)', pointerEvents: 'none', animation: 'wp-hint-fade 2.4s 0.7s ease-out forwards', opacity: 0 }} width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
            <svg style={{ position: 'absolute', left: '50%', bottom: -(COIN / 2 + 26), transform: 'translateX(-50%)', color: 'var(--ink-400)', pointerEvents: 'none', animation: 'wp-hint-fade 2.4s 0.9s ease-out forwards', opacity: 0 }} width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
          </>
        )}
      </div>

      {/* top bar — hidden while Pong is running */}
      {mode !== 'pong' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 35, padding: 'var(--wp-pad-top) 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(180deg, rgba(255,247,238,.92), rgba(255,247,238,0))' }}>
        <IconButton label="Back" onClick={onBack}><Icon name="arrow-left" size={22} /></IconButton>
        <div style={{ display: 'flex', gap: 6 }}>
          {n < 4 && <IconButton label="Add person" onClick={() => onAddPerson(table.id)}><Icon name="user-plus" size={20} /></IconButton>}
          <div style={{ position: 'relative' }}>
            {showNudge && (
              <span style={{
                position: 'absolute', inset: -3, borderRadius: 999, pointerEvents: 'none',
                border: '2px solid var(--mint-400)',
                animation: 'wp-share-pulse 1.8s ease-out infinite',
              }} />
            )}
            <IconButton
              label="Invite"
              onClick={handleInvite}
              style={showNudge ? { background: 'var(--mint-50)' } : undefined}
            >
              <ShareUpIcon size={20} />
            </IconButton>
          </div>
        </div>
      </div>}

      {/* sync nudge tooltip */}
      {showNudge && (
        <div style={{
          position: 'absolute',
          top: 'calc(var(--wp-pad-top) + 60px)',
          right: 14,
          zIndex: 40,
          maxWidth: 226,
          pointerEvents: 'none',
        }}>
          {/* caret pointing up toward the share button */}
          <div style={{
            position: 'absolute',
            top: -7,
            right: 15,
            width: 14,
            height: 14,
            background: 'var(--ink-900)',
            transform: 'rotate(45deg)',
            borderRadius: 2,
          }} />
          <div style={{
            background: 'var(--ink-900)',
            color: 'var(--paper)',
            borderRadius: 16,
            padding: '12px 14px',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
              Share table with {other!.name} to be in sync
            </div>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--mint-300)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShareUpIcon size={12} />
              The coin's a shared responsibility ;-)
            </div>
          </div>
        </div>
      )}

      {/* FABs — dice (when no payer yet) + pong (2-person only) in bottom-right corner */}
      {mode === 'idle' && (!hasPayer || n === 2) && (
        <div style={{ position: 'absolute', right: 16, bottom: 'calc(16px + var(--wp-pad-bottom))', zIndex: 35, display: 'flex', alignItems: 'center', gap: 10 }}>
          {!hasPayer && (
            <button
              onClick={() => !flyingRef.current && glideTo(randomTarget())}
              aria-label="Roll the dice"
              style={{ width: 54, height: 54, borderRadius: 999, border: '2px solid var(--ink-900)', background: 'var(--sun-300)', color: 'var(--ink-900)', cursor: 'pointer', boxShadow: 'var(--pop-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="dices" size={26} />
            </button>
          )}
          {n === 2 && (
            <button onClick={startPong} aria-label="Play Pong"
              style={{ width: 54, height: 54, borderRadius: 999, border: '2px solid var(--ink-900)', background: 'var(--card)', color: 'var(--ink-900)', cursor: 'pointer', boxShadow: 'var(--pop-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <PongIcon size={26} />
            </button>
          )}
        </div>
      )}

      {/* Pong mini-game — renders over the table bands when mode === 'pong' */}
      {mode === 'pong' && n === 2 && (
        <PongGame
          topName={order[0].name || 'Them'}
          botName="You"
          topColor="#4DA2FF"
          botColor="#1FCD7C"
          target={3}
          onExit={() => setMode('idle')}
          onResult={onPongResult}
        />
      )}
    </div>
  );
}
