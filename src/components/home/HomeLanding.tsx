import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { StayGrid } from "@/components/stays/StayGrid";
import {
  collections,
  faqItems,
  heroMetrics,
  impactStats,
  journalEntries,
  journeySteps,
  storyCards,
  testimonials,
} from "@/data/home";
import { getFeaturedStays } from "@/lib/staysServer";

const collectionToneClass: Record<(typeof collections)[number]["tone"], string> = {
  forest: "collection-card collection-card--forest",
  clay: "collection-card collection-card--clay",
  paper: "collection-card collection-card--paper",
};

export function HomeLanding() {
  const featuredStays = getFeaturedStays();

  return (
    <main className="landing-page">
      <section className="hero-shell">
        <div className="hero-grid">
          <div className="hero-panel">
            <div className="hero-ribbon">
              <p className="eyebrow">Thoughtful stays, well chosen</p>
              <span className="hero-ribbon__tag">Editorial selection</span>
            </div>
            <BrandLogo priority />
            <div className="foundation-copy">
              <h1>A better way to find the places that stay with you.</h1>
              <p>
                ApexLoom brings together remarkable homes, slow escapes, and
                design-led spaces worth travelling for.
              </p>
            </div>
            <div className="hero-actions">
              <a className="hero-button" href="#collections">
                Explore collections
              </a>
              <a className="text-link" href="#journal">
                Read the journal <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="hero-ledger">
              <div>
                <span>Current release</span>
                <strong>City stays, slow houses, signature retreats</strong>
              </div>
              <div>
                <span>Built for</span>
                <strong>Guests who choose with taste and intent</strong>
              </div>
            </div>
          </div>

          <div className="hero-aside">
            <div className="hero-note">
              <span>Editorial note</span>
              <p>
                Every stay is screened for atmosphere, clarity, and the details
                guests actually rely on once the trip begins.
              </p>
            </div>
            <div className="hero-spotlight">
              <span>What makes ApexLoom different</span>
              <h3>We edit the catalog before you ever start comparing it.</h3>
            </div>
            <div className="hero-metrics">
              {heroMetrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-intro" id="discover">
        <div className="section-heading">
          <p className="section-kicker">Why people start here</p>
          <h2>A travel platform shaped by taste, clarity, and real-world use.</h2>
        </div>
        
        {/* Bespoke Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          {/* Card 1: Design First (Spans 2 columns on desktop) */}
          <div className="md:col-span-2 bg-white border border-[#d9d2c6]/60 p-8 rounded-2xl shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c46c42] block">Design-first</span>
              <h3 className="text-2xl font-display font-medium text-[#111827]">
                Spaces chosen for atmosphere, not volume
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed max-w-lg">
                We shortlist properties with character, calm layouts, and the kind of details that shape the whole stay. Our curators inspect each property against rigorous design standards.
              </p>
            </div>
            
            {/* Visual Mock Curation Checklist */}
            <div className="bg-[#f5f2ea]/40 border border-[#d9d2c6]/40 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-semibold text-[#111827]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                <span>Verified Natural Light</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                <span>Considered Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest" />
                <span>Acoustic Validation</span>
              </div>
            </div>
          </div>

          {/* Card 2: Local Rhythm (Spans 1 column) */}
          <div className="bg-white border border-[#d9d2c6]/60 p-8 rounded-2xl shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c46c42] block">Local rhythm</span>
              <h3 className="text-xl font-display font-medium text-[#111827]">
                Travel guides to help you move like you belong
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Practical neighborhood timing suggestions, bakery routes, and sunset walks curated by local hosts.
              </p>
            </div>

            {/* Visual Mock Host Schedule Timeline */}
            <div className="border-l border-[#d9d2c6] pl-3.5 py-1.5 space-y-3 text-[9px]">
              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-forest border border-white" />
                <strong className="text-[#111827]">08:00 AM</strong>
                <span className="text-[#667085] block">Fresh Sourdough bakery walk</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-forest/50 border border-white" />
                <strong className="text-[#111827]">05:30 PM</strong>
                <span className="text-[#667085] block">Principe Real garden sunset</span>
              </div>
            </div>
          </div>

          {/* Card 3: Confident Booking (Spans all 3 columns) */}
          <div className="md:col-span-3 bg-[#f5f2ea]/30 border border-[#d9d2c6]/60 p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:shadow-md transition-shadow">
            <div className="space-y-3 max-w-xl">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c46c42] block">Confident booking</span>
              <h3 className="text-2xl font-display font-medium text-[#111827]">
                Clear standards before you ever send an inquiry
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Dedicated workspaces, self check-in variables, internet performance validation, and host policies are presented clearly up front so there are no surprises once you arrive.
              </p>
            </div>
            
            {/* Visual Satisfactory Rating Dial */}
            <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-xl shrink-0 flex flex-col items-center gap-1 shadow-sm w-full sm:w-auto">
              <span className="text-3xl font-display font-semibold text-forest">4.96</span>
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-[8px] uppercase tracking-wider font-bold text-[#667085] mt-1">Verified traveler rating</span>
            </div>
          </div>

        </div>
      </section>

      <section className="page-section" id="collections">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Collections</p>
            <h2>Curated paths into the kind of stay you actually want.</h2>
          </div>
          <p className="section-copy">
            Rather than leaving you to sort through endless inventory, ApexLoom
            groups spaces by rhythm, setting, and how the stay is meant to feel.
          </p>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <article
              className={collectionToneClass[collection.tone]}
              key={collection.title}
            >
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <ul>
                {collection.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section--accent" id="hosting">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Experience flow</p>
            <h2>Simple from first browse to arrival day.</h2>
          </div>
          <a className="inline-link" href="#faq">
            See how the platform grows <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="journey-grid">
          {journeySteps.map((step, index) => (
            <article className="journey-card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="highlights">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Highlights</p>
            <h2>The standards behind every featured stay.</h2>
          </div>
          <p className="section-copy">
            We do not optimise for volume. We optimise for fewer mismatches,
            better expectations, and stronger trips from the very start.
          </p>
        </div>
        <div className="stats-grid">
          {impactStats.map((stat) => (
            <article className="stats-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="reviews">
        <div className="section-heading">
          <p className="section-kicker">Guest notes</p>
          <h2>Trusted by guests and hosts who care about the details.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <p>{testimonial.quote}</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="featured-stays">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Featured stays</p>
            <h2>Four considered places to start the search properly.</h2>
          </div>
          <div className="section-rail">
            <p className="section-copy">
              These featured stays already connect to the full explore catalog and
              each one opens into a public details page with specifications,
              reviews, and related places.
            </p>
            <a className="inline-link" href="/explore">
              Open full explore view <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <StayGrid items={featuredStays} />
      </section>

      <section className="page-section" id="journal">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Journal</p>
            <h2>Practical stories for people who travel with intent.</h2>
          </div>
          <p className="section-copy">
            Editorial pieces help guests choose better stays and help hosts
            understand what thoughtful presentation looks like.
          </p>
        </div>
        <div className="journal-grid">
          {journalEntries.map((entry) => (
            <article className="journal-card" key={entry.title}>
              <span>{entry.meta}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section--faq" id="faq">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">FAQ</p>
            <h2>Clear answers while the platform is taking shape.</h2>
          </div>
          <p className="section-copy">
            This demo already reflects the product direction, while later
            sections will add the account, listing, and management workflows.
          </p>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
