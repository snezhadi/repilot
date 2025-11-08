export type ClientStatus = 'active' | 'paused' | 'expired';

export interface ClientNote {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentClient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: ClientStatus;
  accessExpiry: Date;
  createdAt: Date;
  lastActive: Date;
  propertiesViewed: number;
  chatSessions: number;
  latestCriteria?: ClientCriteriaSnapshot;
  aiInstructions?: string;
  notes?: ClientNote[];
}

export type TimelineEventType = 'criteria-change' | 'showing' | 'milestone';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string;
  title: string;
  summary: string;
  highlights?: string[];
  propertyLink?: {
    address: string;
    url: string;
    visitNumber?: number;
    time?: string;
  };
}

export interface ClientCriteriaSnapshot {
  priceRange?: string;
  propertyTypes?: string[];
  preferredAreas?: string[];
  notes?: string;
}

export const INITIAL_AGENT_CLIENTS: AgentClient[] = [
  {
    id: "client-1",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: 'active',
    accessExpiry: new Date('2024-12-31'),
    createdAt: new Date('2024-01-15'),
    lastActive: new Date('2024-01-20'),
    propertiesViewed: 24,
    chatSessions: 8,
    latestCriteria: {
      priceRange: "$1.1M - $1.25M",
      propertyTypes: ["Detached", "Townhouse"],
      preferredAreas: ["Bayview Hill", "North Richmond Hill"],
      notes: "Prioritizing top-ranked school zones and legal basement suite potential"
    },
    aiInstructions: "Prioritize homes with income potential and strong school zones. Highlight upcoming listings before public release.",
    notes: [
      {
        id: "alex-note-1",
        text: "Prefers evening showings after 6 PM due to work schedule.",
        createdAt: new Date("2024-01-09T19:10:00"),
        updatedAt: new Date("2024-01-09T19:10:00"),
      },
      {
        id: "alex-note-2",
        text: "Parents joining second visits. Provide inspection summaries.",
        createdAt: new Date("2024-01-18T21:45:00"),
        updatedAt: new Date("2024-01-18T21:45:00"),
      },
    ]
  },
  {
    id: "client-2",
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    status: 'active',
    accessExpiry: new Date('2024-11-30'),
    createdAt: new Date('2024-01-10'),
    lastActive: new Date('2024-01-19'),
    propertiesViewed: 18,
    chatSessions: 5,
    latestCriteria: {
      priceRange: "$1.7M - $1.9M",
      propertyTypes: ["Luxury Condo"],
      preferredAreas: ["Harbourfront", "Yorkville"],
      notes: "Requires EV-ready parking, concierge, and unobstructed lake views"
    },
    aiInstructions: "Focus on penthouses with 10ft+ ceilings and mention any upcoming designer staging or incentives.",
    notes: [
      {
        id: "sarah-note-1",
        text: "Requested comparison spreadsheets for maintenance fees.",
        createdAt: new Date("2024-01-05T11:30:00"),
        updatedAt: new Date("2024-01-05T11:30:00"),
      }
    ]
  },
  {
    id: "client-3",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: 'paused',
    accessExpiry: new Date('2024-10-15'),
    createdAt: new Date('2023-12-20'),
    lastActive: new Date('2024-01-15'),
    propertiesViewed: 12,
    chatSessions: 3,
    latestCriteria: {
      priceRange: "$1.3M - $1.4M",
      propertyTypes: ["Detached"],
      preferredAreas: ["Waterloo", "Laurelwood"],
      notes: "Needs move-in ready smart home with large office and fenced yard"
    },
    aiInstructions: "Emphasize proximity to tech employers and homes with dual offices.",
    notes: [
      {
        id: "michael-note-1",
        text: "Prefers listings with 3-car garage; remote work decision pending.",
        createdAt: new Date("2023-12-22T09:15:00"),
        updatedAt: new Date("2023-12-22T09:15:00"),
      }
    ]
  },
  {
    id: "client-4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    status: 'expired',
    accessExpiry: new Date('2024-01-10'),
    createdAt: new Date('2023-11-01'),
    lastActive: new Date('2024-01-08'),
    propertiesViewed: 8,
    chatSessions: 2,
    latestCriteria: {
      priceRange: "$580K - $650K",
      propertyTypes: ["Condo"],
      preferredAreas: ["Yonge & Eglinton", "Midtown"],
      notes: "Open concept kitchen, low fees, pet-friendly with parking option"
    },
    aiInstructions: "Highlight first-time buyer incentives and buildings with strong reserve funds.",
    notes: [
      {
        id: "emily-note-1",
        text: "Wants to revisit options in March; send monthly market digest.",
        createdAt: new Date("2024-01-11T14:05:00"),
        updatedAt: new Date("2024-01-11T14:05:00"),
      }
    ]
  }
];

export const agentClientTimelines: Record<string, TimelineEvent[]> = {
  "client-1": [
    {
      id: "alex-showing-2",
      type: "showing",
      date: "Jan 23, 2024",
      title: "2nd showing: 88 Bayview Heights",
      summary: "Follow-up visit with parents, comparing detached vs townhouse feel.",
      propertyLink: {
        address: "88 Bayview Heights Dr, Richmond Hill",
        url: "/property/bayview-heights-detached",
        visitNumber: 2,
        time: "Tue • 6:30 PM"
      },
      highlights: [
        "Feedback: backyard ideal for future pool",
        "Requested contractor quote for basement suite"
      ]
    },
    {
      id: "alex-showing-1",
      type: "showing",
      date: "Jan 18, 2024",
      title: "1st showing: 12 Oakridge Crescent",
      summary: "Positive about the layout but noted limited backyard and parking.",
      propertyLink: {
        address: "12 Oakridge Crescent, Richmond Hill",
        url: "/property/richmond-hill-oakridge",
        visitNumber: 1,
        time: "Sat • 11:00 AM"
      },
      highlights: [
        "Loved: natural light, renovated kitchen",
        "Concerns: narrow driveway, HOA fees"
      ]
    },
    {
      id: "alex-investment",
      type: "milestone",
      date: "Jan 15, 2024",
      title: "Shared investment intentions",
      summary: "Discussed long-term rental potential and asked AI for cap rate comparisons against Markham.",
      highlights: [
        "Prefers properties with basement suite potential",
        "Target rental yield: >4.5%",
        "Requested AI to monitor detached inventory weekly"
      ]
    },
    {
      id: "alex-criteria-2",
      type: "criteria-change",
      date: "Jan 11, 2024",
      title: "Expanded budget and neighborhood preferences",
      summary: "After reviewing market updates, Alex raised the ceiling to $1.25M and is open to detached homes in Bayview Hill.",
      highlights: [
        "Budget expanded to $1.25M",
        "Detached homes now considered",
        "Interested in school districts ranked 9+/10"
      ]
    },
    {
      id: "alex-criteria-1",
      type: "criteria-change",
      date: "Jan 04, 2024",
      title: "Initial search criteria captured",
      summary: "Looking for modern townhouses in Richmond Hill around $1M with 3 bedrooms.",
      highlights: [
        "Budget: $950K - $1.1M",
        "Preferred home type: Townhouse",
        "Commute: <25 min to downtown"
      ]
    }
  ],
  "client-2": [
    {
      id: "sarah-showing-1",
      type: "showing",
      date: "Jan 12, 2024",
      title: "1st showing: Harbourfront Residences PH-3202",
      summary: "Impressed with amenities but wants higher ceilings.",
      propertyLink: {
        address: "1 Harbour Square PH-3202",
        url: "/property/harbourfront-ph-3202",
        visitNumber: 1,
        time: "Fri • 4:00 PM"
      },
      highlights: [
        "Pros: concierge, lake view, gym",
        "Cons: 9ft ceilings, limited storage"
      ]
    },
    {
      id: "sarah-criteria-1",
      type: "criteria-change",
      date: "Dec 28, 2023",
      title: "Initial conversation",
      summary: "Searching for luxury condos downtown with concierge services.",
      highlights: [
        "Budget: $1.8M",
        "Must have EV parking",
        "Looking for lake view"
      ]
    }
  ],
  "client-3": [
    {
      id: "michael-showing-1",
      type: "showing",
      date: "Dec 05, 2023",
      title: "1st showing: 56 Laurelwood Ave",
      summary: "Loved the smart home features, concerned about small backyard.",
      propertyLink: {
        address: "56 Laurelwood Ave, Waterloo",
        url: "/property/laurelwood-smart-home",
        visitNumber: 1,
        time: "Tue • 2:00 PM"
      }
    },
    {
      id: "michael-status",
      type: "milestone",
      date: "Jan 02, 2024",
      title: "Paused search",
      summary: "Client requested pause while negotiating remote work arrangement."
    },
    {
      id: "michael-criteria-1",
      type: "criteria-change",
      date: "Nov 14, 2023",
      title: "Relocation brief",
      summary: "Relocating from Vancouver, needs move-in ready detached home near tech corridor.",
      highlights: [
        "Budget: $1.4M",
        "Commute: <35 min to Waterloo",
        "Prefer 4 bedrooms"
      ]
    }
  ],
  "client-4": [
    {
      id: "emily-showing-1",
      type: "showing",
      date: "Nov 03, 2023",
      title: "2nd showing: 218 Redpath Ave #1207",
      summary: "Brought partner to second visit, comparing storage options.",
      propertyLink: {
        address: "218 Redpath Ave #1207",
        url: "/property/redpath-1207",
        visitNumber: 2,
        time: "Fri • 5:30 PM"
      },
      highlights: [
        "Feedback: wants to negotiate parking spot",
        "Concerns about upcoming condo fees increase"
      ]
    },
    {
      id: "emily-expired",
      type: "milestone",
      date: "Jan 10, 2024",
      title: "Access expired",
      summary: "Client postponed purchase to Q2. Suggested re-engagement reminder for March."
    },
    {
      id: "emily-criteria-1",
      type: "criteria-change",
      date: "Sep 08, 2023",
      title: "First-time buyer goals",
      summary: "Condo under $650K with low maintenance fees, open concept kitchen.",
      highlights: [
        "Budget: $600K - $650K",
        "Areas: Midtown & Yonge-Eglinton",
        "Must allow pets"
      ]
    }
  ]
};


