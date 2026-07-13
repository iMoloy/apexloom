import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import type { StayItem } from "@/data/stays";
import { buildStayArtUrl } from "@/lib/stays";

type StayCardProps = {
  stay: StayItem;
  isPreview?: boolean;
};

export function StayCard({ stay, isPreview = false }: StayCardProps) {
  // Compute color scheme for preview illustration
  const getPreviewColors = (col: string) => {
    if (col === "Quiet City Stays") {
      return { base: "#274037", accent: "#d8cbb7", soft: "#8fa89d" };
    }
    if (col === "Slow Weekend Houses") {
      return { base: "#705139", accent: "#f0e2cf", soft: "#d5af8f" };
    }
    return { base: "#1f2f34", accent: "#efe0c7", soft: "#7fa0a1" };
  };

  const colors = getPreviewColors(stay.collection);

  return (
    <article className="stay-card">
      <div className="stay-card__media">
        <div className="stay-card__badge-row">
          <span className="stay-card__badge">{stay.collection || "Quiet City Stays"}</span>
          <span className="stay-card__badge stay-card__badge--soft">{stay.stayType || "House"}</span>
        </div>
        {isPreview ? (
          <div 
            className="absolute inset-0 flex flex-col justify-between p-4 text-[#fffdf8] overflow-hidden"
            style={{ backgroundColor: colors.base }}
          >
            {/* Background elements */}
            <div 
              className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full opacity-35" 
              style={{ backgroundColor: colors.soft }}
            />
            <div 
              className="absolute inset-x-0 bottom-0 h-1/2 opacity-90"
              style={{ 
                background: `linear-gradient(to bottom, transparent, ${colors.accent})`,
                clipPath: "ellipse(80% 50% at 50% 100%)" 
              }}
            />
            {/* Live details overlay */}
            <div className="relative z-10 space-y-1">
              <span className="text-[8px] uppercase tracking-wider opacity-60">Preview Artwork</span>
              <h4 className="text-sm font-display font-medium leading-tight truncate">{stay.title || "Solenne House"}</h4>
              <p className="text-[9px] opacity-80">{stay.location || "Lisbon"}, {stay.country || "Portugal"}</p>
            </div>
            <div className="relative z-10 mt-auto text-[8px] opacity-75">
              <span>{stay.bestFor || "Design-minded city breaks"}</span>
            </div>
          </div>
        ) : (
          <Image
            src={buildStayArtUrl(stay.slug, "cover")}
            alt={`${stay.title} illustration`}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 25vw"
            unoptimized
          />
        )}
      </div>
      <div className="stay-card__body">
        <div className="stay-card__topline">
          <span>{stay.location || "Location"}, {stay.country || "Country"}</span>
          <strong>${stay.pricePerNight || 0}/night</strong>
        </div>
        <h3>{stay.title || "Property Title"}</h3>
        <p className="line-clamp-2">{stay.shortDescription || "Curated stay description details will display here in real-time."}</p>
        <div className="stay-card__meta">
          <span>
            <Star size={15} aria-hidden="true" />
            {stay.rating} ({stay.reviewCount})
          </span>
          <span>
            <MapPin size={15} aria-hidden="true" />
            {stay.bestFor || "Best for"}
          </span>
        </div>
        {isPreview ? (
          <span className="stay-card__action text-center opacity-50 select-none">
            Preview Mode
          </span>
        ) : (
          <Link className="stay-card__action" href={`/stays/${stay.slug}`}>
            View details
          </Link>
        )}
      </div>
    </article>
  );
}

