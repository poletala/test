import type { SVGProps } from 'react';

export type IconName =
  | 'dashboard'
  | 'practice'
  | 'readiness'
  | 'bookmark'
  | 'sun'
  | 'moon'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'close'
  | 'clock'
  | 'target'
  | 'flame'
  | 'chart'
  | 'book'
  | 'refresh'
  | 'play'
  | 'shield'
  | 'code'
  | 'chevron-down'
  | 'menu'
  | 'trophy'
  | 'sparkles'
  | 'alert'
  | 'lightbulb'
  | 'trash'
  | 'arrow-up-right'
  | 'layers';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

function IconPaths({ name }: { name: IconName }) {
  switch (name) {
    case 'dashboard':
      return (
        <>
          <rect x="3" y="3" width="7" height="8" rx="1.6" />
          <rect x="14" y="3" width="7" height="5" rx="1.6" />
          <rect x="14" y="12" width="7" height="9" rx="1.6" />
          <rect x="3" y="15" width="7" height="6" rx="1.6" />
        </>
      );
    case 'practice':
      return (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
          <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
          <path d="M8 7.5h8M8 11h6" />
        </>
      );
    case 'readiness':
      return (
        <>
          <path d="M12 3a9 9 0 1 0 9 9" />
          <path d="M12 7a5 5 0 1 0 5 5" />
          <path d="m12 12 7-7" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
        </>
      );
    case 'bookmark':
      return <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z" />;
    case 'sun':
      return (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
        </>
      );
    case 'moon':
      return <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8z" />;
    case 'arrow-right':
      return (
        <>
          <path d="M4 12h16" />
          <path d="m14 6 6 6-6 6" />
        </>
      );
    case 'arrow-left':
      return (
        <>
          <path d="M20 12H4" />
          <path d="m10 18-6-6 6-6" />
        </>
      );
    case 'arrow-up-right':
      return (
        <>
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </>
      );
    case 'check':
      return <path d="m4.5 12.5 5 5L20 6.5" />;
    case 'close':
      return <path d="M5 5l14 14M19 5 5 19" />;
    case 'clock':
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.2 2" />
        </>
      );
    case 'target':
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </>
      );
    case 'flame':
      return <path d="M12 21c4 0 6.5-2.6 6.5-6.1 0-3.2-2-5.6-3.7-7.5-.8-.9-1.6-1.9-2-3.4-2.7 1.5-4.1 3.7-4.1 5.7 0 1.3.5 2.3 1.2 3.2-1.5.4-2.6 1.7-2.6 3.4C7.3 19 9.2 21 12 21z" />;
    case 'chart':
      return (
        <>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </>
      );
    case 'book':
      return (
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </>
      );
    case 'refresh':
      return (
        <>
          <path d="M20 7a8 8 0 1 0 1 7" />
          <path d="M20 3v4h-4" />
        </>
      );
    case 'play':
      return <path d="m8 5 11 7-11 7z" />;
    case 'shield':
      return <path d="M12 3 5 6v5.5c0 4.3 2.9 7.7 7 9.5 4.1-1.8 7-5.2 7-9.5V6z" />;
    case 'code':
      return (
        <>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </>
      );
    case 'chevron-down':
      return <path d="m6 9 6 6 6-6" />;
    case 'menu':
      return <path d="M4 6h16M4 12h16M4 18h16" />;
    case 'trophy':
      return (
        <>
          <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
          <path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" />
          <path d="M12 13v5M8 21h8M9 18h6" />
        </>
      );
    case 'sparkles':
      return (
        <>
          <path d="M12 3c.4 3.8 2.2 5.6 6 6-3.8.4-5.6 2.2-6 6-.4-3.8-2.2-5.6-6-6 3.8-.4 5.6-2.2 6-6z" />
          <path d="M19 14c.2 1.9 1.1 2.8 3 3-1.9.2-2.8 1.1-3 3-.2-1.9-1.1-2.8-3-3 1.9-.2 2.8-1.1 3-3z" />
        </>
      );
    case 'alert':
      return (
        <>
          <path d="M12 3 2.5 20h19z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
        </>
      );
    case 'lightbulb':
      return (
        <>
          <path d="M9 18h6M10 21h4" />
          <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.6-1.2 1.5-1.2 2.5H9.7c0-1-.4-1.9-1.2-2.5z" />
        </>
      );
    case 'trash':
      return (
        <>
          <path d="M4 7h16M10 11v6M14 11v6" />
          <path d="M6 7l1 14h10l1-14M9 7V4h6v3" />
        </>
      );
    case 'layers':
      return (
        <>
          <path d="m12 3 9 5-9 5-9-5z" />
          <path d="m3 13 9 5 9-5M3 17l9 5 9-5" />
        </>
      );
    default:
      return null;
  }
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <IconPaths name={name} />
    </svg>
  );
}
