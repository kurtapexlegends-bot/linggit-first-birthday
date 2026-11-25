import { EventConfig } from "@/types";

export const eventConfig: EventConfig = {
  celebrant: {
    fullName: "Baby Linggit",
    nickname: "Linggit",
    turningAge: 1,
    tagline: "Our Little Sunshine is Turning One!",
    photoPlaceholder: "/images/linggit.png",
  },
  event: {
    date: "2026-12-12",
    displayDate: "Saturday, December 12, 2026",
    time: "2:00 PM - 6:00 PM",
    displayTime: "2:00 PM - 6:00 PM (Party starts promptly at 2:30 PM)",
    calendarStartDate: "20261212T060000Z",
    calendarEndDate: "20261212T100000Z",
  },
  venue: {
    name: "The Grand Sunshine Pavilion & Clubhouse",
    hallOrArea: "Main Celebration Hall (Airconditioned)",
    address: "123 Sunflower Boulevard, Emerald Hills Subdivision, Pasig City, Metro Manila",
    landmarks: "Near Emerald Park Clubhouse & opposite Sunflower Cafe. Free basement & street parking available.",
    googleMapsUrl: "https://maps.google.com/?q=Pasig+City+Metro+Manila",
    wazeUrl: "https://waze.com/ul?q=Pasig+City",
    embedMapQuery: "Pasig+City+Metro+Manila",
  },
  dressCode: {
    themeName: "Cozy Neutrals & Soft Earth Tones",
    description: "Ms. Rachel invites everyone to wear comfortable, picture-perfect neutral tones! Let's keep the atmosphere calm, warm, and photogenic.",
    tip: "Feel free to wear casual chic, linens, cotton polos, or airy sundresses. Ms. Rachel will bring the bright pop of pink and blue!",
    colors: [
      {
        name: "Oatmeal / Cream",
        hex: "#F5F2EB",
        category: "neutral",
        description: "Soft off-white and linen shades",
        recommendedFor: "Tops, polos, linen shirts, sundresses",
      },
      {
        name: "Warm Taupe",
        hex: "#D7C4B7",
        category: "neutral",
        description: "Gentle warm earth tone",
        recommendedFor: "Pants, skirts, knit cardigans",
      },
      {
        name: "Light Khaki / Tan",
        hex: "#C2B280",
        category: "neutral",
        description: "Classic earthy sand",
        recommendedFor: "Shorts, chinos, jumpsuits",
      },
      {
        name: "Muted Sage",
        hex: "#B4C5B0",
        category: "neutral",
        description: "Subtle hint of soft natural greenery",
        recommendedFor: "Dresses, button-down shirts",
      },
      {
        name: "Clean White",
        hex: "#FFFFFF",
        category: "neutral",
        description: "Fresh and timeless",
        recommendedFor: "Sneakers, blazers, basic tees",
      },
    ],
  },
  milestones: {
    subtitle: "Linggit's Big Year & Favorite Things",
    favorites: {
      songAndShow: "Potty Tinay / Ms. Rachel (Songs for Littles)",
      toy: "Singing Herbie, Musical Learning Blocks & Squishy Animals",
      snack: "Banana puffs, avocado puree & soft baby pancakes",
      activity: "Dancing with hands in the air, babbling 'Mama' & clappin' to the beat",
    },
    stats: [
      {
        icon: "🎂",
        label: "Age Today",
        value: "1st Birthday (365 Days of Joy)",
      },
      {
        icon: "🦷",
        label: "Tiny Chompers",
        value: "6 Pearly Teeth",
      },
      {
        icon: "👣",
        label: "Superpower",
        value: "Cruising & Walking with Support",
      },
      {
        icon: "🎵",
        label: "Top Spotify / YouTube",
        value: "Potty Tinay & You Are My Sunshine",
      },
    ],
    quote: "Can you say one? Put your finger in the air and count: ONE! Good job!",
  },
  program: [
    {
      time: "2:00 PM",
      title: "Welcome Friends & Guest Arrivals",
      description: "Photo wall opens, welcome refreshments, and background nursery tunes.",
      badge: "Arrivals",
    },
    {
      time: "2:30 PM",
      title: "Linggit’s grand entrance",
      description: "With special Ms. Rachel sing-along welcome countdown!",
      badge: "Must Watch",
    },
    {
      time: "3:00 PM",
      title: "Ms. Rachel Themed Games & Interactive Fun",
      description: "Sensory games, parachute play for toddlers, and fun trivia for grown-ups.",
      badge: "Games",
    },
    {
      time: "4:00 PM",
      title: "Afternoon Feast & Birthday Cake Blowing",
      description: "Singing 'You Are My Sunshine' and blowing Linggit's first birthday candle.",
      badge: "Cake Ceremony",
    },
    {
      time: "5:00 PM",
      title: "Loot Bags, Giveaways & Family Photos",
      description: "Special toddler sensory party favors and thank you hugs.",
      badge: "Giveaways",
    },
  ],
  rsvp: {
    deadline: "November 30, 2026",
    contactPersons: [
      {
        name: "Mommy / Daddy",
        role: "Parents of Linggit",
        phone: "+63 917 123 4567",
        messengerUrl: "https://m.me/",
        whatsappNumber: "+639171234567",
      },
    ],
    notes: [
      "Kindly RSVP by November 30 to help us reserve your seats and prepare toddler loot bags.",
      "Kid-friendly and infant-safe food will be served.",
      "The venue has a private nursing and diaper-changing corner for parents.",
    ],
  },
};
