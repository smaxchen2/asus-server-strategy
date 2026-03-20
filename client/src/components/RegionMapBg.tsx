import type { RegionKey } from "@/lib/regions";

/**
 * Simplified SVG map silhouettes for each region.
 * Rendered as a decorative background element with low opacity.
 */

const NAMap = () => (
  <svg viewBox="0 0 400 300" fill="currentColor" opacity="0.08" className="w-full h-full">
    {/* North America simplified outline */}
    <path d="M120,20 L160,15 L200,25 L240,20 L280,30 L310,25 L340,40 L360,60 L370,90 L365,120 L350,140 L340,160 L320,170 L300,180 L280,200 L260,220 L240,240 L220,250 L200,245 L180,240 L160,250 L140,260 L120,255 L100,240 L90,220 L80,200 L70,180 L65,160 L60,140 L55,120 L50,100 L55,80 L60,60 L70,45 L90,30 Z" />
    <path d="M140,260 L130,275 L120,280 L110,275 L115,265 L125,260 Z" />
    <path d="M200,250 L210,265 L220,275 L210,280 L195,270 L190,260 Z" />
  </svg>
);

const APACMap = () => (
  <svg viewBox="0 0 400 300" fill="currentColor" opacity="0.08" className="w-full h-full">
    {/* Asia Pacific simplified outline */}
    <path d="M50,60 L80,50 L120,45 L160,50 L200,40 L240,45 L270,55 L290,70 L300,90 L295,110 L280,130 L260,140 L240,135 L220,140 L200,150 L180,145 L160,150 L140,160 L120,155 L100,140 L80,120 L65,100 L55,80 Z" />
    <path d="M280,150 L300,155 L320,170 L330,190 L325,210 L310,225 L290,230 L270,220 L260,200 L265,180 L275,165 Z" />
    <path d="M180,170 L200,175 L220,185 L230,200 L225,215 L210,225 L190,220 L175,205 L170,190 Z" />
    <path d="M100,180 L120,175 L140,185 L150,200 L145,220 L130,235 L110,230 L95,215 L90,195 Z" />
    <path d="M310,240 L330,245 L345,260 L340,275 L325,280 L310,270 L305,255 Z" />
  </svg>
);

const EMEAMap = () => (
  <svg viewBox="0 0 400 300" fill="currentColor" opacity="0.08" className="w-full h-full">
    {/* Europe, Middle East & Africa simplified outline */}
    <path d="M120,30 L160,25 L200,30 L240,28 L270,35 L290,45 L300,60 L295,80 L280,95 L260,100 L240,95 L220,100 L200,105 L180,100 L160,105 L140,100 L120,90 L110,75 L105,55 L110,40 Z" />
    <path d="M180,110 L200,115 L220,120 L240,130 L250,145 L245,165 L235,180 L220,190 L200,195 L180,200 L165,210 L155,230 L150,250 L155,270 L165,280 L155,285 L140,275 L130,260 L125,240 L130,220 L140,200 L150,185 L160,170 L165,150 L170,130 Z" />
    <path d="M250,150 L270,145 L290,155 L300,170 L295,190 L280,200 L265,195 L255,180 L250,165 Z" />
  </svg>
);

const ChinaMap = () => (
  <svg viewBox="0 0 400 300" fill="currentColor" opacity="0.08" className="w-full h-full">
    {/* China simplified outline */}
    <path d="M100,40 L140,30 L180,35 L220,30 L260,40 L290,55 L310,75 L320,100 L325,130 L320,155 L310,175 L295,190 L275,200 L255,210 L235,220 L215,225 L195,230 L175,225 L155,215 L140,200 L125,185 L115,165 L105,145 L95,120 L90,95 L92,70 L95,55 Z" />
    <path d="M260,210 L280,215 L295,225 L300,240 L290,255 L275,260 L260,250 L255,235 L258,220 Z" />
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-end pr-8">
      <div className="w-[300px] h-[200px] lg:w-[400px] lg:h-[280px]">
        <MapComponent />
      </div>
    </div>
  );
}
