// Navigation Data
export const navData = {
  logo: "/logo.png",
  brandName: "NSATWK2026",
  links: [
    { text: "About", href: "#about" },
    { text: "Agenda", href: "#timeline" },
    { text: "Speakers", href: "#mentors" },
    { text: "Judges", href: "#judges" },
    { text: "News", href: "#news" }
  ],
  ctaButton: { text: "Register Now", href: "#register" }
};

// Hero Section Data
export const heroData = {
  badge: "2ND ANNUAL EVENT",
  title: "Nigerian Satellite Week 2026",
  subtitle: "(NSATWK2026)",
  tagline: "Harnessing AI & Space Technologies for Nigeria's Digital Economy",
  date: "February 27-28 2026",
  location: "Abuja Continental Hotel",
  videoSrc: "/hero-background-max-compressed.mp4",
  ctaButtons: [
    { text: "Register for Demo Day", href: "#register", primary: true },
    { text: "Download Agenda", href: "#agenda", primary: false, icon: "download" }
  ]
};

// About Section Data
export const aboutData = {
  title: "About NSATWK2026",
  description: "This is the second edition of Nigeria's premier space technology conference, aimed at fostering innovation and policy development.",
  features: [
    {
      id: 1,
      icon: "./icon-1.png",
      pattern:"./pattern-1.png",
      title: "Showcasing Innovation",
      description: "Highlighting cutting-edge satellite solutions & their applications across sectors."
    },
    {
      id: 2,
       icon: "./icon-2.png",
      pattern:"./pattern-2.png",
      title: "Supporting Startups",
       image:"./supporting_startups.png",
      description: "Propelling startups to the forefront of innovation & growth in the space sector."
    },
    {
      id: 3,
      icon: "./icon-3.png",
      pattern:"./pattern-3.png",
      title: "Market Convergence",
      image:"./market_convergence.png",
      description: "Providing market access by uniting stakeholders in the space industry."
    }
  ]
};

// Timeline Data
export const timelineData = {
  title: "Event Timeline",
  events: [
    // Day 1 — Monday, 30 March 2026 · Accelerator Demo Day
    { id: 1, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Registration & Accreditation", time: "08:00–09:00", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "NIGCOMSAT Team" },
    { id: 2, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "MC Introduction & House Notes", time: "09:00–09:05", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Master of Ceremonies" },
    { id: 3, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Welcome Address", time: "09:05–09:20", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "MD/CEO — Jane Nkechi Egerton-Ideyen" },
    { id: 4, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Chairman's Address", time: "09:20–09:35", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Hon. Minister of Communications, Innovation & Digital Economy" },
    { id: 5, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Keynote Address I", time: "09:35–09:50", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Director-General, NITDA" },
    { id: 6, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Q&A — Keynote Responses", time: "09:50–10:00", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Master of Ceremonies" },
    { id: 7, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Exhibition Tour & Networking Breakfast", time: "10:00–10:30", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "MD/CEO & Guests" },
    { id: 8, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Goodwill Messages", time: "10:30–11:00", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Guest of Honour & Distinguished Guests" },
    { id: 9, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Startup Pitches — Session I", time: "11:00–12:00", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "NIGCOMSAT & Programme Consultants" },
    { id: 10, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Networking Lunch Break", time: "12:00–13:00", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 11, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Keynote Address II + Q&A", time: "13:00–13:20", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "MD/CEO, SMEDAN" },
    { id: 12, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Startup Pitches — Session II", time: "13:20–14:20", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Programme Consultant" },
    { id: 13, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Judges' Feedback & Finalist Reveal", time: "14:20–14:45", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Judges Panel" },
    { id: 14, day: "Day 1 — Accelerator Demo Day", date: "Mar 30, 2026", title: "Closing Remarks — Day 1", time: "14:45–15:00", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Programme Director & MC" },

    // Day 2 — Tuesday, 31 March 2026 · Stakeholders Forum
    { id: 15, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Registration & Networking Breakfast", time: "08:00–09:00", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "NIGCOMSAT Team" },
    { id: 16, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "MC Introduction & House Notes", time: "09:00–09:05", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Master of Ceremonies" },
    { id: 17, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Welcome Address", time: "09:05–09:20", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "MD/CEO — Jane Nkechi Egerton-Ideyen" },
    { id: 18, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Keynote Address + Q&A", time: "09:20–09:40", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Chief of Defence Staff" },
    { id: 19, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Goodwill Messages", time: "09:40–10:10", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Guest of Honour & Distinguished Guests" },
    { id: 20, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Startup Journey Showcase Video", time: "10:10–10:20", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 21, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Panel Session 1: Technology", time: "10:20–11:20", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "AI & Emerging Satellite Technology · Moderator: NIGCOMSAT (DTH)" },
    { id: 22, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Networking & Refreshment Break", time: "11:20–11:35", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 23, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Panel Session 2: Opportunities", time: "11:35–12:35", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Space Economy Investment · Moderator: ONDI" },
    { id: 24, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Spoken Word + Cohort 3.0 Launch", time: "12:35–12:55", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Programme Consultant & MD/CEO" },
    { id: 25, day: "Day 2 — Stakeholders Forum", date: "Mar 31, 2026", title: "Closing Remarks + Networking Luncheon", time: "12:55–14:30", venue: "Abuja Continental Hotel", image: "/background.jpg", description: "Programme Director" },

    // Gala Night — Tuesday, 31 March 2026 · 18:00–22:30
    { id: 26, day: "Gala Night", date: "Mar 31, 2026", title: "Arrivals & Red Carpet Reception", time: "18:00–18:30", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 27, day: "Gala Night", date: "Mar 31, 2026", title: "Nigerian Cultural Showcase", time: "18:30–18:50", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 28, day: "Gala Night", date: "Mar 31, 2026", title: "Introductions of Guests & Dignitaries", time: "18:50–19:05", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 29, day: "Gala Night", date: "Mar 31, 2026", title: "Opening Remarks — MD/CEO", time: "19:05–19:15", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 30, day: "Gala Night", date: "Mar 31, 2026", title: "Special Recognition of International Partners", time: "19:15–19:35", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 31, day: "Gala Night", date: "Mar 31, 2026", title: "NIGCOMSAT @20 Documentary Screening", time: "19:35–20:00", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 32, day: "Gala Night", date: "Mar 31, 2026", title: "Chairman's Toast — NIGCOMSAT @20", time: "20:00–20:10", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 33, day: "Gala Night", date: "Mar 31, 2026", title: "Long Service Awards & Anniversary Cake Cutting", time: "20:10–20:40", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 34, day: "Gala Night", date: "Mar 31, 2026", title: "Accelerator & Stakeholder Awards Ceremony", time: "20:40–21:00", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 35, day: "Gala Night", date: "Mar 31, 2026", title: "Gala Dinner & Live Entertainment", time: "21:00–22:00", venue: "Abuja Continental Hotel", image: "/background.jpg" },
    { id: 36, day: "Gala Night", date: "Mar 31, 2026", title: "Networking & Photography", time: "22:00–22:30", venue: "Abuja Continental Hotel", image: "/background.jpg" },
  ]
};

// Sponsors Data
export const sponsorsData = {
  platinum: [],
  gold: [],
  silver: [],
  government: [
    { name: "Ministry of Communications", logo: "/logos/ministry.png" },
    { name: "NITDA", logo: "/logos/nitda.png" },
    { name: "NARSDA", logo: "/logos/narsda.png" },
    { name: "NCC", logo: "/logos/ncc.png" },
    { name: "SMEDAN", logo: "/logos/smedan.png" },
    { name: "NASENI", logo: "/logos/naseni.png" },
  ],
  media: [],
  supporting: [],
};

// Startup Showcase Data - Constellation/Solar System style
export const startupShowcaseData = {
  title: "The Startup Showcase (Demo Day)",
  subtitle: "Displaying the Urban Lift via Systems",
  startups: [
    {
      id: 1,
      name: "SpaceAgri",
      category: "AgriTech",
      description: "Satellite-based precision agriculture solutions for Nigerian farmers. Using advanced imagery to optimize crop yields.",
      founded: "2022",
      funding: "$500K",
      website: "https://spaceagri.ng",
      logo: "/logo.png"
    },
    {
      id: 2,
      name: "OrbitComms",
      category: "Telecommunications",
      description: "Low-cost satellite internet solutions bridging the digital divide in rural communities across Nigeria.",
      founded: "2021",
      funding: "$1.2M",
      website: "https://orbitcomms.ng",
      logo: "/startups/orbitcomms-logo.png"
    },
    {
      id: 3,
      name: "GeoSecure",
      category: "Security",
      description: "Geospatial intelligence and surveillance systems providing real-time security monitoring.",
      founded: "2023",
      funding: "$750K",
      website: "https://geosecure.ng",
      logo: "/startups/geosecure-logo.png"
    },
    {
      id: 4,
      name: "SatHealth",
      category: "HealthTech",
      description: "Telemedicine platform powered by satellite connectivity reaching remote healthcare facilities.",
      founded: "2022",
      funding: "$600K",
      website: "https://sathealth.ng",
      logo: "/startups/sathealth-logo.png"
    },
    {
      id: 5,
      name: "AstroLogistics",
      category: "Logistics",
      description: "Satellite tracking and fleet management solutions for efficient supply chain operations.",
      founded: "2021",
      funding: "$900K",
      website: "https://astrologistics.ng",
      logo: "/startups/astrologistics-logo.png"
    },
    {
      id: 6,
      name: "EarthWatch",
      category: "Environment",
      description: "Climate monitoring and environmental analysis platform tracking deforestation and pollution.",
      founded: "2023",
      funding: "$450K",
      website: "https://earthwatch.ng",
      logo: "/startups/earthwatch-logo.png"
    },
    {
      id: 7,
      name: "NaviSat",
      category: "Navigation",
      description: "Precision navigation systems for maritime and aviation industries across West Africa.",
      founded: "2020",
      funding: "$1.5M",
      website: "https://navisat.ng",
      logo: "/startups/navisat-logo.png"
    },
    {
      id: 8,
      name: "DataOrbit",
      category: "Data Analytics",
      description: "Big data analytics platform processing satellite imagery for actionable business insights.",
      founded: "2022",
      funding: "$800K",
      website: "https://dataorbit.ng",
      logo: "/startups/dataorbit-logo.png"
    },
    {
      id: 9,
      name: "SpaceEdu",
      category: "EdTech",
      description: "Space science education and STEM programs inspiring the next generation of Nigerian scientists.",
      founded: "2023",
      funding: "$300K",
      website: "https://spaceedu.ng",
      logo: "/startups/spaceedu-logo.png"
    },
    {
      id: 10,
      name: "SolarNet",
      category: "Energy",
      description: "Solar energy optimization using satellite data for renewable energy project planning.",
      founded: "2021",
      funding: "$700K",
      website: "https://solarnet.ng",
      logo: "/startups/solarnet-logo.png"
    },
    {
      id: 11,
      name: "AquaSat",
      category: "Water Management",
      description: "Water resource monitoring and management systems for sustainable water usage.",
      founded: "2022",
      funding: "$550K",
      website: "https://aquasat.ng",
      logo: "/startups/aquasat-logo.png"
    },
    {
      id: 12,
      name: "UrbanSight",
      category: "Urban Planning",
      description: "Smart city planning with satellite analytics enabling data-driven urban development.",
      founded: "2023",
      funding: "$650K",
      website: "https://urbansight.ng",
      logo: "/startups/urbansight-logo.png"
    }
  ]
};

// Mentors Data
export const mentorsData = {
  title: "The Mentors",
  description: "Meet the seasoned professionals guiding the next generation of space entrepreneurs and startup founders.",
  mentors: [
    {
      id: 1,
      name: "Jane Egerton-Idehen",
      title: "CEO & Founder",
      organization: "Space Innovation Hub",
      image: "/mentors/mentor1.jpg",
      bio: "Former Microsoft executive with 20+ years in tech leadership across Africa."
    },
    {
      id: 2,
      name: "Dr. Nasun Tipre",
      title: "Director",
      organization: "NASRDA",
      image: "/mentors/mentor2.jpg",
      bio: "Leading researcher in satellite communications and space policy development."
    },
    {
      id: 3,
      name: "Lieutenant General Olufemi Oluyede",
      title: "Chief of Army Staff",
      organization: "Nigerian Army",
      image: "/mentors/mentor3.jpg",
      bio: "Defense satellite communications specialist with decades of experience."
    },
    {
      id: 4,
      name: "Kashifu Inuwa Abdullahi",
      title: "Director General",
      organization: "NITDA",
      image: "/mentors/mentor4.jpg",
      bio: "Director General of Nigeria's IT Development Agency driving digital transformation."
    }
  ]
};

// Hosts & Keynotes Data
export const hostsData = {
  title: "The Hosts & Keynotes",
  description: "Meet the seasoned professionals guiding the next generation of space entrepreneurs as it grow startups in Africa.",
  hosts: [
    {
      id: 1,
      name: "Jane Egerton-Idehen",
      role: "Host",
      organization: "Space Innovation Hub",
      image: "/speaker-1.png"
    },
    {
      id: 2,
      name: "Dr. Nasun Tipre",
      role: "Keynote Speaker",
      organization: "NASRDA",
      image: "/speaker-2.png"
    },
    {
      id: 3,
      name: "Lieutenant General Olufemi Oluyede",
      role: "Special Guest",
      organization: "Nigerian Army",
      image: "/speaker-1.png"
    },
    {
      id: 4,
      name: "Kashifu Inuwa Abdullahi",
      role: "Keynote Speaker",
      organization: "NITDA",
      image: "/hosts/host4.jpg"
    }
  ]
};

// Panelists/Institutions Data
export const panelistsData = {
  title: "The Panelists (Institutions)",
  categories: [
    { 
      name: "Representing Tech", 
      institutions: [
        { id: 1, name: "NASENI", logo: "/logos/naseni.png" },
        { id: 2, name: "Ministry", logo: "/logos/ministry.png" },
        { id: 3, name: "MOFI", logo: "/logos/mofi.png" },
        { id: 4, name: "ONDI", logo: "/logos/ondi.png" }
      ]
    },
    { 
      name: "Representing Investment", 
      institutions: [
        { id: 5, name: "NCC", logo: "/logos/ncc.png" },
        { id: 6, name: "INTELSAT", logo: "/logos/intelsat.png" },
        { id: 7, name: "3MTT", logo: "/logos/3mtt.png" },
        { id: 8, name: "FUTURE AFRICA", logo: "/logos/future-africa.png" }
      ]
    }
  ]
};

// Countdown Data
export const countdownData = {
  title: "Countdown to NSATWK2026",
  description: "Join us for 2 days to learn and enjoy fun-filled events exploring the future of satellites.",
  targetDate: "2026-02-27T09:00:00",
  backgroundVideo:"./bg.mp4"
};

// Footer Data
export const footerData = {
  logo: "/logo.png",
  companyName: "NIDCOMP",
  tagline: "Driving Nigeria's Space Economy",
  address: "Plot 564 A Cadastral Zone, Abuja",
  phone: "+234 9038 886 785",
  email: "info@nidcomp.com",
  workingHours: "9am—5pm",
  socialLinks: [
    { platform: "twitter", url: "#", icon: "twitter" },
    { platform: "linkedin", url: "#", icon: "linkedin" },
    { platform: "instagram", url: "#", icon: "instagram" },
    { platform: "facebook", url: "#", icon: "facebook" }
  ],
  navLinks: [
    { text: "Agenda", href: "#timeline" },
    { text: "Speakers", href: "#mentors" },
    { text: "Partners", href: "#panelists" }
  ]
};