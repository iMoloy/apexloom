type BrandLogoProps = {
  priority?: boolean;
};

export function BrandLogo({ priority = false }: BrandLogoProps) {
  return (
    <div className={priority ? "brand-mark brand-mark--large" : "brand-mark"} aria-label="ApexLoom">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 37.5 23.9 8l5.9 10.95-3.7 6.58-2.2-4.09-9.3 16.06H8Z" fill="currentColor" />
        <path d="M20.2 37.5 29.8 20l3.56 6.56-6.2 10.94h-6.96Z" fill="currentColor" opacity=".55" />
        <path d="M29.17 37.5 34.12 28l5.88 9.5h-10.83Z" fill="currentColor" opacity=".25" />
        <path d="M17 31.5h15.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="brand-wordmark">ApexLoom</span>
    </div>
  );
}
