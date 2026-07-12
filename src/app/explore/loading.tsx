import { StayGridSkeleton } from "@/components/stays/StayGridSkeleton";

export default function ExploreLoading() {
  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="section-kicker">Explore stays</p>
        <h1>Loading the current stay selection.</h1>
        <p>Curated homes, city apartments, and signature retreats are on the way.</p>
      </section>

      <section className="catalog-shell">
        <div className="explore-filters explore-filters--loading" />
        <div className="catalog-results">
          <div className="catalog-results__header">
            <div>
              <p className="section-kicker">Catalog results</p>
              <h2>Preparing the current result set.</h2>
            </div>
          </div>
          <StayGridSkeleton />
        </div>
      </section>
    </main>
  );
}
