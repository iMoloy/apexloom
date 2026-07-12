import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function Home() {
  return (
    <main className="foundation-page">
      <section className="foundation-intro">
        <p className="eyebrow">Thoughtful stays, well chosen</p>
        <BrandLogo priority />
        <div className="foundation-copy">
          <h1>A better way to find the places that stay with you.</h1>
          <p>
            ApexLoom brings together remarkable homes, slow escapes, and design-led
            spaces worth travelling for.
          </p>
          <a className="text-link" href="#newsletter">
            Join the first release <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
