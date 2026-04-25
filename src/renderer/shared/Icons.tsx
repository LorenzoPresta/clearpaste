/**
 * ClearPaste — Professional SVG Icon Library
 * All icons are inline SVGs for crisp rendering at any size.
 * Uses currentColor for easy color inheritance from CSS.
 */

interface IconProps {
  size?: number
  className?: string
  color?: string
  strokeWidth?: number
}

/** Gear / Settings icon — for the General tab */
export function SettingsIcon({ size = 16, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

/** Palette icon — for the Appearance tab */
export function PaletteIcon({ size = 16, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="13.5" cy="6.5" r="0.5" fill={color || 'currentColor'} stroke="none" />
      <circle cx="17.5" cy="10.5" r="0.5" fill={color || 'currentColor'} stroke="none" />
      <circle cx="8.5" cy="7.5" r="0.5" fill={color || 'currentColor'} stroke="none" />
      <circle cx="6.5" cy="12.5" r="0.5" fill={color || 'currentColor'} stroke="none" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}

/** Sparkles icon — for AutomaticClean tab and cleaning badge */
export function SparklesIcon({ size = 16, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  )
}

/** Ban / Block icon — for the Ignore tab */
export function BanIcon({ size = 16, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  )
}

/** Pin icon — for pinned items */
export function PinIcon({ size = 12, className, color, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'} stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 2-2V3H6v1a2 2 0 0 0 2 2 1 1 0 0 1 1 1z" />
    </svg>
  )
}

/** Check circle icon — for success results */
export function CheckCircleIcon({ size = 18, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/** Party / Celebration icon — for clean text result */
export function PartyIcon({ size = 18, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5.8 11.3 2 22l10.7-3.79" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.63-.69 1.06-1.32 1.03h-.01c-.77-.04-1.4.6-1.36 1.38c.02.42-.21.8-.56 1.01l-1.13.7" />
      <path d="m14 21.3-1.94-1.11a.96.96 0 0 0-1.09.11l-2.08 1.8" />
    </svg>
  )
}

/** Shield icon — for safety section */
export function ShieldIcon({ size = 16, className, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/** Logo icon — ClearPaste clipboard + sparkle SVG logo with animated gradient */
export function LogoIcon({ size = 28, className }: IconProps) {
  // Use unique ID to avoid conflicts when multiple logos render
  const gradId = `logo-grad-${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1">
            <animate attributeName="stop-color" values="#6366f1;#22d3ee;#a78bfa;#6366f1" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#a78bfa">
            <animate attributeName="stop-color" values="#a78bfa;#6366f1;#22d3ee;#a78bfa" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      {/* Clipboard body */}
      <rect x="4" y="4" width="16" height="18" rx="2" ry="2" stroke={`url(#${gradId})`} strokeWidth="1.8" fill="none" />
      {/* Clipboard clip */}
      <path d="M9 2h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke={`url(#${gradId})`} strokeWidth="1.8" fill="none" />
      {/* Sparkle center */}
      <path d="M12 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={`url(#${gradId})`} stroke="none" />
    </svg>
  )
}
