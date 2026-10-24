const base = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconoFoto = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m21 16-5-5-8 8" />
  </svg>
);

export const IconoVideo = () => (
  <svg {...base}>
    <rect x="3" y="6" width="13" height="12" rx="3" />
    <path d="m16 10 5-3v10l-5-3" />
  </svg>
);

export const Icono360 = () => (
  <svg {...base}>
    <ellipse cx="12" cy="12" rx="9" ry="4" />
    <path d="M12 3v2M12 19v2M8 12h.01M16 12h.01" />
    <path d="m15 18 2 1-1 2" />
  </svg>
);

export const IconoFlecha = ({ className = "" }: { className?: string }) => (
  <svg {...base} width={20} height={20} strokeWidth={2} className={className}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
