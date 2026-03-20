import type { RegionKey } from "@/lib/regions";

/**
 * Enhanced SVG map backgrounds with artistic elements for each region.
 * Features: detailed map outlines, grid lines, glow effects, dot patterns, and connection lines.
 * Uses white/light tones to ensure visibility against dark gradient backgrounds.
 */

const NAMap = () => (
  <svg viewBox="0 0 600 400" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="na-glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Background glow */}
    <ellipse cx="300" cy="180" rx="280" ry="180" fill="url(#na-glow)" />
    {/* Grid lines */}
    {[80, 140, 200, 260, 320].map(y => (
      <line key={`h${y}`} x1="50" y1={y} x2="550" y2={y} stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {[120, 200, 280, 360, 440].map(x => (
      <line key={`v${x}`} x1={x} y1="40" x2={x} y2="360" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {/* North America - detailed outline */}
    <path d="M180,45 L200,40 L225,38 L250,42 L275,38 L300,35 L330,40 L355,50 L375,55 L395,65 L410,80 L420,100 L425,125 L422,150 L415,170 L405,185 L395,195 L380,205 L365,215 L350,230 L335,245 L325,255 L310,265 L295,270 L280,275 L265,280 L250,278 L235,275 L220,280 L205,285 L190,290 L175,285 L160,275 L150,260 L142,245 L135,225 L130,205 L125,185 L120,165 L118,145 L115,125 L118,105 L122,85 L130,70 L145,55 L165,48 Z"
      fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
    {/* Alaska */}
    <path d="M100,55 L120,48 L140,45 L155,50 L148,58 L130,62 L112,60 Z"
      fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
    {/* Mexico & Central America */}
    <path d="M190,290 L200,300 L215,310 L230,315 L245,318 L255,325 L250,335 L240,340 L225,338 L210,330 L195,320 L185,305 L182,295 Z"
      fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
    {/* City dots - major tech hubs */}
    {[
      [280, 120], [310, 135], [350, 110], [395, 145], [260, 155],
      [290, 170], [340, 165], [370, 180], [250, 200], [310, 195],
      [220, 130], [335, 100], [380, 125], [265, 230], [300, 220],
    ].map(([cx, cy], i) => (
      <g key={`dot${i}`}>
        <circle cx={cx} cy={cy} r="2" fill="white" fillOpacity="0.6" />
        {i < 5 && <circle cx={cx} cy={cy} r="6" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="0.6" />}
      </g>
    ))}
    {/* Connection lines between hubs */}
    <path d="M280,120 L310,135 L350,110 L395,145" stroke="white" strokeOpacity="0.15" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
    <path d="M260,155 L290,170 L340,165 L370,180" stroke="white" strokeOpacity="0.12" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
  </svg>
);

const APACMap = () => (
  <svg viewBox="0 0 600 400" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="apac-glow" cx="45%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="280" cy="180" rx="280" ry="180" fill="url(#apac-glow)" />
    {/* Grid */}
    {[80, 140, 200, 260, 320].map(y => (
      <line key={`h${y}`} x1="30" y1={y} x2="570" y2={y} stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {[100, 180, 260, 340, 420, 500].map(x => (
      <line key={`v${x}`} x1={x} y1="40" x2={x} y2="360" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {/* East Asia (China, Japan, Korea) */}
    <path d="M120,50 L160,42 L200,45 L240,40 L280,48 L310,60 L330,80 L340,105 L338,130 L330,155 L315,170 L300,180 L280,185 L260,190 L240,195 L220,192 L200,185 L185,175 L170,160 L155,140 L140,120 L130,100 L122,80 L118,65 Z"
      fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
    {/* Japan */}
    <path d="M350,75 L360,70 L370,78 L375,95 L372,115 L365,130 L355,125 L348,110 L345,90 Z"
      fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
    {/* Southeast Asia */}
    <path d="M200,210 L230,205 L260,210 L290,220 L310,235 L305,255 L290,265 L270,270 L250,268 L230,260 L215,245 L205,230 Z"
      fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
    {/* India */}
    <path d="M100,150 L130,140 L155,148 L170,165 L175,185 L170,210 L160,230 L145,245 L130,250 L115,242 L105,225 L95,205 L90,180 L92,165 Z"
      fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
    {/* Australia */}
    <path d="M340,280 L370,270 L400,275 L430,285 L450,300 L455,320 L445,340 L425,350 L400,352 L375,345 L355,330 L345,310 L340,295 Z"
      fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
    {/* Indonesia archipelago */}
    <path d="M250,280 L270,278 L290,282 L310,285 L320,290 L310,295 L290,292 L270,290 L255,288 Z"
      fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.2" strokeWidth="0.6" />
    {/* City dots */}
    {[
      [260, 80], [300, 95], [355, 85], [150, 180], [230, 230],
      [280, 240], [390, 310], [180, 100], [320, 120], [130, 200],
      [270, 255], [200, 160], [340, 150], [110, 170], [250, 195],
    ].map(([cx, cy], i) => (
      <g key={`dot${i}`}>
        <circle cx={cx} cy={cy} r="2" fill="white" fillOpacity="0.6" />
        {i < 6 && <circle cx={cx} cy={cy} r="6" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="0.6" />}
      </g>
    ))}
    {/* Connection lines */}
    <path d="M260,80 L300,95 L355,85" stroke="white" strokeOpacity="0.15" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
    <path d="M150,180 L200,160 L250,195 L280,240" stroke="white" strokeOpacity="0.12" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
  </svg>
);

const EMEAMap = () => (
  <svg viewBox="0 0 600 400" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="emea-glow" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="280" cy="180" rx="280" ry="180" fill="url(#emea-glow)" />
    {/* Grid */}
    {[80, 140, 200, 260, 320].map(y => (
      <line key={`h${y}`} x1="30" y1={y} x2="570" y2={y} stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {[100, 180, 260, 340, 420, 500].map(x => (
      <line key={`v${x}`} x1={x} y1="40" x2={x} y2="360" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {/* Europe */}
    <path d="M160,40 L190,35 L220,38 L250,35 L280,40 L310,38 L335,45 L355,55 L365,70 L360,90 L350,105 L335,115 L315,120 L295,118 L275,122 L255,128 L235,125 L215,130 L195,128 L175,120 L160,108 L150,92 L148,72 L152,55 Z"
      fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
    {/* UK & Ireland */}
    <path d="M140,55 L155,50 L165,58 L162,72 L155,80 L145,78 L138,68 Z"
      fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
    {/* Scandinavia */}
    <path d="M260,20 L275,18 L290,25 L295,40 L288,55 L275,50 L265,40 L258,30 Z"
      fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
    {/* Middle East */}
    <path d="M370,130 L400,125 L425,135 L440,150 L445,170 L438,190 L425,200 L405,205 L385,200 L370,190 L365,170 L362,150 Z"
      fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
    {/* Africa */}
    <path d="M200,145 L230,140 L260,145 L280,155 L295,170 L305,190 L310,215 L308,240 L300,265 L288,285 L270,300 L250,310 L230,315 L210,310 L195,300 L182,280 L175,260 L172,235 L175,210 L180,190 L185,170 L190,155 Z"
      fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
    {/* City dots */}
    {[
      [200, 70], [250, 60], [300, 55], [340, 65], [155, 65],
      [280, 90], [320, 100], [400, 155], [420, 175], [240, 180],
      [260, 220], [280, 260], [230, 100], [190, 110], [350, 80],
    ].map(([cx, cy], i) => (
      <g key={`dot${i}`}>
        <circle cx={cx} cy={cy} r="2" fill="white" fillOpacity="0.6" />
        {i < 6 && <circle cx={cx} cy={cy} r="6" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="0.6" />}
      </g>
    ))}
    {/* Connection lines */}
    <path d="M155,65 L200,70 L250,60 L300,55 L340,65" stroke="white" strokeOpacity="0.15" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
    <path d="M280,90 L320,100 L400,155 L420,175" stroke="white" strokeOpacity="0.12" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
  </svg>
);

const ChinaMap = () => (
  <svg viewBox="0 0 600 400" fill="none" className="w-full h-full">
    <defs>
      <radialGradient id="cn-glow" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#fecaca" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#fecaca" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="300" cy="180" rx="280" ry="180" fill="url(#cn-glow)" />
    {/* Grid */}
    {[80, 140, 200, 260, 320].map(y => (
      <line key={`h${y}`} x1="50" y1={y} x2="550" y2={y} stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {[120, 200, 280, 360, 440].map(x => (
      <line key={`v${x}`} x1={x} y1="40" x2={x} y2="360" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
    ))}
    {/* China mainland - detailed */}
    <path d="M140,55 L175,45 L215,48 L255,42 L295,50 L330,60 L360,78 L385,100 L400,125 L408,155 L410,185 L405,210 L395,235 L380,255 L360,270 L340,280 L315,288 L290,292 L265,290 L240,285 L218,275 L198,260 L180,242 L165,220 L152,198 L142,175 L135,150 L130,125 L132,100 L136,78 Z"
      fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
    {/* Xinjiang region */}
    <path d="M100,80 L130,70 L155,75 L165,90 L160,110 L145,120 L125,118 L108,108 L98,95 Z"
      fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
    {/* Tibet region */}
    <path d="M105,130 L135,125 L160,135 L170,155 L165,175 L148,185 L125,180 L110,168 L100,150 Z"
      fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
    {/* Taiwan */}
    <path d="M420,215 L428,210 L435,218 L432,232 L425,238 L418,230 Z"
      fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
    {/* Hainan */}
    <path d="M310,300 L322,295 L330,305 L325,315 L315,318 L308,310 Z"
      fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
    {/* City dots - major data center hubs */}
    {[
      [380, 135], [395, 165], [360, 195], [340, 230], [310, 255],
      [270, 160], [300, 140], [250, 200], [220, 180], [280, 210],
      [350, 120], [320, 170], [290, 100], [240, 130], [200, 160],
    ].map(([cx, cy], i) => (
      <g key={`dot${i}`}>
        <circle cx={cx} cy={cy} r="2" fill="white" fillOpacity="0.6" />
        {i < 5 && <circle cx={cx} cy={cy} r="6" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="0.6" />}
      </g>
    ))}
    {/* Connection lines - data center corridors */}
    <path d="M380,135 L395,165 L360,195 L340,230 L310,255" stroke="white" strokeOpacity="0.15" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
    <path d="M270,160 L300,140 L350,120" stroke="white" strokeOpacity="0.12" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
    <path d="M220,180 L250,200 L280,210 L320,170" stroke="white" strokeOpacity="0.12" strokeWidth="0.6" fill="none" strokeDasharray="4 3" />
  </svg>
);

const regionMaps: Record<RegionKey, React.FC> = {
  na: NAMap,
  apac: APACMap,
  emea: EMEAMap,
  china: ChinaMap,
};

export default function RegionMapBg({ region }: { region: RegionKey }) {
  const MapComponent = regionMaps[region];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Full-bleed background - map layer rendered above gradient */}
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="w-[85%] h-full translate-x-[8%]">
          <MapComponent />
        </div>
      </div>
      {/* Left-side gradient overlay for text readability only */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
    </div>
  );
}
