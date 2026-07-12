export function StayCardSkeleton() {
  return (
    <article className="stay-card stay-card--skeleton" aria-hidden="true">
      <div className="stay-card__media stay-card__media--skeleton" />
      <div className="stay-card__body">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-row">
          <div className="skeleton-chip" />
          <div className="skeleton-chip" />
        </div>
        <div className="skeleton-button" />
      </div>
    </article>
  );
}
