import { HomeLanding } from "@/components/home/HomeLanding";
import { getFeaturedStays } from "@/lib/staysServer";

export default async function Home() {
  const featuredStays = await getFeaturedStays();
  return <HomeLanding featuredStays={featuredStays} />;
}
