import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Bath, BedDouble, MapPin, Star, Users } from "lucide-react";
import { StayGrid } from "@/components/stays/StayGrid";
import { getRelatedStays, getStayBySlug, buildStayArtUrl } from "@/lib/stays";

type StayDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: StayDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stay = getStayBySlug(slug);

  if (!stay) {
    return { title: "Stay not found" };
  }

  return {
    title: stay.title,
    description: stay.shortDescription,
  };
}

export default async function StayDetailsPage({ params }: StayDetailsPageProps) {
  const { slug } = await params;
  const stay = getStayBySlug(slug);

  if (!stay) {
    notFound();
  }

  const relatedStays = getRelatedStays(stay);
  const galleryScenes = ["cover", "lounge", "suite"] as const;

  return (
    <main className="details-page">
      <section className="details-hero">
        <div className="details-copy">
          <Link className="inline-link" href="/explore">
            Back to explore
          </Link>
          <p className="section-kicker">{stay.collection}</p>
          <h1>{stay.title}</h1>
          <p>{stay.shortDescription}</p>
          <div className="details-meta">
            <span>
              <MapPin size={16} aria-hidden="true" />
              {stay.location}, {stay.country}
            </span>
            <span>
              <Star size={16} aria-hidden="true" />
              {stay.rating} rating from {stay.reviewCount} reviews
            </span>
            <span>${stay.pricePerNight} / night</span>
          </div>
          <div className="details-pills">
            <span>{stay.stayType}</span>
            <span>{stay.guestCount} guests</span>
            <span>{stay.bestFor}</span>
          </div>
        </div>

        <div className="details-gallery">
          {galleryScenes.map((scene, index) => (
            <div className="details-gallery__item" key={scene}>
              <Image
                src={buildStayArtUrl(stay.slug, scene)}
                alt={`${stay.title} ${stay.galleryLabels[index]}`}
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      <section className="details-shell">
        <div className="details-content">
          <article className="details-panel">
            <p className="section-kicker">Overview</p>
            <h2>Description and atmosphere</h2>
            <p>{stay.fullDescription}</p>
          </article>

          <article className="details-panel">
            <p className="section-kicker">Host note</p>
            <h2>What guests should know before arriving</h2>
            <p>{stay.hostNote}</p>
          </article>

          <article className="details-panel">
            <p className="section-kicker">Reviews</p>
            <h2>Recent guest notes</h2>
            <div className="review-list">
              {stay.reviews.map((review) => (
                <div className="review-card" key={review.author}>
                  <p>{review.quote}</p>
                  <div>
                    <strong>{review.author}</strong>
                    <span>
                      {review.role} · {review.rating}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="details-sidebar">
          <article className="details-panel">
            <p className="section-kicker">Specifications</p>
            <h2>Key information</h2>
            <div className="spec-grid">
              <span>
                <Users size={16} aria-hidden="true" />
                Up to {stay.guestCount} guests
              </span>
              <span>
                <BedDouble size={16} aria-hidden="true" />
                {stay.bedrooms} bedrooms
              </span>
              <span>
                <Bath size={16} aria-hidden="true" />
                {stay.baths} baths
              </span>
              <span>{stay.stayType}</span>
            </div>
            <p className="details-best-for">
              Best for: <strong>{stay.bestFor}</strong>
            </p>
            <ul className="amenity-list">
              {stay.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <section className="details-related">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Related stays</p>
            <h2>More homes from the same travel rhythm.</h2>
          </div>
          <p className="section-copy">
            Each related stay keeps a similar feel while offering a different city,
            pace, or group setup.
          </p>
        </div>
        <StayGrid items={relatedStays} />
      </section>
    </main>
  );
}
