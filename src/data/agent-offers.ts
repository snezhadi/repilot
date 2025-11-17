export type OfferStage = "draft" | "in-negotiation" | "accepted" | "declined" | "won" | "lost";

export interface OfferTermSummary {
  label: string;
  value: string;
  tone?: "positive" | "warning" | "note";
}

export interface OfferSummary {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  offerPrice: string;
  status: OfferStage;
  statusLabel: string;
  statusTone?: "default" | "success" | "warning" | "danger";
  countdownLabel?: string;
  preview: string;
  lastUpdated: string;
  categories: string[];
  termHighlights: OfferTermSummary[];
}

export interface ComparableRecord {
  id: string;
  address: string;
  price: string;
  soldDate: string;
  distance: string;
  beds: number;
  baths: number;
  sqft: number;
  deltaLabel: string;
  deltaTone: "positive" | "warning" | "neutral";
}

export interface NegotiationInsight {
  leverageScore: string;
  confidence: "high" | "medium" | "low";
  summary: string;
  talkingPoints: string[];
  risks: string[];
  opportunity: string[];
}

export interface OfferHistoryItem {
  id: string;
  timestamp: string;
  actor: "agent" | "client" | "cooperating" | "system";
  label: string;
  description: string;
}

export interface ScenarioSuggestion {
  id: string;
  title: string;
  summary: string;
  diff: {
    price?: string;
    deposit?: string;
    closing?: string;
    conditions?: string;
  };
  riskLevel: "low" | "medium" | "high";
}

export interface MultiOfferRow {
  offerId: string;
  clientName: string;
  avatar?: string;
  price: string;
  deposit: string;
  closing: string;
  financing: string;
  inspection: string;
  conditions: string;
  notes: string;
  highlight?: "best" | "consider" | "risk";
}

export interface MultiOfferMatrixRecord {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  listPrice: string;
  image: string;
  offerDeadline: string;
  summary: {
    highestOffer: string;
    strongestBuyer: string;
    leverageNote: string;
  };
  offers: MultiOfferRow[];
}

export const agentOfferSummaries: OfferSummary[] = [
  {
    id: "offer-aj-01",
    clientId: "client-1",
    clientName: "Alex Johnson",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    propertyId: "prop-rh-12",
    propertyTitle: "Modern Family Home",
    propertyAddress: "88 Bayview Heights Dr, Richmond Hill",
    propertyImage: "/property1.jpg",
    offerPrice: "$1,175,000",
    status: "in-negotiation",
    statusLabel: "Counter Received",
    statusTone: "warning",
    countdownLabel: "Respond in 6h",
    preview: "Seller countered at $1.19M with 48h irrevocable.",
    lastUpdated: "8:42 PM",
    categories: ["Detached", "Second-time buyer"],
    termHighlights: [
      { label: "Deposit", value: "$60,000 (5%)" },
      { label: "Closing", value: "Apr 30, 2024" },
      { label: "Conditions", value: "Financing (3d), Inspection (2d)", tone: "note" }
    ]
  },
  {
    id: "offer-sw-02",
    clientId: "client-2",
    clientName: "Sarah Williams",
    clientAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    propertyId: "prop-hb-21",
    propertyTitle: "Harbourfront Residences PH-3202",
    propertyAddress: "1 Harbour Square, Toronto",
    propertyImage: "/property2.jpg",
    offerPrice: "$1,820,000",
    status: "draft",
    statusLabel: "Draft in Progress",
    statusTone: "default",
    preview: "Awaiting condo docs to finalize clauses.",
    lastUpdated: "7:18 PM",
    categories: ["Condo", "Luxury"],
    termHighlights: [
      { label: "Deposit", value: "$90,000 on acceptance", tone: "note" },
      { label: "Closing", value: "Jun 1, 2024" },
      { label: "Extras", value: "Furniture package, EV parking" }
    ]
  },
  {
    id: "offer-mc-03",
    clientId: "client-3",
    clientName: "Michael Chen",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    propertyId: "prop-wa-31",
    propertyTitle: "Laurelwood Smart Home",
    propertyAddress: "56 Laurelwood Ave, Waterloo",
    propertyImage: "/property4.jpg",
    offerPrice: "$1,340,000",
    status: "accepted",
    statusLabel: "Accepted",
    statusTone: "success",
    preview: "Firmed with inspection credit of $5K.",
    lastUpdated: "Apr 12",
    categories: ["Detached", "Relocation"],
    termHighlights: [
      { label: "Deposit", value: "$70,000 on acceptance" },
      { label: "Closing", value: "May 20, 2024" },
      { label: "Notes", value: "Includes smart home equipment" }
    ]
  }
];

export const offerComparables: Record<string, ComparableRecord[]> = {
  "offer-aj-01": [
    {
      id: "comp-1",
      address: "92 Bayview Heights Dr",
      price: "$1,210,000",
      soldDate: "Mar 4, 2024",
      distance: "0.2 km",
      beds: 4,
      baths: 3,
      sqft: 2350,
      deltaLabel: "$35K above",
      deltaTone: "positive"
    },
    {
      id: "comp-2",
      address: "14 Stockwell Ave",
      price: "$1,140,000",
      soldDate: "Feb 22, 2024",
      distance: "0.6 km",
      beds: 4,
      baths: 3,
      sqft: 2200,
      deltaLabel: "$10K below",
      deltaTone: "warning"
    },
    {
      id: "comp-3",
      address: "301 Palmerston Cres",
      price: "$1,185,000",
      soldDate: "Feb 14, 2024",
      distance: "0.9 km",
      beds: 5,
      baths: 4,
      sqft: 2500,
      deltaLabel: "$15K above",
      deltaTone: "positive"
    }
  ],
  "offer-sw-02": [
    {
      id: "comp-4",
      address: "Waterfront Tower PH-2810",
      price: "$1,830,000",
      soldDate: "Mar 5, 2024",
      distance: "0.3 km",
      beds: 3,
      baths: 3,
      sqft: 1850,
      deltaLabel: "Comparable",
      deltaTone: "neutral"
    },
    {
      id: "comp-5",
      address: "Pier 27 Suite 410",
      price: "$1,790,000",
      soldDate: "Feb 10, 2024",
      distance: "0.5 km",
      beds: 2,
      baths: 3,
      sqft: 1700,
      deltaLabel: "$30K below",
      deltaTone: "warning"
    }
  ]
};

export const negotiationInsights: Record<string, NegotiationInsight> = {
  "offer-aj-01": {
    leverageScore: "Strong position",
    confidence: "high",
    summary:
      "Inventory in Bayview Heights is tight (0.9 months). Listing has been on market 11 days with 18 showings; sellers motivated but protecting price.",
    talkingPoints: [
      "Highlight buyer flexibility on closing (4-week range).",
      "Remind sellers inspection requests limited to major defects only.",
      "Include letter referencing school catchment commitment."
    ],
    risks: [
      "Another showing booked tomorrow at 10 AM—expect at least one more offer.",
      "Appraisal risk if we jump above $1.20M—have lender letter ready."
    ],
    opportunity: [
      "Offer stronger deposit (7.5%) to beat upcoming competitor.",
      "Shorten irrevocable to keep sellers focused tonight."
    ]
  },
  "offer-sw-02": {
    leverageScore: "Balanced",
    confidence: "medium",
    summary:
      "Luxury condo market stable. Listing has 24 DOM. Sellers recently reduced by $50K, signalling willingness to negotiate extras over price.",
    talkingPoints: [
      "Promote buyer's financing pre-approval and portfolio track record.",
      "Offer lease-back for 30 days while seller secures new construction unit.",
      "Bundle premium EV charger install as value-add instead of higher price."
    ],
    risks: [
      "Condo board requires 10 business days for status review—plan irrevocable accordingly.",
      "Competing buyer from same building has cash offer potential."
    ],
    opportunity: [
      "Request furniture package (sellers downsizing).",
      "Ask seller to cover condo move-in fees; minimal cost to them."
    ]
  }
};

export const offerHistory: Record<string, OfferHistoryItem[]> = {
  "offer-aj-01": [
    {
      id: "hist-1",
      timestamp: "Apr 12 · 7:10 PM",
      actor: "agent",
      label: "Draft created",
      description: "Prepared initial offer terms at $1,165,000 with 5% deposit."
    },
    {
      id: "hist-2",
      timestamp: "Apr 12 · 8:02 PM",
      actor: "agent",
      label: "Offer sent",
      description: "Delivered offer to listing agent with 24h irrevocable."
    },
    {
      id: "hist-3",
      timestamp: "Apr 13 · 7:58 AM",
      actor: "cooperating",
      label: "Counter received",
      description: "Listing agent countered at $1.19M, requested 7.5% deposit."
    }
  ],
  "offer-sw-02": [
    {
      id: "hist-4",
      timestamp: "Mar 28 · 9:40 AM",
      actor: "agent",
      label: "Buyer briefing",
      description: "Discussed target price range of $1.8M—prioritized lake view."
    }
  ]
};

export const scenarioSuggestions: Record<string, ScenarioSuggestion[]> = {
  "offer-aj-01": [
    {
      id: "scn-1",
      title: "Match seller price, strengthen deposit",
      summary:
        "Go to $1.19M with 7.5% deposit and shorter irrevocable. Keeps leverage without major appraisal risk.",
      diff: { price: "$1,190,000", deposit: "7.5%", conditions: "Keep inspection & financing" },
      riskLevel: "low"
    },
    {
      id: "scn-2",
      title: "Hold price, adjust closing",
      summary:
        "Stay at $1.175M but extend closing flexibility + offer free storage to offset seller concerns.",
      diff: { closing: "Apr 15 - May 15 window", conditions: "Add seller storage incentive" },
      riskLevel: "medium"
    }
  ],
  "offer-sw-02": [
    {
      id: "scn-3",
      title: "Furniture credit instead of higher price",
      summary:
        "Maintain $1.82M price but request $25K credit toward furnishings + include EV charger installation.",
      diff: { price: "$1,820,000", conditions: "Add $25K credit clause" },
      riskLevel: "low"
    }
  ]
};

export const multiOfferMatrix: MultiOfferMatrixRecord[] = [
  {
    propertyId: "prop-rh-12",
    propertyTitle: "Modern Family Home",
    propertyAddress: "88 Bayview Heights Dr, Richmond Hill",
    listPrice: "$1,199,000",
    image: "/property1.jpg",
    offerDeadline: "Offer review: Apr 13 @ 9:00 PM",
    summary: {
      highestOffer: "$1,205,000",
      strongestBuyer: "Patel Family",
      leverageNote: "3 conditional offers, 1 firm. Sellers value flexible closing."
    },
    offers: [
      {
        offerId: "offer-aj-01",
        clientName: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        price: "$1,175,000",
        deposit: "5% on acceptance",
        closing: "Apr 30, 2024",
        financing: "Conditional (3d)",
        inspection: "Conditional (2d)",
        conditions: "Include hot tub",
        notes: "Buyer flexible on closing + pool maintenance package",
        highlight: "consider"
      },
      {
        offerId: "offer-pt-04",
        clientName: "Patel Family",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        price: "$1,205,000",
        deposit: "10% certified",
        closing: "May 10, 2024",
        financing: "Firm",
        inspection: "Waived",
        conditions: "None",
        notes: "Ready to match seller closing + offer free rent-back",
        highlight: "best"
      },
      {
        offerId: "offer-li-05",
        clientName: "Liao & Chen",
        avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop&crop=face",
        price: "$1,165,000",
        deposit: "5%",
        closing: "Jun 1, 2024",
        financing: "Conditional (5d)",
        inspection: "Conditional (4d)",
        conditions: "Request appliance warranty",
        notes: "Needs seller to cover window repair.",
        highlight: "risk"
      }
    ]
  }
];
