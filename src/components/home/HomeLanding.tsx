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
        <div className="story-grid">
          {storyCards.map((card) => (
            <article className="story-card" key={card.title}>
              <span>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
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
