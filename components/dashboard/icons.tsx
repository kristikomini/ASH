/* Lightweight inline stroke icons (currentColor). 20×20 grid, no dependencies. */
type P = { className?: string };
const base = "h-5 w-5";

const S = ({ className, children }: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? base}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconGrid = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </S>
);
export const IconInbox = (p: P) => (
  <S {...p}>
    <path d="M3 12l3-7h12l3 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M3 12h5l1.5 2.5h5L16 12h5" />
  </S>
);
export const IconLayers = (p: P) => (
  <S {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </S>
);
export const IconCalendar = (p: P) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </S>
);
export const IconFile = (p: P) => (
  <S {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </S>
);
export const IconSearch = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </S>
);
export const IconBell = (p: P) => (
  <S {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9z" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </S>
);
export const IconPlus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const IconMenu = (p: P) => (
  <S {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </S>
);
export const IconX = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);
export const IconArrowUp = (p: P) => (
  <S {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </S>
);
export const IconArrowDown = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M18 13l-6 6-6-6" />
  </S>
);
export const IconArrowUpRight = (p: P) => (
  <S {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </S>
);
export const IconChevronRight = (p: P) => (
  <S {...p}>
    <path d="M9 6l6 6-6 6" />
  </S>
);
export const IconExternal = (p: P) => (
  <S {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </S>
);
export const IconPhone = (p: P) => (
  <S {...p}>
    <path d="M4 5c0 9 6 15 15 15l1.5-3.5-4-2-2 2c-2-1-4-3-5-5l2-2-2-4z" />
  </S>
);
export const IconMail = (p: P) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </S>
);
export const IconPin = (p: P) => (
  <S {...p}>
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </S>
);
export const IconClock = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </S>
);
export const IconTrend = (p: P) => (
  <S {...p}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M21 7h-5M21 7v5" />
  </S>
);
export const IconEuro = (p: P) => (
  <S {...p}>
    <path d="M15 7a5 5 0 1 0 0 10M6 10h6M6 14h6" />
  </S>
);
