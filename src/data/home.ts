export type HeroMetric = {
  value: string;
  label: string;
};

export type StoryCard = {
  title: string;
  description: string;
  eyebrow: string;
};

export type CollectionCard = {
  title: string;
  description: string;
  highlights: string[];
  tone: "forest" | "clay" | "paper";
};

export type JourneyStep = {
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type JournalEntry = {
  title: string;
  description: string;
  meta: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const heroMetrics: HeroMetric[] = [
  { value: "240+", label: "Spaces reviewed by the ApexLoom team" },
  { value: "18", label: "Cities and slow-coast regions now in rotation" },
  { value: "4.9/5", label: "Average guest satisfaction across editor picks" },
];

export const storyCards: StoryCard[] = [
  {
    eyebrow: "Design-first",
    title: "Spaces chosen for atmosphere, not volume",
    description:
      "We shortlist properties with character, calm layouts, and the kind of details that shape the whole stay.",
  },
  {
    eyebrow: "Local rhythm",
    title: "Travel notes that help you move like you belong",
    description:
      "Every destination comes with practical neighborhood guidance, food picks, and timing suggestions from local hosts.",
  },
  {
    eyebrow: "Confident booking",
    title: "Clear standards before you ever send an inquiry",
    description:
      "Work setup, accessibility, arrival flow, and house expectations are explained up front so there are no surprises later.",
  },
];

export const collections: CollectionCard[] = [
  {
    tone: "forest",
    title: "Quiet City Stays",
    description:
      "Well-located apartments and townhouses where you can stay close to the pulse without losing the calm.",
    highlights: ["Walkable neighborhoods", "Dedicated work corners", "Flexible self check-in"],
  },
  {
    tone: "clay",
    title: "Slow Weekend Houses",
    description:
      "Warm countryside homes made for long breakfasts, outdoor dinners, and a proper reset from routine.",
    highlights: ["Fire pits and gardens", "Small group friendly", "Seasonal host guides"],
  },
  {
    tone: "paper",
    title: "Signature Retreats",
    description:
      "Statement spaces for milestone trips, creative breaks, and gatherings where the setting really matters.",
    highlights: ["Architectural character", "Private dining options", "Concierge-ready stays"],
  },
];

export const journeySteps: JourneyStep[] = [
  {
    title: "Explore with intent",
    description:
      "Browse collections built around travel moods, stay duration, and the practical details that matter once you arrive.",
  },
  {
    title: "Compare the right details",
    description:
      "ApexLoom highlights the differences that affect experience: hosting style, workspace comfort, neighborhood rhythm, and house rules.",
  },
  {
    title: "Book with confidence",
    description:
      "Once you choose a place, the handoff is simple: clear communication, arrival notes, and local recommendations in one flow.",
  },
];

export const impactStats: HeroMetric[] = [
  { value: "92%", label: "Guests say the editorial notes improved their trip planning" },
  { value: "36 hrs", label: "Average response time saved through clear listing standards" },
  { value: "68%", label: "Bookings made from curated collections instead of generic search" },
  { value: "31%", label: "Hosts returning with a second property after launch" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The stay looked beautiful, but what sold us was how clearly ApexLoom explained the area, pace, and practical setup before booking.",
    name: "Nadia Rahman",
    role: "Product designer, booked a 9-night Lisbon stay",
  },
  {
    quote:
      "It felt less like scrolling a marketplace and more like getting a smart recommendation from someone with good taste.",
    name: "Daniel Moore",
    role: "Brand strategist, weekend guest in Kyoto",
  },
  {
    quote:
      "Our house reached guests who actually understood what made it special, which meant fewer mismatched inquiries and better stays.",
    name: "Leonie Fischer",
    role: "Host partner, Black Forest collection",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    meta: "Journal 01",
    title: "How to choose a city stay that still gives you breathing room",
    description:
      "A practical guide to balancing access, quiet, and day-to-day comfort when you do not want the usual hotel rhythm.",
  },
  {
    meta: "Journal 02",
    title: "What thoughtful hosts reveal before great trips begin",
    description:
      "The small pieces of information that build trust early, from arrival windows to workspace honesty and neighborhood timing.",
  },
  {
    meta: "Journal 03",
    title: "Three ways design changes how long you actually want to stay",
    description:
      "Why layout, light, and material choices shape a stay more than square footage or standard amenity lists.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "How is ApexLoom different from a typical booking site?",
    answer:
      "ApexLoom is built around editorial curation. Instead of showing everything, we focus on spaces that meet a defined standard for character, clarity, and guest experience.",
  },
  {
    question: "Can hosts apply to be featured?",
    answer:
      "Yes. Hosts can submit a space for review, and we assess fit based on presentation quality, guest readiness, and how distinct the stay feels in practice.",
  },
  {
    question: "Do you only feature premium-priced stays?",
    answer:
      "No. We feature spaces across price points, but every property must feel considered, honest, and well prepared for the kind of trip it promises.",
  },
  {
    question: "Will the platform support direct booking tools later?",
    answer:
      "Yes. The current foundation is ready for account, listing, and inquiry flows so we can extend into secure booking and host management in the next sections.",
  },
];
