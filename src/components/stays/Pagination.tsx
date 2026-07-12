import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function buildPageHref(
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page") {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/explore?${query}` : "/explore";
}

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Explore pagination">
      <Link
        aria-disabled={currentPage === 1}
        className={`pagination-link ${currentPage === 1 ? "is-disabled" : ""}`}
        href={buildPageHref(searchParams, currentPage - 1)}
      >
        Previous
      </Link>
      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <Link
            aria-current={page === currentPage ? "page" : undefined}
            className={`pagination-page ${page === currentPage ? "is-active" : ""}`}
            href={buildPageHref(searchParams, page)}
            key={page}
          >
            {page}
          </Link>
        ))}
      </div>
      <Link
        aria-disabled={currentPage === totalPages}
        className={`pagination-link ${currentPage === totalPages ? "is-disabled" : ""}`}
        href={buildPageHref(searchParams, currentPage + 1)}
      >
        Next
      </Link>
    </nav>
  );
}
