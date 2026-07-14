export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Property {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  category: "Co-living" | "Apartment" | "Studio" | "Villa";
  location: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  createdAt: string;
  hostId: string;
  reviews: Review[];
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Urban Nest Co-Living Space",
    shortDescription: "Chic co-living space in downtown Manhattan with premium facilities and shared workspace.",
    description: "Experience the ultimate co-living lifestyle at Urban Nest. Perfect for remote developers, digital nomads, and young professionals. Features high-speed Wi-Fi, weekly networking events, a state-of-the-art co-working space, and a community roof deck with skyline views. Rent includes all utilities and weekly professional cleaning of shared spaces.",
    price: 1200,
    category: "Co-living",
    location: "Manhattan, New York",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewsCount: 15,
    beds: 1,
    baths: 2,
    sqft: 220,
    amenities: ["High-speed Wi-Fi", "Coworking Space", "Rooftop Terrace", "Weekly Cleaning", "Smart TV", "Gym Access"],
    createdAt: "2026-05-12T10:00:00.000Z",
    hostId: "host-admin",
    reviews: [
      {
        id: "rev-1-1",
        name: "Alex Johnson",
        rating: 5,
        comment: "Absolutely loved my stay here! The community is incredible and the Wi-Fi is super fast for coding.",
        date: "2026-06-15",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
      },
      {
        id: "rev-1-2",
        name: "Sofia Rodriguez",
        rating: 4,
        comment: "Great location and very clean. The kitchen can get a bit crowded in the evening, but otherwise perfect.",
        date: "2026-06-20",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "prop-2",
    title: "Sunset Boulevard Modern Studio",
    shortDescription: "Ultra-modern, sun-drenched studio apartment with smart home systems in West Hollywood.",
    description: "Live steps away from WeHo's trendiest restaurants. This high-end studio offers floor-to-ceiling glass windows, integrated smart lights, automated blinds, and top-tier Miele appliances. A luxurious Murphy bed design maximizes living space, while the private balcony offers breathtaking view of the Sunset Hills.",
    price: 1850,
    category: "Studio",
    location: "Los Angeles, California",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 8,
    beds: 1,
    baths: 1,
    sqft: 480,
    amenities: ["Smart Home System", "Private Balcony", "Air Conditioning", "In-unit Washer/Dryer", "Pool Access", "Parking Garage"],
    createdAt: "2026-06-01T14:30:00.000Z",
    hostId: "host-admin",
    reviews: [
      {
        id: "rev-2-1",
        name: "Marcus Aurelius",
        rating: 5,
        comment: "Excellent design, great view, and very clean. Highly recommended for short or long-term stays.",
        date: "2026-06-18",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "prop-3",
    title: "The Oasis - Luxury Coastal Villa",
    shortDescription: "Breathtaking 4-bedroom villa with private infinity pool and direct beach access in Miami.",
    description: "Welcome to The Oasis, a magnificent villa offering unmatched luxury and ocean views. This property is fully equipped with private beach access, a gorgeous heated infinity pool, a cinema room, outdoor dining patio, and 24/7 security. Ideal for family retreats or premium client hosting.",
    price: 4500,
    category: "Villa",
    location: "Miami Beach, Florida",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 5.0,
    reviewsCount: 12,
    beds: 4,
    baths: 4.5,
    sqft: 3800,
    amenities: ["Private Pool", "Beachfront", "Home Theater", "Chef Services Available", "Security Gate", "Hot Tub"],
    createdAt: "2026-04-20T08:15:00.000Z",
    hostId: "host-admin",
    reviews: [
      {
        id: "rev-3-1",
        name: "Elena Rostova",
        rating: 5,
        comment: "This villa is pure perfection. The views are even better than the photos. A true paradise.",
        date: "2026-05-10",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "prop-4",
    title: "Sleek Loft near Millennium Park",
    shortDescription: "Industrial-chic 2-bedroom loft apartment with high ceilings and brick walls in Chicago.",
    description: "A spacious industrial loft situated in the heart of Loop, Chicago. Retaining its historical character with exposed brickwork and structural timbers, this loft is updated with contemporary finishes, hard-wood floors, and a gorgeous chef's kitchen. Just steps away from Millennium Park and the art district.",
    price: 2100,
    category: "Apartment",
    location: "Chicago, Illinois",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewsCount: 22,
    beds: 2,
    baths: 2,
    sqft: 1200,
    amenities: ["High Ceilings", "Exposed Brick", "Chef Kitchen", "Storage Unit", "Pet Friendly", "Roof Access"],
    createdAt: "2026-05-28T11:45:00.000Z",
    hostId: "host-admin",
    reviews: [
      {
        id: "rev-4-1",
        name: "David Kim",
        rating: 5,
        comment: "Fantastic apartment. Very quiet, clean, and in a perfect location for walking to museums.",
        date: "2026-06-05",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "prop-5",
    title: "Silicon Valley Executive Suite",
    shortDescription: "Stylish 1-bedroom corporate apartment near tech campuses in Palo Alto.",
    description: "Designed specifically for traveling executives and tech professionals. Offers a dedicated workspace with ergonomic seating, secondary monitor, and lightning-fast fiber optic internet. Located in a high-end complex that includes a pool, full health center, and EV charging stations.",
    price: 2800,
    category: "Apartment",
    location: "Palo Alto, California",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.6,
    reviewsCount: 7,
    beds: 1,
    baths: 1,
    sqft: 750,
    amenities: ["Fiber Internet", "Ergonomic Desk & Monitor", "EV Charging", "Fitness Center", "Pool", "Secure Access"],
    createdAt: "2026-06-10T09:20:00.000Z",
    hostId: "host-user",
    reviews: [
      {
        id: "rev-5-1",
        name: "John Doe",
        rating: 4,
        comment: "Great apartment for working remotely. Very quiet complex and the desk setup was really helpful.",
        date: "2026-06-25",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "prop-6",
    title: "Pacific Heights Panoramic Penthouse",
    shortDescription: "Elegant 3-bedroom penthouse with Golden Gate Bridge views in San Francisco.",
    description: "Occupying the top floor of a classic San Francisco building, this magnificent penthouse offers unobstructed views of the bay and the Golden Gate Bridge. Features a double parlor layout, working fireplace, custom cherry cabinetry, wine cellar, and private terrace.",
    price: 3900,
    category: "Apartment",
    location: "San Francisco, California",
    images: [
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 14,
    beds: 3,
    baths: 2.5,
    sqft: 2100,
    amenities: ["Panoramic Views", "Fireplace", "Wine Storage", "Private Terrace", "Concierge Service", "Hardwood Floors"],
    createdAt: "2026-04-15T15:40:00.000Z",
    hostId: "host-admin",
    reviews: [
      {
        id: "rev-6-1",
        name: "Claire Bennett",
        rating: 5,
        comment: "Waking up to the bay view is breathtaking. Exceptional property and hosts.",
        date: "2026-05-20",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "prop-7",
    title: "Austin Downtown Social Co-Living",
    shortDescription: "Vibrant co-living community featuring standard micro-studios and rich social spaces.",
    description: "Join Austin's leading startup co-living hub! Built for creators, founders, and students. Each resident enjoys a private fully-furnished micro-room with private bathroom, and shares an industrial scale kitchen, media lounge, gaming deck, and massive laundry suite.",
    price: 950,
    category: "Co-living",
    location: "Austin, Texas",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.5,
    reviewsCount: 29,
    beds: 1,
    baths: 1,
    sqft: 180,
    amenities: ["Social Lounge", "Gaming Room", "Shared Professional Kitchen", "All Utilities Included", "Bicycle Parking", "Community Coordinator"],
    createdAt: "2026-05-02T13:10:00.000Z",
    hostId: "host-user",
    reviews: []
  },
  {
    id: "prop-8",
    title: "Seattle Waterfront Glass Studio",
    shortDescription: "Stunning minimalist glass studio with harbor views in downtown Seattle.",
    description: "An architectural marvel located right on the Seattle waterfront. Constructed with soundproof triple-pane glass walls, this studio feels suspended over the ocean. Complete with custom walnut cabinetry, heated bathroom floors, and smart climate controls.",
    price: 1700,
    category: "Studio",
    location: "Seattle, Washington",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewsCount: 11,
    beds: 1,
    baths: 1,
    sqft: 520,
    amenities: ["Waterfront Views", "Minimalist Design", "Heated Floors", "Smart Climate Control", "Storage Cage", "Gym Access"],
    createdAt: "2026-06-14T17:15:00.000Z",
    hostId: "host-admin",
    reviews: []
  }
];
