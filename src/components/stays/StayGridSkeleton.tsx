import { StayCardSkeleton } from "@/components/stays/StayCardSkeleton";

type StayGridSkeletonProps = {
  count?: number;
};

export function StayGridSkeleton({ count = 8 }: StayGridSkeletonProps) {
  return (
    <div className="stay-grid">
      {Array.from({ length: count }, (_, index) => (
        <StayCardSkeleton key={index} />
      ))}
    </div>
  );
}
