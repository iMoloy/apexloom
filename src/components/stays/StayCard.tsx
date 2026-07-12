import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import type { StayItem } from "@/data/stays";
import { buildStayArtUrl } from "@/lib/stays";

type StayCardProps = {
  stay: StayItem;
};

export function StayCard({ stay }: StayCardProps) {
  return (
    <article className="stay-card">
      <div className="stay-card__media">
        <div className="stay-card__badge-row">
          <span className="stay-card__badge">{stay.collection}</span>
          <span className="stay-card__badge stay-card__badge--soft">{stay.stayType}</span>
        </div>
        <Image
          src={buildStayArtUrl(stay.slug, "cover")}
          alt={`${stay.title} illustration`}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 25vw"
          unoptimized
        />
      </div>
      <div className="stay-card__body">
        <div className="stay-card__topline">
          <span>{stay.location}, {stay.country}</span>
          <strong>${stay.pricePerNight}/night</strong>
        </div>
        <h3>{stay.title}</h3>
        <p>{stay.shortDescription}</p>
        <div className="stay-card__meta">
          <span>
            <Star size={15} aria-hidden="true" />
            {stay.rating} ({stay.reviewCount})
          </span>
          <span>
            <MapPin size={15} aria-hidden="true" />
            {stay.bestFor}
          </span>
        </div>
        <Link className="stay-card__action" href={`/stays/${stay.slug}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
