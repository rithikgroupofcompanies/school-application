// Colors.js — Ocean / Deep Blue theme
// Usage in JSX: className="bg-[var(--color-accent)]"
// Usage in style: style={{ color: 'var(--color-accent)' }}

const colors = {
  primaryDark:      '#050D1A',   // deepest ocean floor
  primaryDarker:    '#02080F',   // abyss
  accent:           '#38BDF8',   // bright cyan surface glint
  accentHover:      '#0EA5E9',   // deeper cyan on hover
  accentLight:      '#03111E',   // faint cyan tint bg
  bgPage1:          '#071220',   // dark navy page bg
  bgPage2:          '#0A1628',   // slightly lighter navy
  bgIcon:           '#0F2338',   // icon container
  bgCard:           '#0C1C30',   // card surface
  borderDefault:    '#112840',   // subtle border
  textPrimary:      '#E0EEF8',   // cool off-white
  textMuted:        '#5A8FAA',   // muted blue-grey
  textHeaderSub:    '#ffffff',   // subdued header text
  shadowAccentMd:   'rgba(56, 189, 248, 0.20)',
  shadowAccentSm:   'rgba(56, 189, 248, 0.10)',
  shadowCard:       'rgba(0, 0, 0, 0.45)',
  shadowCardSm:     'rgba(0, 0, 0, 0.30)',
  shadowAvatar:     'rgba(56, 189, 248, 0.30)',
  shadowBadge:      'rgba(56, 189, 248, 0.20)',
};

export function injectTheme() {
  const root = document.documentElement;
  root.style.setProperty('--color-primary-dark',     colors.primaryDark);
  root.style.setProperty('--color-primary-darker',   colors.primaryDarker);
  root.style.setProperty('--color-accent',           colors.accent);
  root.style.setProperty('--color-accent-hover',     colors.accentHover);
  root.style.setProperty('--color-accent-light',     colors.accentLight);
  root.style.setProperty('--color-bg-page-1',        colors.bgPage1);
  root.style.setProperty('--color-bg-page-2',        colors.bgPage2);
  root.style.setProperty('--color-bg-icon',          colors.bgIcon);
  root.style.setProperty('--color-bg-card',          colors.bgCard);
  root.style.setProperty('--color-border',           colors.borderDefault);
  root.style.setProperty('--color-text-primary',     colors.textPrimary);
  root.style.setProperty('--color-text-muted',       colors.textMuted);
  root.style.setProperty('--color-text-header-sub',  colors.textHeaderSub);
  root.style.setProperty('--color-shadow-accent-md', colors.shadowAccentMd);
  root.style.setProperty('--color-shadow-accent-sm', colors.shadowAccentSm);
  root.style.setProperty('--color-shadow-card',      colors.shadowCard);
  root.style.setProperty('--color-shadow-card-sm',   colors.shadowCardSm);
  root.style.setProperty('--color-shadow-avatar',    colors.shadowAvatar);
  root.style.setProperty('--color-shadow-badge',     colors.shadowBadge);
}

export default colors;