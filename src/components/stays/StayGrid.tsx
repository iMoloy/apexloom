import type { StayItem } from "@/data/stays";
import { StayCard } from "@/components/stays/StayCard";

type StayGridProps = {
  items: StayItem[];
};

export function StayGrid({ items }: StayGridProps) {
  return (
    <div className="stay-grid">
      {items.map((stay) => (
        <StayCard key={stay.slug} stay={stay} />
      ))}
    </div>
  );
}
