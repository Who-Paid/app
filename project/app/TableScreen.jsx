// The table: the whole screen split into a band per person (you always at the
// bottom). A coin lives in the last payer's band. Tap or flick it and it glides
// like a hockey puck — slapping the top/bottom boards, ricocheting, then settling
// on the other side and stamping today's date. The 🎲 dice picks a seat at random.
function TableScreen({ table, ds, meName, onBack, onPaid, onEditPerson, onAddPerson, onInvite }) {
  const { Avatar, Badge, IconButton } = ds;
  const { Icon, Confetti, paidLabel } = window;

  const order = table.people;            // others first, "me" last (bottom)
  const n = order.length;
  const otherNames = order.filter((p) => !p.isMe).map((p) => p.name).filter(Boolean);
  const title = otherNames.join(' & ') || 'New table';
  const paidIdx = order.findIndex((p) => p.id === table.paidBy);
  const hasPayer = paidIdx >= 0;

  const tableRef = React.useRef(null);
  const coinRef = React.useRef(null);
  const squashRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const flyingRef = React.useRef(false);
  const spinRef = React.useRef(0);
  const dragRef = React.useRef({ active: false, moved: false });
  const [confetti, setConfetti] = React.useState(0);

  const COIN = 86, MARGIN = 7;

  // Where the coin rests inside a band: pulled toward the screen's center line
  // (the "table" between people) and clamped on-screen, so it never lands on top
  // of that person's avatar + name.
  const landY = (i, H) => {
    const bandH = H / n;
    const c = (i + 0.5) * bandH;
    const dir = c < H / 2 ? 1 : -1;            // nudge toward the middle of the screen
    const y = c + dir * bandH * 0.36;
    const top = COIN / 2 + MARGIN + (i === 0 ? 40 : 0);   // keep clear of the top bar
    const bot = H - (COIN / 2 + MARGIN);
    return Math.max(top, Math.min(bot, y));
  };

  // Position the coin imperatively so React's re-renders don't fight the rAF
  // animation. Runs on mount and whenever the payer / table / count changes.
  React.useLayoutEffect(() => {
    if (flyingRef.current) return;
    const el = tableRef.current, w = coinRef.current;
    if (!el || !w) return;
    const H = el.clientHeight;
    if (!H) return;
    w.style.transition = 'none';
    w.style.top = `${hasPayer ? landY(paidIdx, H) : H / 2}px`;
    w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;
  }, [table.id, table.paidBy, n]);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  // manual flick → the OTHER side (someone else paid). dice → any seat at random.
  const otherTarget = () => {
    if (!hasPayer || n > 2) {
      const pool = order.map((_, i) => i).filter((i) => i !== paidIdx);
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return paidIdx === 0 ? 1 : 0;
  };
  const randomTarget = () => Math.floor(Math.random() * n);

  // The coin behaves like a bouncing ball: it ricochets off the top & bottom
  // edges of the screen a few times, losing energy on each hit (slower leg + a
  // softer impact squash), then rolls to a stop on the chosen person's side.
  // Driven by a single requestAnimationFrame loop so the motion stays buttery.
  function glideTo(targetIdx, fromY) {
    if (flyingRef.current || !tableRef.current) return;
    flyingRef.current = true;
    if (hintRef.current) hintRef.current.style.opacity = '0';

    const w = coinRef.current, squash = squashRef.current;
    if (squash) squash.style.animation = 'none';
    w.style.transition = 'none';

    const H = tableRef.current.clientHeight;
    const Yt = COIN / 2 + MARGIN;
    const Yb = H - (COIN / 2 + MARGIN);
    const startY = fromY != null ? fromY : (hasPayer ? landY(paidIdx, H) : H / 2);
    const targetY = landY(targetIdx, H);

    // alternate board hits, starting with whichever end we're heading toward
    const NHITS = 5;
    let board = startY < H / 2 ? Yb : Yt;
    const segs = [];
    let from = startY, dur = 230;
    for (let k = 0; k < NHITS; k++) {
      segs.push({ from, to: board, dur, ease: easeOutCubic, strength: Math.max(0.22, 1 - 0.17 * k) });
      from = board;
      board = board === Yb ? Yt : Yb;
      dur *= 1.12;                              // each leg a touch slower — energy bleeding off
    }
    segs.push({ from, to: targetY, dur: Math.max(400, dur * 1.05), ease: easeOutBack, strength: 0 });

    let segI = 0, segStart = null, prevY = startY, contactT = -1, contactStr = 0;

    function frame(now) {
      if (segStart == null) segStart = now;
      const seg = segs[segI];
      let t = (now - segStart) / seg.dur;
      if (t > 1) t = 1;
      const y = seg.from + (seg.to - seg.from) * seg.ease(t);

      spinRef.current += (y - prevY) * 0.5;     // roll in proportion to travel + direction
      prevY = y;
      w.style.top = `${y}px`;
      w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;

      if (squash) {                             // impact squash, decaying over ~160ms
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
          setConfetti((c) => c + 1);
          onPaid(table.id, order[targetIdx].id);
        }
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // drag / flick
  const onDown = (e) => {
    if (flyingRef.current) return;
    e.stopPropagation();
    dragRef.current = { active: true, moved: false, startY: e.clientY };
    coinRef.current.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const el = tableRef.current;
    const rect = el.getBoundingClientRect();
    const scale = rect.height / el.clientHeight || 1;        // stage is transform: scale()-ed
    const H = el.clientHeight;
    const y = Math.max(COIN / 2, Math.min(H - COIN / 2, (e.clientY - rect.top) / scale));
    const w = coinRef.current;
    w.style.transition = 'none';
    w.style.top = `${y}px`;
    if (Math.abs(e.clientY - d.startY) > 6) d.moved = true;
  };
  const onUp = () => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    const cur = parseFloat(coinRef.current.style.top);
    if (d.moved && !Number.isNaN(cur)) glideTo(otherTarget(), cur);
    else glideTo(otherTarget());
  };

  return (
    <div ref={tableRef} style={{ position: 'relative', height: '100%', overflow: 'hidden', background: 'var(--surface-app)' }}>
      {confetti > 0 && <Confetti key={confetti} count={48} />}

      {/* bands */}
      {order.map((p, i) => {
        const isPayer = hasPayer && i === paidIdx;
        const isMe = p.isMe;
        const named = p.name && p.name.trim().length > 0;
        return (
          <button key={p.id} onClick={() => onEditPerson(table.id, p.id)} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${(i / n) * 100}%`, height: `${(1 / n) * 100}%`,
            border: 'none', cursor: 'pointer', textAlign: 'center', width: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 7, padding: '0 24px', overflow: 'hidden',
            background: p.photo ? `center/cover url(${p.photo})`
              : isPayer ? 'var(--mint-50)' : (isMe ? 'var(--surface-sunken)' : 'var(--card)'),
            borderTop: i > 0 ? '1.5px solid var(--ink-100)' : 'none',
            transition: 'background .3s ease',
          }}>
            {p.photo && <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,27,41,.15), rgba(28,27,41,.55))' }} />}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {!p.photo && (named
                ? <Avatar name={isMe ? 'You' : p.name} size={n === 3 ? 'md' : 'lg'} ring={isPayer} />
                : <span style={{ width: 60, height: 60, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--ink-300)', color: 'var(--ink-300)' }}><Icon name="user-plus" size={24} /></span>)}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: n === 3 ? 21 : 26, lineHeight: 1, whiteSpace: 'nowrap', color: p.photo ? '#fff' : (named ? 'var(--ink-900)' : 'var(--ink-300)') }}>
                  {isMe ? 'You' : (named ? p.name : 'Add name')}
                </span>
                {isPayer
                  ? <Badge color="mint" solid dot>paid last · {paidLabel(table.paidAt)}</Badge>
                  : p.amount
                    ? <span className="wp-amount" style={{ fontSize: 14, color: p.photo ? '#fff' : 'var(--text-muted)' }}>${p.amount.toFixed(2)}</span>
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
          <img src="assets/coin.svg" alt="coin" draggable="false"
            style={{ width: COIN, height: COIN, display: 'block', filter: 'drop-shadow(0 6px 10px rgba(28,27,41,.22))', pointerEvents: 'none' }} />
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
          {n < 3 && <IconButton label="Add person" onClick={() => onAddPerson(table.id)}><Icon name="user-plus" size={20} /></IconButton>}
          <IconButton label="Invite" onClick={() => onInvite(table)}><Icon name="share-2" size={20} /></IconButton>
        </div>
      </div>

      {/* dice — prominent call-out while the coin's in the middle; a quiet FAB once set */}
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

window.TableScreen = TableScreen;
