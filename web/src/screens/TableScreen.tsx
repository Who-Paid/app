import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Table } from '../lib/types';
import { paidLabel } from '../lib/util';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { IconButton } from '../components/ui/IconButton';
import { Icon } from '../components/ui/Icon';
import { ShareUpIcon } from '../components/ui/ShareUpIcon';
import { Confetti } from '../components/Confetti';
import { GoldCoin, type Mood } from '../components/GoldCoin';

const COIN = 86;
const MARGIN = 7;

interface Props {
  table: Table;
  onBack: () => void;
  onPaid: (tableId: string, personId: string) => void;
  onEditPerson: (tableId: string, personId: string) => void;
  onAddPerson: (tableId: string) => void;
  onInvite: (table: Table) => void;
}

export function TableScreen({ table, onBack, onPaid, onEditPerson, onAddPerson, onInvite }: Props) {
  const order = table.people; // others first, "me" last (bottom)
  const n = order.length;
  const otherNames = order.filter((p) => !p.isMe).map((p) => p.name).filter(Boolean);
  const title = otherNames.join(' & ') || 'New table';
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

  const tableRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const flyingRef = useRef(false);
  const spinRef = useRef(0);
  const dragRef = useRef({ active: false, moved: false, startY: 0 });
  const [confetti, setConfetti] = useState(0);
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

  // The coin behaves like a bouncing ball: ricochets off the top & bottom edges a
  // few times, losing energy on each hit, then rolls to a stop on the chosen side.
  // For the 2×2 grid (n=4) a smooth CSS arc is used instead.
  function glideTo(targetIdx: number, fromY?: number) {
    if (flyingRef.current || !tableRef.current) return;
    flyingRef.current = true;
    setMood('flick');
    if (hintRef.current) hintRef.current.style.opacity = '0';

    const w = coinRef.current!, squash = squashRef.current;
    const H = tableRef.current.clientHeight;

    if (n === 4) {
      const targetY = landY4(targetIdx, H);
      const targetX = targetIdx % 2 === 0 ? 25 : 75;
      if (squash) { squash.style.animation = 'none'; void squash.offsetWidth; squash.style.animation = 'ck-spinfly .9s cubic-bezier(.5,0,.4,1)'; }
      w.style.transition = 'none';
      void w.offsetWidth;
      w.style.transition = 'top .9s cubic-bezier(.45,-.1,.4,1.15), left .9s cubic-bezier(.45,-.1,.4,1.15)';
      w.style.top = `${targetY}px`;
      w.style.left = `${targetX}%`;
      w.style.transform = 'translate(-50%,-50%)';
      setTimeout(() => {
        w.style.transition = '';
        if (squash) squash.style.animation = 'wp-coin-idle 2.8s ease-in-out infinite';
        flyingRef.current = false;
        setMood(order[targetIdx].isMe ? 'pay' : 'safe');
        setConfetti((c) => c + 1);
        onPaid(table.id, order[targetIdx].id);
      }, 940);
      return;
    }

    if (squash) squash.style.animation = 'none';
    w.style.transition = 'none';

    const Yt = COIN / 2 + MARGIN;
    const Yb = H - (COIN / 2 + MARGIN);
    const startY = fromY != null ? fromY : (hasPayer ? landY(paidIdx, H) : H / 2);
    const targetY = landY(targetIdx, H);

    const NHITS = 5;
    let board = startY < H / 2 ? Yb : Yt;
    const segs: { from: number; to: number; dur: number; ease: (t: number) => number; strength: number }[] = [];
    let from = startY, dur = 230;
    for (let k = 0; k < NHITS; k++) {
      segs.push({ from, to: board, dur, ease: easeOutCubic, strength: Math.max(0.22, 1 - 0.17 * k) });
      from = board;
      board = board === Yb ? Yt : Yb;
      dur *= 1.12;
    }
    segs.push({ from, to: targetY, dur: Math.max(400, dur * 1.05), ease: easeOutBack, strength: 0 });

    let segI = 0, segStart: number | null = null, prevY = startY, contactT = -1, contactStr = 0;

    function frame(now: number) {
      if (segStart == null) segStart = now;
      const seg = segs[segI];
      let t = (now - segStart) / seg.dur;
      if (t > 1) t = 1;
      const y = seg.from + (seg.to - seg.from) * seg.ease(t);

      spinRef.current += (y - prevY) * 0.5;
      prevY = y;
      w.style.top = `${y}px`;
      w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;

      if (squash) {
        const s = contactT < 0 ? 0 : contactStr * Math.max(0, 1 - (now - contactT) / 160);
        squash.style.transform = `scaleX(${1 + 0.22 * s}) scaleY(${1 - 0.22 * s})`;
      }

      if (t >= 1) {
        if (segI < segs.length - 1) {
          contactT = now;
          contactStr = seg.strength;
          segI += 1;
          segStart = now;
          requestAnimationFrame(frame);
        } else {
          if (squash) {
            squash.style.transform = '';
            squash.style.animation = 'wp-coin-idle 2.8s ease-in-out infinite';
          }
          w.style.transition = '';
          flyingRef.current = false;
          setMood(order[targetIdx].isMe ? 'pay' : 'safe');
          setConfetti((c) => c + 1);
          onPaid(table.id, order[targetIdx].id);
        }
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const onDown = (e: React.PointerEvent) => {
    if (flyingRef.current) return;
    e.stopPropagation();
    dragRef.current = { active: true, moved: false, startY: e.clientY };
    coinRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    if (Math.abs(e.clientY - d.startY) > 6) d.moved = true;
    if (n === 4) return; // 2×2 doesn't support drag-to-aim
    const el = tableRef.current!;
    const rect = el.getBoundingClientRect();
    const scale = rect.height / el.clientHeight || 1;
    const H = el.clientHeight;
    const y = Math.max(COIN / 2, Math.min(H - COIN / 2, (e.clientY - rect.top) / scale));
    const w = coinRef.current!;
    w.style.transition = 'none';
    w.style.top = `${y}px`;
  };
  const onUp = () => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (n === 4) { glideTo(randomTarget()); return; }
    const cur = parseFloat(coinRef.current!.style.top);
    if (d.moved && !Number.isNaN(cur)) glideTo(otherTarget(), cur);
    else glideTo(otherTarget());
  };

  return (
    <div ref={tableRef} style={{ position: 'relative', height: '100%', overflow: 'hidden', background: 'var(--surface-app)' }}>
      {confetti > 0 && <Confetti key={confetti} count={48} />}

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
        return (
          <button key={p.id} onClick={() => onEditPerson(table.id, p.id)} style={{
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
          }}>
            {p.photo && <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,27,41,.15), rgba(28,27,41,.55))' }} />}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: is4 ? 5 : 8 }}>
              {!p.photo && (named
                ? <Avatar name={isMe ? 'You' : p.name} size={avatarSize} ring={isPayer} />
                : <span style={{ width: addBox, height: addBox, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--ink-300)', color: 'var(--ink-300)' }}><Icon name="user-plus" size={addIcon} /></span>)}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize, lineHeight: 1, whiteSpace: 'nowrap', color: p.photo ? '#fff' : (named ? 'var(--ink-900)' : 'var(--ink-300)') }}>
                  {isMe ? 'You' : (named ? p.name : 'Add name')}
                </span>
                {isPayer
                  ? <Badge color="mint" solid dot>paid last · {paidLabel(table.paidAt)}</Badge>
                  : (showNudge && !isMe && named)
                    ? <Badge color="neutral" dot><ShareUpIcon size={12} style={{ verticalAlign: '-1px', marginRight: 3 }} />not in sync</Badge>
                    : p.amount != null
                      ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span className="wp-amount" style={{ fontSize: 14, color: p.photo ? '#fff' : 'var(--text-muted)' }}>${p.amount.toFixed(2)}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: p.photo ? 'rgba(255,255,255,.55)' : 'var(--text-faint)', letterSpacing: '0.02em' }}>+ add payment</span>
                        </div>
                      : <span style={{ fontSize: 12.5, fontWeight: 700, color: p.photo ? 'rgba(255,255,255,.85)' : 'var(--text-faint)' }}>
                          <Icon name="image-plus" size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />tap to edit
                        </span>}
              </div>
            </div>
          </button>
        );
      })}

      {/* the coin / puck */}
      <div ref={coinRef}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 30, cursor: 'grab', touchAction: 'none', width: COIN, height: COIN }}>
        <div style={{ position: 'absolute', left: '50%', bottom: -13, transform: 'translateX(-50%)', width: 58, height: 12, borderRadius: '50%', background: 'rgba(28,27,41,.16)', filter: 'blur(4px)' }} />
        <div ref={squashRef} style={{ animation: 'wp-coin-idle 2.8s ease-in-out infinite', transformOrigin: '50% 50%' }}>
          <GoldCoin size={COIN} mood={mood} drop={false} />
        </div>
        <div ref={hintRef} style={{ position: 'absolute', left: '50%', top: -34, transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'var(--ink-900)', color: 'var(--paper)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, padding: '5px 10px', borderRadius: 99, transition: 'opacity .3s', pointerEvents: 'none' }}>👆 flick to flip</div>
      </div>

      {/* top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 35, padding: 'var(--wp-pad-top) 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(180deg, rgba(255,247,238,.92), rgba(255,247,238,0))' }}>
        <IconButton label="Back" onClick={onBack}><Icon name="arrow-left" size={22} /></IconButton>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink-900)' }}>{title}</span>
          {table.synced ? <Icon name="refresh-cw" size={13} style={{ color: 'var(--mint-500)' }} /> : <Icon name="link" size={13} style={{ color: 'var(--ink-300)' }} />}
        </div>
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
      </div>

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

      {/* dice */}
      {!hasPayer ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(26px + var(--wp-pad-bottom))', zIndex: 35, display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
          <button onClick={() => !flyingRef.current && glideTo(randomTarget())}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 13, cursor: 'pointer',
              padding: '14px 24px 14px 18px', borderRadius: 999, border: '2px solid var(--ink-900)',
              background: 'var(--sun-300)', color: 'var(--ink-900)', boxShadow: 'var(--pop-ink)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, textAlign: 'left', lineHeight: 1.12,
            }}>
            <Icon name="dices" size={30} />
            <span style={{ whiteSpace: 'nowrap' }}>Let the dice decide<br />who pays today</span>
          </button>
        </div>
      ) : (
        <button onClick={() => !flyingRef.current && glideTo(randomTarget())} aria-label="Let the dice decide"
          style={{ position: 'absolute', right: 16, bottom: 'calc(16px + var(--wp-pad-bottom))', zIndex: 35, width: 54, height: 54, borderRadius: 999, border: '2px solid var(--ink-900)', background: 'var(--sun-300)', color: 'var(--ink-900)', cursor: 'pointer', boxShadow: 'var(--pop-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="dices" size={26} />
        </button>
      )}
    </div>
  );
}
