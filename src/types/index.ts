export interface PaletteColor {
  name: string;
  hex: string;
  category: "neutral" | "accent";
  description: string;
  recommendedFor: string;
}

export interface MilestoneItem {
  icon: string;
  label: string;
  value: string;
  description?: string;
}

export interface EventProgramItem {
  time: string;
  title: string;
  description?: string;
  badge?: string;
}

export interface EventConfig {
  celebrant: {
    fullName: string;
    nickname: string;
    turningAge: number;
    tagline: string;
    photoPlaceholder: string;
  };
  event: {
    date: string;
    displayDate: string;
    time: string;
    displayTime: string;
    calendarStartDate: string; // ISO format for calendar export
    calendarEndDate: string;
  };
  venue: {
    name: string;
    hallOrArea: string;
    address: string;
    landmarks: string;
    googleMapsUrl: string;
    wazeUrl: string;
    embedMapQuery: string;
  };
  dressCode: {
    themeName: string;
    description: string;
    tip: string;
    colors: PaletteColor[];
  };
  milestones: {
    subtitle: string;
    favorites: {
      songAndShow: string;
      toy: string;
      snack: string;
      activity: string;
    };
    stats: MilestoneItem[];
    quote: string;
  };
  program: EventProgramItem[];
  rsvp: {
    deadline: string;
    contactPersons: {
      name: string;
      role: string;
      phone: string;
      messengerUrl?: string;
      whatsappNumber?: string;
    }[];
    notes: string[];
  };
}
