/* @ds-bundle: {"format":3,"namespace":"WhoPaidDesignSystem_ce3383","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"SegmentedControl","sourcePath":"components/navigation/SegmentedControl.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"b333773cfb83","components/buttons/IconButton.jsx":"d172949bdcb7","components/data-display/Avatar.jsx":"da2df0526121","components/data-display/Badge.jsx":"f9352f112929","components/data-display/Card.jsx":"d6996c16cf6e","components/forms/Input.jsx":"03ddc2039b37","components/forms/Toggle.jsx":"66f4aebdf3a0","components/navigation/SegmentedControl.jsx":"b8451379ff4b","ui_kits/app/EditSheet.jsx":"3f8527c8b678","ui_kits/app/StartScreen.jsx":"0d3da9abd633","ui_kits/app/TableScreen.jsx":"61a386a2fed3","ui_kits/app/data.js":"b4ba55f6eed0","ui_kits/app/ios-frame.jsx":"be3343be4b51","ui_kits/app/util.jsx":"4dba195634bc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WhoPaidDesignSystem_ce3383 = window.WhoPaidDesignSystem_ce3383 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Inject component styles once. Real :hover/:active/:focus-visible states,
   driven entirely by the design-system CSS custom properties. */
const STYLE_ID = 'wp-button-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-btn {
    --_pop: var(--pop-brand);
    --_bg: var(--mint-400);
    --_fg: var(--text-on-brand);
    --_bd: transparent;
    display: inline-flex; align-items: center; justify-content: center;
    gap: var(--space-2);
    font-family: var(--font-display);
    font-weight: var(--fw-semibold);
    line-height: 1;
    border: 2px solid var(--_bd);
    background: var(--_bg);
    color: var(--_fg);
    border-radius: var(--radius-pill);
    box-shadow: var(--_pop);
    cursor: pointer;
    white-space: nowrap;
    transition: transform .08s ease, box-shadow .08s ease, background .15s ease, filter .15s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .wp-btn:hover { filter: brightness(1.04); }
  .wp-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--mint-600); }
  .wp-btn:focus-visible { outline: none; box-shadow: var(--_pop), var(--ring); }

  /* sizes */
  .wp-btn--sm { font-size: var(--fs-sm); padding: 9px 16px; }
  .wp-btn--md { font-size: var(--fs-body); padding: 13px 22px; }
  .wp-btn--lg { font-size: var(--fs-title); padding: 17px 30px; }

  /* variants */
  .wp-btn--accent { --_bg: var(--coral-400); --_fg: var(--text-on-accent); --_pop: var(--pop-accent); }
  .wp-btn--accent:active { box-shadow: 0 1px 0 var(--coral-600); }
  .wp-btn--sun { --_bg: var(--sun-300); --_fg: var(--ink-900); --_pop: var(--pop-sun); }
  .wp-btn--sun:active { box-shadow: 0 1px 0 var(--sun-500); }
  .wp-btn--secondary {
    --_bg: var(--card); --_fg: var(--text-strong); --_bd: var(--ink-900); --_pop: var(--pop-ink);
  }
  .wp-btn--secondary:active { box-shadow: 0 1px 0 var(--ink-900); }
  .wp-btn--ghost {
    --_bg: transparent; --_fg: var(--text-strong); --_pop: none;
  }
  .wp-btn--ghost:hover { background: rgba(28,27,41,0.06); filter: none; }
  .wp-btn--ghost:active { transform: translateY(1px); box-shadow: none; }

  .wp-btn--block { width: 100%; }
  .wp-btn[disabled] { opacity: .45; cursor: not-allowed; pointer-events: none; box-shadow: none; }
  `;
  document.head.appendChild(el);
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  ...rest
}) {
  const variantClass = variant === 'primary' ? '' : `wp-btn--${variant}`;
  const cls = ['wp-btn', `wp-btn--${size}`, variantClass, block ? 'wp-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-iconbutton-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-iconbtn {
    --_bg: var(--card);
    --_fg: var(--text-strong);
    --_bd: var(--border-card);
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--_bg);
    color: var(--_fg);
    border: 1.5px solid var(--_bd);
    border-radius: var(--radius-pill);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: transform .08s ease, background .15s ease, box-shadow .15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .wp-iconbtn:hover { background: var(--paper-2); }
  .wp-iconbtn:active { transform: scale(.92); }
  .wp-iconbtn:focus-visible { outline: none; box-shadow: var(--ring); }
  .wp-iconbtn--sm { width: 36px; height: 36px; }
  .wp-iconbtn--md { width: 44px; height: 44px; }
  .wp-iconbtn--lg { width: 52px; height: 52px; }
  .wp-iconbtn--solid { --_bg: var(--mint-400); --_fg: var(--text-on-brand); --_bd: transparent; }
  .wp-iconbtn--ghost { --_bg: transparent; --_bd: transparent; box-shadow: none; }
  .wp-iconbtn--ghost:hover { background: rgba(28,27,41,0.06); }
  .wp-iconbtn[disabled] { opacity: .4; pointer-events: none; }
  `;
  document.head.appendChild(el);
}
function IconButton({
  children,
  variant = 'default',
  size = 'md',
  label,
  className = '',
  ...rest
}) {
  const variantClass = variant === 'default' ? '' : `wp-iconbtn--${variant}`;
  const cls = ['wp-iconbtn', `wp-iconbtn--${size}`, variantClass, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-avatar-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-avatar {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: var(--radius-pill);
    font-family: var(--font-display);
    font-weight: var(--fw-semibold);
    color: #fff;
    background: var(--avatar-1);
    overflow: hidden;
    flex: none;
    line-height: 1;
    user-select: none;
  }
  .wp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .wp-avatar--ring { box-shadow: 0 0 0 3px var(--card), 0 0 0 5px var(--mint-400); }
  .wp-avatar--xs { width: 28px; height: 28px; font-size: 11px; }
  .wp-avatar--sm { width: 36px; height: 36px; font-size: 14px; }
  .wp-avatar--md { width: 48px; height: 48px; font-size: 18px; }
  .wp-avatar--lg { width: 64px; height: 64px; font-size: 24px; }
  .wp-avatar--xl { width: 88px; height: 88px; font-size: 34px; }
  `;
  document.head.appendChild(el);
}
const PALETTE = ['var(--avatar-1)', 'var(--avatar-2)', 'var(--avatar-3)', 'var(--avatar-4)', 'var(--avatar-5)', 'var(--avatar-6)', 'var(--avatar-7)', 'var(--avatar-8)'];
function hashName(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) | 0;
  return Math.abs(h);
}
function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function Avatar({
  name = '',
  src = null,
  size = 'md',
  color = null,
  ring = false,
  className = '',
  ...rest
}) {
  const bg = color || PALETTE[hashName(name) % PALETTE.length];
  const cls = ['wp-avatar', `wp-avatar--${size}`, ring ? 'wp-avatar--ring' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      background: src ? undefined : bg
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-badge-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-badge {
    --_bg: var(--mint-50);
    --_fg: var(--mint-700);
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-body);
    font-weight: var(--fw-extra);
    font-size: var(--fs-xs);
    letter-spacing: .01em;
    line-height: 1;
    padding: 6px 11px;
    border-radius: var(--radius-pill);
    background: var(--_bg);
    color: var(--_fg);
    white-space: nowrap;
  }
  .wp-badge--dot::before {
    content: ''; width: 7px; height: 7px; border-radius: 50%;
    background: currentColor; flex: none;
  }
  .wp-badge--mint    { --_bg: var(--mint-50);  --_fg: var(--mint-700); }
  .wp-badge--coral   { --_bg: var(--coral-50); --_fg: var(--coral-600); }
  .wp-badge--sun     { --_bg: var(--sun-50);   --_fg: var(--sun-500); }
  .wp-badge--sky     { --_bg: var(--sky-50);   --_fg: var(--sky-500); }
  .wp-badge--grape   { --_bg: var(--grape-50); --_fg: var(--grape-500); }
  .wp-badge--neutral { --_bg: var(--paper-2);  --_fg: var(--ink-700); }
  /* solid tone */
  .wp-badge--solid.wp-badge--mint    { --_bg: var(--mint-400);  --_fg: var(--text-on-brand); }
  .wp-badge--solid.wp-badge--coral   { --_bg: var(--coral-400); --_fg: #fff; }
  .wp-badge--solid.wp-badge--sun     { --_bg: var(--sun-300);   --_fg: var(--ink-900); }
  .wp-badge--solid.wp-badge--sky     { --_bg: var(--sky-300);   --_fg: #fff; }
  .wp-badge--solid.wp-badge--grape   { --_bg: var(--grape-300); --_fg: #fff; }
  .wp-badge--solid.wp-badge--neutral { --_bg: var(--ink-900);   --_fg: var(--paper); }
  `;
  document.head.appendChild(el);
}
function Badge({
  children,
  color = 'mint',
  solid = false,
  dot = false,
  className = '',
  ...rest
}) {
  const cls = ['wp-badge', `wp-badge--${color}`, solid ? 'wp-badge--solid' : '', dot ? 'wp-badge--dot' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-card-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-card {
    background: var(--surface-card);
    border: 1px solid var(--border-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
  .wp-card--pad-sm { padding: var(--space-4); }
  .wp-card--pad-md { padding: var(--space-6); }
  .wp-card--pad-lg { padding: var(--space-8); }
  /* playful "pop" card — chunky offset, sits on a colored base */
  .wp-card--pop {
    border: 2px solid var(--ink-900);
    box-shadow: var(--pop-ink);
  }
  /* tappable */
  .wp-card--interactive { cursor: pointer; transition: transform .1s ease, box-shadow .1s ease; }
  .wp-card--interactive:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .wp-card--interactive:active { transform: translateY(0); box-shadow: var(--shadow-sm); }
  /* tinted surfaces */
  .wp-card--mint  { background: var(--mint-50);  border-color: var(--mint-100); }
  .wp-card--sun   { background: var(--sun-50);   border-color: var(--sun-100); }
  .wp-card--sky   { background: var(--sky-50);   border-color: var(--sky-100); }
  .wp-card--sunken{ background: var(--surface-sunken); border-color: var(--border); box-shadow: none; }
  `;
  document.head.appendChild(el);
}
function Card({
  children,
  pad = 'md',
  tone = 'default',
  pop = false,
  interactive = false,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const toneClass = tone === 'default' ? '' : `wp-card--${tone}`;
  const cls = ['wp-card', `wp-card--pad-${pad}`, toneClass, pop ? 'wp-card--pop' : '', interactive ? 'wp-card--interactive' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-input-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-field { display: flex; flex-direction: column; gap: 7px; }
  .wp-field__label {
    font-family: var(--font-body); font-weight: var(--fw-extra);
    font-size: var(--fs-sm); color: var(--text-strong);
  }
  .wp-field__wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--card);
    border: 2px solid var(--border-card);
    border-radius: var(--radius-md);
    padding: 0 16px;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wp-field__wrap:focus-within { border-color: var(--mint-400); box-shadow: var(--ring); }
  .wp-field__prefix { font-family: var(--font-mono); font-weight: var(--fw-bold); color: var(--text-muted); }
  .wp-input {
    flex: 1; min-width: 0;
    border: none; outline: none; background: transparent;
    font-family: var(--font-body); font-size: var(--fs-body);
    color: var(--text-strong);
    padding: 13px 0;
  }
  .wp-input::placeholder { color: var(--text-faint); }
  .wp-input--amount { font-family: var(--font-mono); font-weight: var(--fw-bold); font-size: var(--fs-title); }
  .wp-field--error .wp-field__wrap { border-color: var(--coral-400); }
  .wp-field--error .wp-field__wrap:focus-within { box-shadow: 0 0 0 4px rgba(255,99,83,.25); }
  .wp-field__hint { font-size: var(--fs-xs); color: var(--text-muted); }
  .wp-field__hint--error { color: var(--coral-600); font-weight: var(--fw-bold); }
  `;
  document.head.appendChild(el);
}
function Input({
  label,
  prefix = null,
  hint = null,
  error = null,
  amount = false,
  className = '',
  id,
  ...rest
}) {
  const fieldId = id || `wp-input-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    className: ['wp-field', error ? 'wp-field--error' : '', className].filter(Boolean).join(' '),
    htmlFor: fieldId
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "wp-field__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "wp-field__wrap"
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: "wp-field__prefix"
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: ['wp-input', amount ? 'wp-input--amount' : ''].filter(Boolean).join(' ')
  }, rest))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: ['wp-field__hint', error ? 'wp-field__hint--error' : ''].filter(Boolean).join(' ')
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-toggle-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-toggle {
    display: inline-flex; align-items: center; gap: 12px;
    cursor: pointer; user-select: none;
    font-family: var(--font-body); font-weight: var(--fw-semibold);
    color: var(--text-strong); font-size: var(--fs-body);
  }
  .wp-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
  .wp-toggle__track {
    position: relative; flex: none;
    width: 52px; height: 32px;
    background: var(--ink-300);
    border-radius: var(--radius-pill);
    transition: background .18s ease;
  }
  .wp-toggle__thumb {
    position: absolute; top: 3px; left: 3px;
    width: 26px; height: 26px; border-radius: 50%;
    background: #fff; box-shadow: var(--shadow-sm);
    transition: transform .2s cubic-bezier(.34,1.56,.64,1);
  }
  .wp-toggle input:checked + .wp-toggle__track { background: var(--mint-400); }
  .wp-toggle input:checked + .wp-toggle__track .wp-toggle__thumb { transform: translateX(20px); }
  .wp-toggle input:focus-visible + .wp-toggle__track { box-shadow: var(--ring); }
  .wp-toggle--disabled { opacity: .5; pointer-events: none; }
  `;
  document.head.appendChild(el);
}
function Toggle({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  className = '',
  ...rest
}) {
  const cls = ['wp-toggle', disabled ? 'wp-toggle--disabled' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("label", {
    className: cls
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "wp-toggle__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wp-toggle__thumb"
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "wp-toggle__text"
  }, label));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'wp-segmented-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .wp-seg {
    display: inline-flex; padding: 4px; gap: 4px;
    background: var(--surface-sunken);
    border-radius: var(--radius-pill);
    border: 1px solid var(--border);
  }
  .wp-seg__opt {
    appearance: none; border: none; cursor: pointer;
    font-family: var(--font-display); font-weight: var(--fw-medium);
    font-size: var(--fs-sm);
    color: var(--text-muted);
    background: transparent;
    padding: 9px 18px;
    border-radius: var(--radius-pill);
    transition: color .15s ease, background .15s ease, box-shadow .15s ease;
    white-space: nowrap;
  }
  .wp-seg__opt:hover { color: var(--text-strong); }
  .wp-seg__opt[aria-selected="true"] {
    background: var(--card);
    color: var(--text-strong);
    box-shadow: var(--shadow-sm);
  }
  .wp-seg__opt:focus-visible { outline: none; box-shadow: var(--ring); }
  .wp-seg--block { display: flex; }
  .wp-seg--block .wp-seg__opt { flex: 1; text-align: center; }
  `;
  document.head.appendChild(el);
}
function SegmentedControl({
  options = [],
  value,
  onChange,
  block = false,
  className = '',
  ...rest
}) {
  const cls = ['wp-seg', block ? 'wp-seg--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    role: "tablist"
  }, rest), options.map(opt => {
    const val = typeof opt === 'string' ? opt : opt.value;
    const lbl = typeof opt === 'string' ? opt : opt.label;
    const selected = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": selected,
      className: "wp-seg__opt",
      onClick: () => onChange && onChange(val)
    }, lbl);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/EditSheet.jsx
try { (() => {
// Bottom sheet to edit one person on the table: name, amount, photo.
function EditSheet({
  table,
  person,
  ds,
  onClose,
  onSave,
  onMarkPaid
}) {
  const {
    Button,
    Input,
    Avatar
  } = ds;
  const {
    Icon
  } = window;
  const [name, setName] = React.useState(person.name || '');
  const [amount, setAmount] = React.useState(person.amount != null ? String(person.amount) : '');
  const [photo, setPhoto] = React.useState(person.photo || null);
  const fileRef = React.useRef(null);
  const isPayer = table.paidBy === person.id;
  const pickPhoto = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(f);
  };
  const save = () => onSave(table.id, person.id, {
    name: person.isMe ? person.name : name.trim() || '',
    amount: amount.trim() === '' ? null : parseFloat(amount) || 0,
    photo
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 90
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(28,27,41,.45)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--surface-app)',
      borderRadius: '28px 28px 0 0',
      padding: '12px 22px calc(22px + 18px)',
      boxShadow: 'var(--shadow-xl)',
      animation: 'wp-sheet-up .32s cubic-bezier(.34,1.3,.64,1) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 5,
      borderRadius: 99,
      background: 'var(--ink-300)',
      margin: '0 auto 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 23
    }
  }, person.isMe ? 'You' : person.name || 'Add name'), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      width: 36,
      height: 36,
      borderRadius: 99,
      border: 'none',
      cursor: 'pointer',
      background: 'var(--surface-sunken)',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => fileRef.current && fileRef.current.click(),
    style: {
      width: 76,
      height: 76,
      borderRadius: 20,
      flex: 'none',
      cursor: 'pointer',
      overflow: 'hidden',
      border: photo ? 'none' : '2px dashed var(--ink-300)',
      background: photo ? `center/cover url(${photo})` : 'var(--card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-300)'
    }
  }, !photo && /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15,
      color: 'var(--text-strong)'
    }
  }, photo ? 'Photo added' : 'Snap a photo'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 600,
      marginBottom: 8
    }
  }, "Fill their side of the table."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => fileRef.current && fileRef.current.click()
  }, photo ? 'Replace' : 'Add photo'), photo && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setPhoto(null)
  }, "Remove"))), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    onChange: pickPhoto,
    style: {
      display: 'none'
    }
  })), !person.isMe && /*#__PURE__*/React.createElement(Input, {
    label: "Their name",
    placeholder: "e.g. Daniel",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Amount they paid",
    prefix: "$",
    amount: true,
    inputMode: "decimal",
    placeholder: "0.00",
    value: amount,
    onChange: e => setAmount(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: save
  }, "Save"), !isPayer && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "coins",
      size: 20
    }),
    onClick: () => onMarkPaid(table.id, person.id)
  }, "Mark ", person.isMe ? 'you' : 'them', " as paid")))));
}
window.EditSheet = EditSheet;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/EditSheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/StartScreen.jsx
try { (() => {
// Landing: start a new table or open an existing one.
function MiniTable({
  table,
  ds
}) {
  // a tiny split-token preview showing which side the coin sits on
  const {
    paidLabel
  } = window;
  const n = table.people.length;
  const idx = table.people.findIndex(p => p.id === table.paidBy);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 46,
      borderRadius: 10,
      overflow: 'hidden',
      flex: 'none',
      border: '1.5px solid var(--border)',
      position: 'relative',
      background: 'var(--surface-sunken)'
    }
  }, table.people.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: `${i / n * 100}%`,
      height: `${1 / n * 100}%`,
      background: i === idx ? 'var(--mint-200)' : 'transparent',
      borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none'
    }
  })), idx >= 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: `${(idx + 0.5) / n * 100}%`,
      transform: 'translate(-50%,-50%)',
      width: 16,
      height: 16,
      borderRadius: 99,
      background: 'var(--mint-400)',
      border: '2px solid #fff'
    }
  }));
}
function StartScreen({
  ds,
  tables,
  meName,
  onOpen,
  onNew
}) {
  const {
    Button,
    Avatar,
    Badge
  } = ds;
  const {
    Icon,
    paidLabel
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 20px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      minHeight: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    alt: "",
    style: {
      width: 32,
      height: 32
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--ink-900)'
    }
  }, "Who", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--mint-500)'
    }
  }, "Paid"), "?")), /*#__PURE__*/React.createElement(Avatar, {
    name: "You",
    size: "md",
    ring: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 38,
      lineHeight: 1.02
    }
  }, "Whose round", /*#__PURE__*/React.createElement("br", null), "was it again?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 600,
      fontSize: 15,
      marginTop: 10
    }
  }, "One coin per table. Whoever paid keeps it \u2014 flick it over when it's your shout.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: onNew,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 22
    })
  }, "Start new table"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "wp-eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Your tables"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, tables.map(t => {
    const payer = t.people.find(p => p.id === t.paidBy);
    const payerName = payer ? payer.isMe ? 'You' : payer.name : '—';
    const others = t.people.filter(p => !p.isMe).map(p => p.name).join(' & ');
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onOpen(t.id),
      className: "wp-card wp-card--pad-md wp-card--interactive",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        font: 'inherit'
      }
    }, /*#__PURE__*/React.createElement(MiniTable, {
      table: t,
      ds: ds
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 17,
        color: 'var(--ink-900)'
      }
    }, others || 'New table'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)',
        marginTop: 2,
        fontWeight: 600
      }
    }, payer ? `${payerName} paid last · ${paidLabel(t.paidAt)}` : 'No coin tossed yet')), t.synced ? /*#__PURE__*/React.createElement(Badge, {
      color: "mint",
      dot: true
    }, "synced") : /*#__PURE__*/React.createElement(Badge, {
      color: "neutral"
    }, "just you"));
  }))));
}
window.StartScreen = StartScreen;
window.MiniTable = MiniTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/StartScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TableScreen.jsx
try { (() => {
// The table: the whole screen split into a band per person (you always at the
// bottom). A coin lives in the last payer's band; tap or flick it and it tumbles
// back and forth, always landing on the other side, stamping today's date.
function TableScreen({
  table,
  ds,
  meName,
  onBack,
  onPaid,
  onEditPerson,
  onAddPerson,
  onInvite,
  onMenu
}) {
  const {
    Avatar,
    Badge,
    IconButton
  } = ds;
  const {
    Icon,
    Confetti,
    paidLabel
  } = window;
  const order = table.people; // others first, "me" last (bottom)
  const n = order.length;
  const otherNames = order.filter(p => !p.isMe).map(p => p.name).filter(Boolean);
  const title = otherNames.join(' & ') || 'New table';
  const paidIdx = order.findIndex(p => p.id === table.paidBy);
  const hasPayer = paidIdx >= 0; // a fresh table has no payer yet

  const tableRef = React.useRef(null);
  const coinRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const flyingRef = React.useRef(false);
  const spinRef = React.useRef(0);
  const dragRef = React.useRef({
    active: false,
    moved: false
  });
  const [confetti, setConfetti] = React.useState(0);
  const hop = (y, dur, ease) => new Promise(res => {
    const w = coinRef.current;
    spinRef.current += 360;
    w.style.transition = `top ${dur}ms ${ease}, transform ${dur}ms ${ease}`;
    w.style.top = `${y}px`;
    w.style.transform = `translate(-50%,-50%) rotate(${spinRef.current}deg)`;
    setTimeout(res, dur);
  });
  const otherTarget = () => {
    if (!hasPayer) return Math.floor(Math.random() * n);
    if (n === 2) return paidIdx === 0 ? 1 : 0;
    const choices = order.map((_, i) => i).filter(i => i !== paidIdx);
    return choices[Math.floor(Math.random() * choices.length)];
  };
  async function flip(targetIdx) {
    if (flyingRef.current || !tableRef.current) return;
    flyingRef.current = true;
    if (hintRef.current) hintRef.current.style.opacity = '0';
    const H = tableRef.current.getBoundingClientRect().height;
    const centers = order.map((_, i) => H * (i + 0.5) / n);
    const topY = centers[0] + 6;
    const botY = centers[n - 1] - 6;
    const seq = [botY, topY, botY, topY, centers[targetIdx]];
    const durs = [150, 150, 165, 195, 360];
    for (let i = 0; i < seq.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await hop(seq[i], durs[i], i === seq.length - 1 ? 'cubic-bezier(.34,1.7,.5,1)' : 'cubic-bezier(.45,0,.55,1)');
    }
    coinRef.current.style.transition = '';
    flyingRef.current = false;
    setConfetti(c => c + 1);
    onPaid(table.id, order[targetIdx].id);
  }

  // drag / flick the coin
  const onDown = e => {
    if (flyingRef.current) return;
    e.stopPropagation();
    dragRef.current = {
      active: true,
      moved: false,
      startY: e.clientY
    };
    coinRef.current.setPointerCapture?.(e.pointerId);
  };
  const onMove = e => {
    const d = dragRef.current;
    if (!d.active) return;
    const rect = tableRef.current.getBoundingClientRect();
    const y = Math.max(44, Math.min(rect.height - 44, e.clientY - rect.top));
    const w = coinRef.current;
    w.style.transition = 'none';
    w.style.top = `${y}px`;
    if (Math.abs(e.clientY - d.startY) > 6) d.moved = true;
  };
  const onUp = () => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    flip(otherTarget());
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: tableRef,
    style: {
      position: 'relative',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--surface-app)'
    }
  }, confetti > 0 && /*#__PURE__*/React.createElement(Confetti, {
    key: confetti,
    count: 48
  }), order.map((p, i) => {
    const isPayer = hasPayer && i === paidIdx;
    const isMe = p.isMe;
    const named = p.name && p.name.trim().length > 0;
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => onEditPerson(table.id, p.id),
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${i / n * 100}%`,
        height: `${1 / n * 100}%`,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        padding: '0 24px',
        overflow: 'hidden',
        background: p.photo ? `center/cover url(${p.photo})` : isPayer ? 'var(--mint-50)' : isMe ? 'var(--surface-sunken)' : 'var(--card)',
        borderTop: i > 0 ? '1.5px solid var(--ink-100)' : 'none',
        transition: 'background .3s ease'
      }
    }, p.photo && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(28,27,41,.15), rgba(28,27,41,.55))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
      }
    }, !p.photo && (named ? /*#__PURE__*/React.createElement(Avatar, {
      name: isMe ? 'You' : p.name,
      size: n === 3 ? 'md' : 'lg',
      ring: isPayer
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        width: 60,
        height: 60,
        borderRadius: 99,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed var(--ink-300)',
        color: 'var(--ink-300)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 24
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: n === 3 ? 21 : 26,
        lineHeight: 1,
        color: p.photo ? '#fff' : named ? 'var(--ink-900)' : 'var(--ink-300)'
      }
    }, isMe ? 'You' : named ? p.name : 'Add name'), isPayer ? /*#__PURE__*/React.createElement(Badge, {
      color: p.photo ? 'mint' : 'mint',
      solid: true,
      dot: true
    }, "paid last \xB7 ", paidLabel(table.paidAt)) : p.amount ? /*#__PURE__*/React.createElement("span", {
      className: "wp-amount",
      style: {
        fontSize: 14,
        color: p.photo ? '#fff' : 'var(--text-muted)'
      }
    }, "$", p.amount.toFixed(2)) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: p.photo ? 'rgba(255,255,255,.85)' : 'var(--text-faint)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "image-plus",
      size: 13,
      style: {
        verticalAlign: '-2px',
        marginRight: 4
      }
    }), "tap to edit"))));
  }), /*#__PURE__*/React.createElement("div", {
    ref: coinRef,
    onPointerDown: onDown,
    onPointerMove: onMove,
    onPointerUp: onUp,
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      left: '50%',
      top: hasPayer ? `${(paidIdx + 0.5) / n * 100}%` : '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 30,
      cursor: 'grab',
      touchAction: 'none',
      width: 86,
      height: 86
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: -14,
      transform: 'translateX(-50%)',
      width: 56,
      height: 12,
      borderRadius: '50%',
      background: 'rgba(28,27,41,.18)',
      filter: 'blur(4px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      animation: 'wp-coin-idle 2.4s ease-in-out infinite'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/coin.svg",
    alt: "coin",
    draggable: "false",
    style: {
      width: 86,
      height: 86,
      display: 'block',
      filter: 'drop-shadow(0 6px 10px rgba(28,27,41,.22))',
      pointerEvents: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    ref: hintRef,
    style: {
      position: 'absolute',
      left: '50%',
      top: -34,
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      background: 'var(--ink-900)',
      color: 'var(--paper)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 11.5,
      padding: '5px 10px',
      borderRadius: 99,
      transition: 'opacity .3s',
      pointerEvents: 'none'
    }
  }, "\uD83D\uDC46 tap to flip")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 35,
      padding: '54px 14px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(180deg, rgba(255,247,238,.85), rgba(255,247,238,0))'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--ink-900)'
    }
  }, title), table.synced ? /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 13,
    style: {
      color: 'var(--mint-500)'
    }
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 13,
    style: {
      color: 'var(--ink-300)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, n < 3 && /*#__PURE__*/React.createElement(IconButton, {
    label: "Add person",
    onClick: () => onAddPerson(table.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-plus",
    size: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Invite",
    onClick: () => onInvite(table)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share-2",
    size: 20
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => !flyingRef.current && flip(otherTarget()),
    "aria-label": "Roulette",
    style: {
      position: 'absolute',
      right: 16,
      bottom: 'calc(18px + 26px)',
      zIndex: 35,
      width: 52,
      height: 52,
      borderRadius: 99,
      border: '2px solid var(--ink-900)',
      background: 'var(--sun-300)',
      color: 'var(--ink-900)',
      cursor: 'pointer',
      boxShadow: 'var(--pop-ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dices",
    size: 24
  })));
}
window.TableScreen = TableScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TableScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Mock data for Who Paid? — the table is a shared surface split per person.
// "me" is always the viewer (rendered at the bottom of the screen).
window.WP_DATA = {
  meName: 'Alex',
  tables: [{
    id: 't1',
    name: 'Daniel',
    synced: true,
    paidBy: 'p2',
    paidAt: '2026-06-13T20:30:00',
    people: [{
      id: 'p2',
      name: 'Daniel',
      photo: null,
      amount: 42
    }, {
      id: 'me',
      name: 'Me',
      isMe: true,
      photo: null,
      amount: null
    }]
  }, {
    id: 't2',
    name: 'Flat dinners',
    synced: true,
    paidBy: 'me',
    paidAt: '2026-06-14T19:00:00',
    people: [{
      id: 'p3',
      name: 'Noor',
      photo: null,
      amount: null
    }, {
      id: 'p4',
      name: 'Kim',
      photo: null,
      amount: 28
    }, {
      id: 'me',
      name: 'Me',
      isMe: true,
      photo: null,
      amount: null
    }]
  }, {
    id: 't3',
    name: 'Sofia',
    synced: false,
    paidBy: 'p5',
    paidAt: '2026-06-08T13:00:00',
    people: [{
      id: 'p5',
      name: 'Sofia',
      photo: null,
      amount: 16.5
    }, {
      id: 'me',
      name: 'Me',
      isMe: true,
      photo: null,
      amount: null
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/util.jsx
try { (() => {
// Shared helpers for the Who Paid? UI kit: Lucide <Icon>, <Confetti>, dates.

function Icon({
  name,
  size = 22,
  stroke = 2.25,
  style = {},
  className = ''
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    i.setAttribute('width', size);
    i.setAttribute('height', size);
    i.setAttribute('stroke-width', stroke);
    el.appendChild(i);
    window.lucide.createIcons();
  }, [name, size, stroke]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: className,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      lineHeight: 0,
      ...style
    }
  });
}

// Falling confetti for the moment the coin lands.
function Confetti({
  count = 50
}) {
  const colors = ['var(--mint-400)', 'var(--coral-400)', 'var(--sun-300)', 'var(--sky-300)', 'var(--grape-300)', '#fff'];
  const bits = React.useMemo(() => Array.from({
    length: count
  }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    dur: 1.3 + Math.random() * 1.2,
    size: 7 + Math.random() * 8,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
    round: Math.random() > 0.5
  })), [count]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 40
    }
  }, bits.map(b => /*#__PURE__*/React.createElement("span", {
    key: b.id,
    style: {
      position: 'absolute',
      top: -20,
      left: `${b.left}%`,
      width: b.size,
      height: b.size * (b.round ? 1 : 0.5),
      background: b.color,
      borderRadius: b.round ? '50%' : 2,
      transform: `rotate(${b.rot}deg)`,
      animation: `wp-fall ${b.dur}s ${b.delay}s cubic-bezier(.4,.1,.7,1) forwards`
    }
  })));
}
const WP_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// "Today" / "Yesterday" / "14 Jun" from an ISO date string.
function paidLabel(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date('2026-06-15T12:00:00');
  const days = Math.round((new Date(now.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return `${d.getDate()} ${WP_MONTHS[d.getMonth()]}`;
}
function todayISO() {
  return '2026-06-15T12:00:00';
}
if (typeof document !== 'undefined' && !document.getElementById('wp-kit-anims')) {
  const s = document.createElement('style');
  s.id = 'wp-kit-anims';
  s.textContent = `
    @keyframes wp-fall { to { transform: translateY(900px) rotate(720deg); opacity: 0; } }
    @keyframes wp-pop-in { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes wp-rise { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes wp-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes wp-coin-idle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .wp-pop-in { animation: wp-pop-in .5s cubic-bezier(.34,1.56,.64,1) both; }
    .wp-rise { animation: wp-rise .4s ease both; }
  `;
  document.head.appendChild(s);
}
Object.assign(window, {
  Icon,
  Confetti,
  paidLabel,
  todayISO
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/util.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

})();
