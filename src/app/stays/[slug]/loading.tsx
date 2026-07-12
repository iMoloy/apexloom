export default function StayDetailsLoading() {
  return (
    <main className="details-page">
      <section className="details-hero">
        <div className="details-copy">
          <p className="section-kicker">Stay details</p>
          <h1>Loading this ApexLoom stay.</h1>
          <p>The gallery, specifications, and guest notes are on the way.</p>
        </div>
        <div className="details-gallery">
          <div className="details-gallery__item details-gallery__item--loading" />
          <div className="details-gallery__item details-gallery__item--loading" />
          <div className="details-gallery__item details-gallery__item--loading" />
        </div>
      </section>
    </main>
  );
}
