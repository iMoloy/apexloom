export type StayReview = {
  author: string;
  role: string;
  quote: string;
  rating: number;
};

export type StayItem = {
  slug: string;
  title: string;
  location: string;
  country: string;
  collection: "Quiet City Stays" | "Slow Weekend Houses" | "Signature Retreats";
  stayType: "Apartment" | "Townhouse" | "House" | "Villa" | "Cabin";
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  publishedOn: string;
  shortDescription: string;
  fullDescription: string;
  hostNote: string;
  bestFor: string;
  guestCount: number;
  bedrooms: number;
  baths: number;
  featured: boolean;
  amenities: string[];
  galleryLabels: [string, string, string];
  reviews: StayReview[];
  ownerEmail?: string;
  imageUrl?: string;
};

export const stayItems: StayItem[] = [
  {
    slug: "solenne-house",
    title: "Solenne House",
    location: "Lisbon",
    country: "Portugal",
    collection: "Quiet City Stays",
    stayType: "Townhouse",
    pricePerNight: 285,
    rating: 4.9,
    reviewCount: 38,
    publishedOn: "2026-05-12",
    shortDescription:
      "A layered townhouse above Principe Real with soft morning light, a library stair, and a dining room made for slow evenings.",
    fullDescription:
      "Solenne House is built for guests who want central Lisbon without living inside the rush. The home opens with a generous shared floor for reading, cooking, and working, then shifts upstairs into quieter bedrooms with city roof views. The materials are warm, the circulation feels calm, and every room has enough intention to make staying in feel as appealing as heading out.",
    hostNote:
      "The host leaves a neighborhood timing guide that helps guests catch the district at its calmest, especially in the early morning and after dinner.",
    bestFor: "Design-minded city breaks with room for remote work",
    guestCount: 4,
    bedrooms: 2,
    baths: 2,
    featured: true,
    amenities: ["Dedicated workspace", "Balcony dining", "Self check-in", "Curated city guide"],
    galleryLabels: ["Street-facing salon", "Light-filled dining room", "Quiet upstairs suite"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Nadia Rahman",
        role: "Product designer",
        rating: 5,
        quote:
          "It felt like a real home with a point of view, not a standard rental staged for photos.",
      },
      {
        author: "Chris Duarte",
        role: "Photographer",
        rating: 4.9,
        quote:
          "The way the house balanced energy outside with calm inside made the whole trip easier.",
      },
    ],
  },
  {
    slug: "atelier-mare",
    title: "Atelier Mare",
    location: "Marseille",
    country: "France",
    collection: "Quiet City Stays",
    stayType: "Apartment",
    pricePerNight: 240,
    rating: 4.8,
    reviewCount: 29,
    publishedOn: "2026-04-18",
    shortDescription:
      "A sea-toned apartment near the old port with textured walls, gallery-scale windows, and a compact but excellent work setup.",
    fullDescription:
      "Atelier Mare is a compact city apartment that understands how much atmosphere matters in a smaller footprint. The open plan keeps the day moving between kitchen, table, and lounge without ever feeling cramped, while the bedroom stays tucked away and calm. It is ideal for guests who want strong design, easy walking access, and an honest layout they can understand before arriving.",
    hostNote:
      "You will find a mapped list of early-opening coffee stops and quieter waterfront loops for the first day in town.",
    bestFor: "Solo trips or couples combining city access with work sessions",
    guestCount: 2,
    bedrooms: 1,
    baths: 1,
    featured: true,
    amenities: ["Fast Wi-Fi", "Portable monitor", "Lift access", "Harbor walking route"],
    galleryLabels: ["Window lounge", "Compact studio kitchen", "Calm bedroom corner"],
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Mira Chen",
        role: "Creative lead",
        rating: 4.8,
        quote:
          "Every meter was well used, and the listing matched the actual experience exactly.",
      },
      {
        author: "Hugo Martin",
        role: "Consultant",
        rating: 4.7,
        quote:
          "Perfect for a few focused workdays with enough character that you still feel like you travelled.",
      },
    ],
  },
  {
    slug: "north-harbor-flat",
    title: "North Harbor Flat",
    location: "Copenhagen",
    country: "Denmark",
    collection: "Quiet City Stays",
    stayType: "Apartment",
    pricePerNight: 310,
    rating: 4.9,
    reviewCount: 42,
    publishedOn: "2026-06-04",
    shortDescription:
      "A waterside apartment with oak joinery, bike-first access, and enough openness for a long urban reset.",
    fullDescription:
      "North Harbor Flat makes city travel feel sustainable instead of compressed. The home sits close to the water with a living space that stretches wide rather than deep, giving it unusual openness for the area. It suits longer stays especially well, with a practical kitchen, strong storage, and a worktable that does not feel borrowed from the dining room.",
    hostNote:
      "The host shares exact routes for harbor swims, bakery runs, and the fastest cycle link into the center.",
    bestFor: "Longer city stays with a slower daily rhythm",
    guestCount: 3,
    bedrooms: 1,
    baths: 1,
    featured: false,
    amenities: ["Bike storage", "Harbor access", "Long-stay pantry", "Sound-insulated bedroom"],
    galleryLabels: ["Waterfront sitting room", "Kitchen and long table", "Bedroom with oak storage"],
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Elise Turner",
        role: "Researcher",
        rating: 5,
        quote: "The layout let us settle in quickly, which made a ten-day stay feel effortless.",
      },
      {
        author: "Jonas Lind",
        role: "Founder",
        rating: 4.9,
        quote: "It had the calm of a neighborhood home, not a short-term rental.",
      },
    ],
  },
  {
    slug: "cedar-field-house",
    title: "Cedar Field House",
    location: "Cotswolds",
    country: "United Kingdom",
    collection: "Slow Weekend Houses",
    stayType: "House",
    pricePerNight: 360,
    rating: 4.9,
    reviewCount: 34,
    publishedOn: "2026-03-28",
    shortDescription:
      "A honey-stone house with a garden kitchen, cedar-lined bath room, and a dining table that anchors the whole weekend.",
    fullDescription:
      "Cedar Field House is made for gathering without noise. The kitchen and dining room work as one social space, the garden opens wide for long afternoons, and the bedrooms stay intentionally simple so the house never tips into over-styled. It is the kind of place where a small group can move easily between shared time and private rest.",
    hostNote:
      "Arrival instructions include farm shop timing, rainy-day drives, and a dependable fireplace routine for first-night comfort.",
    bestFor: "Small group weekends and restorative family trips",
    guestCount: 6,
    bedrooms: 3,
    baths: 2,
    featured: true,
    amenities: ["Garden kitchen", "Fireplace", "Freestanding tub", "Local produce guide"],
    galleryLabels: ["Garden dining room", "Cedar bath suite", "Stone courtyard"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Alicia Moore",
        role: "Brand producer",
        rating: 5,
        quote:
          "The house had enough presence for a special weekend but still felt grounded and easy to use.",
      },
      {
        author: "Samir Patel",
        role: "Engineer",
        rating: 4.8,
        quote:
          "The arrival notes were incredibly practical and made group coordination much smoother.",
      },
    ],
  },
  {
    slug: "pine-and-hearth",
    title: "Pine and Hearth",
    location: "Vermont",
    country: "United States",
    collection: "Slow Weekend Houses",
    stayType: "Cabin",
    pricePerNight: 330,
    rating: 4.7,
    reviewCount: 21,
    publishedOn: "2026-02-16",
    shortDescription:
      "A timber cabin above a meadow with a reading loft, wood stove, and a kitchen built around winter weekends.",
    fullDescription:
      "Pine and Hearth is strongest in colder months, though the open meadow and porch keep it lively in summer too. The cabin leans into warmth without becoming rustic theatre, and the reading loft gives the home a second quiet zone that makes short stays feel longer. It is ideal for couples or a close pair of friends who want a true break in pace.",
    hostNote:
      "The host provides a detailed packing note by season, which makes the stay especially easy for first-time countryside guests.",
    bestFor: "Two-to-four guest escapes with a strong sense of season",
    guestCount: 4,
    bedrooms: 2,
    baths: 1,
    featured: false,
    amenities: ["Wood stove", "Loft reading nook", "Trail access", "Seasonal pantry basics"],
    galleryLabels: ["Meadow-facing lounge", "Loft reading nook", "Warm timber bedroom"],
    imageUrl: "https://images.unsplash.com/photo-1542314831-c6a4d1424368?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Lena Ortiz",
        role: "Art director",
        rating: 4.8,
        quote: "Warm, practical, and just remote enough to change the pace of the week.",
      },
      {
        author: "Mark Benson",
        role: "Writer",
        rating: 4.6,
        quote: "The cabin had a clear personality without sacrificing comfort.",
      },
    ],
  },
  {
    slug: "olive-courtyard-villa",
    title: "Olive Courtyard Villa",
    location: "Puglia",
    country: "Italy",
    collection: "Signature Retreats",
    stayType: "Villa",
    pricePerNight: 520,
    rating: 5,
    reviewCount: 18,
    publishedOn: "2026-05-30",
    shortDescription:
      "A limestone villa arranged around an olive courtyard with outdoor dining rooms, guest suites, and long summer shade.",
    fullDescription:
      "Olive Courtyard Villa is a celebratory stay that still feels deeply livable. The outdoor rooms are as important as the interiors, letting guests shift through breakfast, pool time, reading, and dinner without effort. The house suits milestone travel because it feels generous without becoming formal, and because each bedroom keeps enough privacy for group comfort.",
    hostNote:
      "A local host team can arrange dinner service, market stocking, and vineyard visits with plenty of notice.",
    bestFor: "Milestone trips and shared summer gatherings",
    guestCount: 8,
    bedrooms: 4,
    baths: 4,
    featured: true,
    amenities: ["Pool courtyard", "Private chef option", "Multiple terraces", "Local concierge"],
    galleryLabels: ["Olive courtyard", "Stone dining room", "Private suite terrace"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Priya Saha",
        role: "Founder",
        rating: 5,
        quote: "A genuinely memorable group stay that managed to feel luxurious and relaxed at the same time.",
      },
      {
        author: "Tom Willis",
        role: "Architect",
        rating: 5,
        quote: "The outdoor spaces were beautifully proportioned and actually worked all day.",
      },
    ],
  },
  {
    slug: "harbor-light-residence",
    title: "Harbor Light Residence",
    location: "Sydney",
    country: "Australia",
    collection: "Signature Retreats",
    stayType: "Townhouse",
    pricePerNight: 470,
    rating: 4.8,
    reviewCount: 26,
    publishedOn: "2026-04-09",
    shortDescription:
      "A layered harbor home with sculptural stairs, guest-ready terraces, and enough range for both work and celebration.",
    fullDescription:
      "Harbor Light Residence balances presence with everyday ease. The home was chosen because its circulation makes a large footprint feel intuitive, while the terraces and upper rooms offer changing outlooks throughout the day. Guests booking longer urban stays or small celebratory trips get both privacy and places to gather without compromise.",
    hostNote:
      "Expect precise arrival guidance for parking, ferry timing, and which terrace catches the best evening breeze.",
    bestFor: "Extended city stays, family travel, and celebratory weekends",
    guestCount: 6,
    bedrooms: 3,
    baths: 3,
    featured: false,
    amenities: ["Harbor terraces", "Private parking", "Remote-work room", "Host concierge"],
    galleryLabels: ["Upper terrace lounge", "Sculptural stair hall", "Calm guest suite"],
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Julia Park",
        role: "Operations lead",
        rating: 4.9,
        quote: "It handled six adults surprisingly well because the spaces were designed to flow.",
      },
      {
        author: "Ethan Cole",
        role: "Producer",
        rating: 4.7,
        quote: "A strong city base with enough detail that it still felt like a destination stay.",
      },
    ],
  },
  {
    slug: "dune-cove-house",
    title: "Dune Cove House",
    location: "Essaouira",
    country: "Morocco",
    collection: "Signature Retreats",
    stayType: "House",
    pricePerNight: 440,
    rating: 4.9,
    reviewCount: 24,
    publishedOn: "2026-06-20",
    shortDescription:
      "A wind-softened coastal house with rooftop dining, sheltered courtyards, and easy access to long beach walks.",
    fullDescription:
      "Dune Cove House is all about coastal calm without isolation. The plan wraps around a protected courtyard that gives the house a private core, while the roof terrace opens wide for evenings and group meals. It works especially well for guests who want a place with character and weathered texture rather than polished neutrality.",
    hostNote:
      "Local guidance includes market timing, beach wind patterns, and a list of late lunch spots worth planning around.",
    bestFor: "Coastal resets, creative retreats, and four-to-six guest trips",
    guestCount: 6,
    bedrooms: 3,
    baths: 2,
    featured: false,
    amenities: ["Roof terrace", "Protected courtyard", "Surf storage", "Local host guide"],
    galleryLabels: ["Courtyard lounge", "Rooftop supper setting", "Textured guest room"],
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    reviews: [
      {
        author: "Farah El Amin",
        role: "Strategist",
        rating: 5,
        quote: "A beautiful house that still felt grounded and completely usable day to day.",
      },
      {
        author: "Noah Price",
        role: "Filmmaker",
        rating: 4.8,
        quote: "The roof and courtyard gave us two distinct moods without ever leaving the house.",
      },
    ],
  },
];
